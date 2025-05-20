import { useEffect, useState } from 'react';
import { supabase } from '../../supaBase/supaBase';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// LocationMarker component for selecting location on the map
function LocationMarker({ setMarker, setForm }) {
    useMapEvents({
        click(e) {
            setMarker({ lat: e.latlng.lat, lng: e.latlng.lng });
            setForm((prev) => ({
                ...prev,
                latitude: e.latlng.lat.toFixed(6),
                longitude: e.latlng.lng.toFixed(6),
            }));
        },
    });
    return null;
}

const Driver = () => {
    const [drivers, setDrivers] = useState([]);
    const [driverUsers, setDriverUsers] = useState([]);
    const [vehicles, setVehicles] = useState([]);

    const exportToCSV = () => {
        const headers = [
            'ID',
            'User Name',
            'License Number',
            'Rating',
            'Status',
            'Latitude',
            'Longitude',
            'Last Service Date',
            'Assigned Vehicle',
            'Created At',
            'Updated At',
            'Vehicle Model',
            'Vehicle Plate'
        ];

        const rows = drivers.map(driver => {
            const user = driverUsers.find(u => u.id === driver.user_id);
            const vehicle = vehicles.find(v => v.id === driver.vehicle_id);
            return [
                driver.id,
                user ? user.name : driver.user_id,
                driver.license_number,
                driver.rating,
                driver.status,
                driver.latitude,
                driver.longitude,
                driver.last_service_date || '-',
                driver.assigned_vehicle || '-',
                driver.created_at,
                driver.updated_at || '-',
                vehicle ? vehicle.model : '-',
                vehicle ? vehicle.license_plate : '-'
            ];
        });

        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'drivers.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const fetchAll = async () => {
        const [
            { data: driversData, error: driversError },
            { data: usersData },
            { data: vehiclesData }
        ] = await Promise.all([
            supabase.from('Drivers').select('*'),
            supabase.from('Users').select('*').eq('role', 'driver'),
            supabase.from('Vehicles').select('*'),
        ]);
        if (!driversError) setDrivers(driversData || []);
        setDriverUsers(usersData || []);
        setVehicles(vehiclesData || []);
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const [editingDriver, setEditingDriver] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [form, setForm] = useState({});

    const handleEdit = (driver) => {
        setEditingDriver(driver);
        setForm({
            license_number: driver.license_number || '',
            rating: driver.rating || '',
            status: driver.status || '',
            latitude: driver.latitude || '',
            longitude: driver.longitude || '',
            last_service_date: driver.last_service_date || '',
            assigned_vehicle: driver.assigned_vehicle || '',
            vehicle_id: driver.vehicle_id || '',
        });
        setShowOverlay(true);
    };

    const handleDelete = async (driverId) => {
        if (window.confirm('Are you sure you want to delete this driver?')) {
            await supabase.from('Drivers').delete().eq('id', driverId);
            fetchAll();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        await supabase
            .from('Drivers')
            .update({
                ...form,
                rating: form.rating ? Number(form.rating) : null,
                latitude: form.latitude ? Number(form.latitude) : null,
                longitude: form.longitude ? Number(form.longitude) : null,
                vehicle_id: form.vehicle_id ? Number(form.vehicle_id) : null,
            })
            .eq('id', editingDriver.id);
        setShowOverlay(false);
        setEditingDriver(null);
        fetchAll();
    };

    const handleOverlayClose = () => {
        setShowOverlay(false);
        setEditingDriver(null);
    };

    // State to control map center
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]);

    // Update map center when editing a driver
    useEffect(() => {
        if (showOverlay && form.latitude && form.longitude) {
            setMapCenter([parseFloat(form.latitude), parseFloat(form.longitude)]);
        }
    }, [showOverlay, form.latitude, form.longitude]);

    // Custom component to move map when marker changes
    function MoveMapToMarker({ lat, lng }) {
        const map = useMapEvents({});
        useEffect(() => {
            if (lat && lng) {
                map.setView([lat, lng]);
            }
        }, [lat, lng, map]);
        return null;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Edit Driver Page</h2>
            <h3>Drivers</h3>
            <button className="btn btn-outline-success mb-3" onClick={exportToCSV}>
                Export as CSV
            </button>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>User Name</th>
                            <th>License Number</th>
                            <th>Rating</th>
                            <th>Status</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Last Service Date</th>
                            <th>Assigned Vehicle</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Vehicle ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map(driver => {
                            const user = driverUsers.find(u => u.id === driver.user_id);
                            const vehicle = vehicles.find(v => v.id === driver.vehicle_id);
                            return (
                                <tr key={driver.id}>
                                    <td>{driver.id}</td>
                                    <td>{user ? user.name : driver.user_id}</td>
                                    <td>{driver.license_number}</td>
                                    <td>{driver.rating}</td>
                                    <td>
                                        <span className={`badge ${driver.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>
                                            {driver.status}
                                        </span>
                                    </td>
                                    <td>{driver.latitude}</td>
                                    <td>{driver.longitude}</td>
                                    <td>{driver.last_service_date || '-'}</td>
                                    <td>{driver.assigned_vehicle || '-'}</td>
                                    <td>{driver.created_at}</td>
                                    <td>{driver.updated_at || '-'}</td>
                                    <td>{vehicle ? vehicle.model + " | " + vehicle.license_plate : driver.vehicle_id}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary mr-2" onClick={() => handleEdit(driver)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(driver.id)}>Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {showOverlay && editingDriver && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                    }}
                >
                    <div style={{ background: '#fff', padding: 30, borderRadius: 8, minWidth: 350, position: 'relative', maxWidth: 500 }}>
                        <button
                            style={{ position: 'absolute', top: 10, right: 10, border: 'none', background: 'transparent', fontSize: 20 }}
                            onClick={handleOverlayClose}
                        >
                            &times;
                        </button>
                        <h4>Edit Driver</h4>
                        <div className="form-group">
                            <label>License Number</label>
                            <input className="form-control" name="license_number" value={form.license_number} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Rating</label>
                            <input className="form-control" name="rating" type="number" value={form.rating} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select className="form-control" name="status" value={form.status} onChange={handleChange}>
                                <option value="">-- Select Status --</option>
                                <option value="Idle">Idle</option>
                                <option value="Active">Active</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Last Service Date</label>
                            <input className="form-control" name="last_service_date" type="date" value={form.last_service_date} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Assigned Vehicle</label>
                            <input className="form-control" name="assigned_vehicle" value={form.assigned_vehicle} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Vehicle</label>
                            <select className="form-control" name="vehicle_id" value={form.vehicle_id} onChange={handleChange}>
                                <option value="">-- Select Vehicle --</option>
                                {vehicles.map(v => (
                                    <option key={v.id} value={v.id}>{v.model + " | " + v.license_plate}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Location (Lat, Lng)</label>
                            <div className="mb-2" style={{ width: '100%', height: 250 }}>
                                {/* Map overlay for editing location */}
                                <MapContainer
                                    center={mapCenter}
                                    zoom={13}
                                    scrollWheelZoom={true}
                                    style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <LocationMarker
                                        setMarker={({ lat, lng }) => {
                                            setForm(prev => ({
                                                ...prev,
                                                latitude: lat.toFixed(6),
                                                longitude: lng.toFixed(6),
                                            }));
                                            setMapCenter([lat, lng]);
                                        }}
                                        setForm={setForm}
                                    />
                                    <MoveMapToMarker
                                        lat={form.latitude ? parseFloat(form.latitude) : null}
                                        lng={form.longitude ? parseFloat(form.longitude) : null}
                                    />
                                    {form.latitude && form.longitude && (
                                        <Marker position={[parseFloat(form.latitude), parseFloat(form.longitude)]}>
                                            <Popup>
                                                Driver Location<br />
                                                Lat: {form.latitude}<br />
                                                Lng: {form.longitude}
                                            </Popup>
                                        </Marker>
                                    )}
                                </MapContainer>
                            </div>
                            <div className="row g-2">
                                <div className="col">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="latitude"
                                        value={form.latitude}
                                        readOnly
                                        placeholder="Latitude"
                                    />
                                </div>
                                <div className="col">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="longitude"
                                        value={form.longitude}
                                        readOnly
                                        placeholder="Longitude"
                                    />
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-success mr-2" onClick={handleSave}>Save</button>
                        <button className="btn btn-secondary mr-2" onClick={handleOverlayClose}>Cancel</button>
                        <button
                            className="btn btn-info"
                            onClick={async () => {
                                // Find assigned vehicle by vehicle_id
                                const assignedVehicle = vehicles.find(v => v.id === Number(form.vehicle_id));
                                if (
                                    assignedVehicle &&
                                    Array.isArray(assignedVehicle.locations) &&
                                    assignedVehicle.locations.length === 2
                                ) {
                                    const [lat, lng] = assignedVehicle.locations;
                                    if (
                                        typeof lat === 'string' || typeof lat === 'number'
                                    ) {
                                        setForm(prev => ({
                                            ...prev,
                                            latitude: parseFloat(lat).toFixed(6),
                                            longitude: parseFloat(lng).toFixed(6),
                                        }));
                                        setMapCenter([parseFloat(lat), parseFloat(lng)]);
                                    } else {
                                        alert('Assigned vehicle location format invalid.');
                                    }
                                } else {
                                    alert('Assigned vehicle location not found.');
                                }
                            }}
                        >
                            Send Driver to Assigned Vehicle
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Driver;