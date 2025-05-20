import { useEffect, useState } from 'react';
import { supabase } from '../../supaBase/supaBase';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Component for selecting location on the map
function LocationMarker({ setForm, setMapCenter }) {
    useMapEvents({
        click(e) {
            // When the map is clicked, update the locations, latitude, and longitude fields
            const lat = e.latlng.lat.toFixed(6);
            const lng = e.latlng.lng.toFixed(6);
            setForm((prev) => ({
                ...prev,
                locations: `${lat},${lng}`,
                latitude: lat,
                longitude: lng,
            }));
            setMapCenter([parseFloat(lat), parseFloat(lng)]);
        },
    });
    return null;
}

// Move map to marker when changed
function MoveMapToMarker({ lat, lng }) {
    const map = useMapEvents({});
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng]);
        }
    }, [lat, lng, map]);
    return null;
}

const VehicleEdit = () => {
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [form, setForm] = useState({});
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]);

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
            { data: vehiclesData },
            { data: driversData }
        ] = await Promise.all([
            supabase.from('Vehicles').select('*'),
            supabase.from('Drivers').select('*'),
        ]);
        setVehicles(vehiclesData || []);
        setDrivers(driversData || []);
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleEdit = (vehicle) => {
        setEditingVehicle(vehicle);
        setForm({
            model: vehicle.model || '',
            license_plate: vehicle.license_plate || '',
            status: vehicle.status || '',
            locations: vehicle.locations || '',
            last_maintenance_date: vehicle.last_maintenance_date ? vehicle.last_maintenance_date.split('T')[0] : '',
        });
        setShowOverlay(true);
    };

    const handleDelete = async (vehicleId) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            await supabase.from('Vehicles').delete().eq('id', vehicleId);
            fetchAll();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        // Convert locations string to array of strings if not empty
        let locationsArray = [];
        if (form.locations && typeof form.locations === 'string') {
            const parts = form.locations.split(',').map(s => s.trim());
            if (parts.length === 2 && parts[0] && parts[1]) {
                locationsArray = [parts[0], parts[1]];
            }
        }

        // Create a copy of form and remove latitude and longitude
        const { latitude, longitude, ...restForm } = form;

        const payload = {
            ...restForm,
            locations: locationsArray.length === 2 ? locationsArray : null
        };

        await supabase
            .from('Vehicles')
            .update(payload)
            .eq('id', editingVehicle.id);

        setShowOverlay(false);
        setEditingVehicle(null);
        fetchAll();
    };



    const handleOverlayClose = () => {
        setShowOverlay(false);
        setEditingVehicle(null);
    };

    useEffect(() => {
        if (showOverlay && form.latitude && form.longitude) {
            setMapCenter([parseFloat(form.latitude), parseFloat(form.longitude)]);
        }
    }, [showOverlay, form.latitude, form.longitude]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Edit Vehicle Page</h2>
            <h3>Vehicles</h3>
            <button className="btn btn-outline-success mb-3" onClick={exportToCSV}>
                Export as CSV
            </button>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Model</th>
                            <th>License Plate</th>
                            <th>Status</th>
                            <th>Locations</th>
                            <th>Last Service Date</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map(vehicle => {
                            return (
                                <tr key={vehicle.id}>
                                    <td>{vehicle.id}</td>
                                    <td>{vehicle.model}</td>
                                    <td>{vehicle.license_plate}</td>
                                    <td>
                                        <span style={{ color: "black" }} className={`badge ${vehicle.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>
                                            {vehicle.status}
                                        </span>
                                    </td>
                                    <td>{vehicle.locations}</td>
                                    <td>{vehicle.last_maintenance_date || '-'}</td>
                                    <td>{vehicle.created_at}</td>
                                    <td>{vehicle.updated_at || '-'}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary mr-2" onClick={() => handleEdit(vehicle)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(vehicle.id)}>Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {showOverlay && editingVehicle && (
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
                        <h4>Edit Vehicle</h4>
                        <div className="form-group">
                            <label>Model</label>
                            <input className="form-control" name="model" value={form.model} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>License Plate</label>
                            <input className="form-control" name="license_plate" value={form.license_plate} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select className="form-control" name="status" value={form.status} onChange={handleChange}>
                                <option value="">-- Select Status --</option>
                                <option value="in_use">In Use</option>
                                <option value="active">Active</option>
                                <option value="maintenance">In Maintenance</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Last Service Date</label>
                            <input className="form-control" name="last_maintenance_date" type="date" value={form.last_service_date} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Location (Lat, Lng)</label>
                            <div className="mb-2" style={{ width: '100%', height: 250 }}>
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
                                        setForm={setForm}
                                        setMapCenter={setMapCenter}
                                    />
                                    <MoveMapToMarker
                                        lat={form.latitude ? parseFloat(form.latitude) : null}
                                        lng={form.longitude ? parseFloat(form.longitude) : null}
                                    />
                                    {form.latitude && form.longitude && (
                                        <Marker position={[parseFloat(form.latitude), parseFloat(form.longitude)]}>
                                            <Popup>
                                                Vehicle Location<br />
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
                        <button className="btn btn-secondary" onClick={handleOverlayClose}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleEdit;