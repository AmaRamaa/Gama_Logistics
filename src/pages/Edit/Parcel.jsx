import { useEffect, useState } from 'react';
import { supabase } from '../../supaBase/supaBase';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function LocationMarker({ setForm, setMapCenter }) {
    useMapEvents({
        click(e) {
            setForm(prev => ({
                ...prev,
                recipient_location: `${e.latlng.lat.toFixed(6)},${e.latlng.lng.toFixed(6)}`
            }));
            setMapCenter([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

function MoveMapToMarker({ lat, lng }) {
    const map = useMapEvents({});
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng]);
        }
    }, [lat, lng, map]);
    return null;
}

const ParcelEditPage = () => {
    const [parcels, setParcels] = useState([]);
    const [editingParcel, setEditingParcel] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [form, setForm] = useState({});
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]);

    // New state for related tables
    const [routes, setRoutes] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [users, setUsers] = useState([]);

    // Fetch all related data
    useEffect(() => {
        const fetchData = async () => {
            const { data: routesData } = await supabase.from("Routes").select("*");
            setRoutes(routesData || []);

            const { data: vehiclesData } = await supabase.from("Vehicles").select("*");
            setVehicles(vehiclesData || []);

            const { data: driversData } = await supabase.from("Drivers").select("*");
            setDrivers(driversData || []);

            const { data: usersData } = await supabase.from("Users").select("*");
            setUsers(usersData || []);
        };
        fetchData();
    }, []);

    const fetchParcels = async () => {
        const { data, error } = await supabase.from('Parcels').select('*');
        if (!error) setParcels(data || []);
    };

    useEffect(() => {
        fetchParcels();
    }, []);

    const handleEdit = (parcel) => {
        setEditingParcel(parcel);
        setForm({
            recipient_name: parcel.recipient_name || '',
            recipient_address: parcel.recipient_address || '',
            status: parcel.status || '',
            weight: parcel.weight || '',
            dimensions: parcel.dimensions || '',
            recipient_location: parcel.recipient_location || '',
        });
        if (parcel.recipient_location && parcel.recipient_location.includes(',')) {
            const [lat, lng] = parcel.recipient_location.split(',').map(Number);
            if (!isNaN(lat) && !isNaN(lng)) setMapCenter([lat, lng]);
        }
        setShowOverlay(true);
    };

    const handleDelete = async (parcelId) => {
        if (window.confirm('Are you sure you want to delete this parcel?')) {
            await supabase.from('Parcels').delete().eq('id', parcelId);
            fetchParcels();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        await supabase
            .from('Parcels')
            .update(form)
            .eq('id', editingParcel.id);
        setShowOverlay(false);
        setEditingParcel(null);
        fetchParcels();
    };

    const handleOverlayClose = () => {
        setShowOverlay(false);
        setEditingParcel(null);
    };

    // Helper: get driver name for a vehicle
    const getDriverForVehicle = (vehicleId) => {
        const driver = drivers.find(d => String(d.vehicle_id) === String(vehicleId));
        if (!driver) return "No driver";
        const user = users.find(u => String(u.id) === String(driver.user_id));
        if (user) {
            return user.name || `User ${user.id}`;
        }
        return "No user";
    };

    // Helper: get vehicle for a parcel (if you have vehicle_id in parcel)
    const getVehicleForParcel = (parcel) => {
        if (!parcel.vehicle_id) {
            return "No vehicle";
        }
        const vehicle = vehicles.find(v => String(v.id) === String(parcel.vehicle_id));
        console.log(vehicle);
        return vehicle ? vehicle.name || `Vehicle ${vehicle.id}` : "No vehicle";
    };

    // Helper: get route for a parcel (if you have route_id in parcel)
    const getRouteForParcel = (parcel) => {
        if (!parcel.route_id) return "No route";
        const route = routes.find(r => String(r.id) === String(parcel.route_id));
        return route ? route.name || `Route ${route.id}` : "No route";
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Edit Parcels Page</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Recipient Name</th>
                            <th>Recipient Address</th>
                            <th>Status</th>
                            <th>Weight</th>
                            <th>Dimensions</th>
                            <th>Recipient Location</th>
                            <th>Vehicle</th>
                            <th>Driver</th>
                            <th>Route</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcels.map(parcel => (
                            <tr key={parcel.id}>
                                <td>{parcel.id}</td>
                                <td>{parcel.recipient_name}</td>
                                <td>{parcel.recipient_address}</td>
                                <td>{parcel.status}</td>
                                <td>{parcel.weight}</td>
                                <td>{parcel.dimensions}</td>
                                <td>{parcel.recipient_location || ''}</td>
                                <td>{getVehicleForParcel(parcel)}</td>
                                <td>{getDriverForVehicle(parcel.vehicle_id)}</td>
                                <td>{getRouteForParcel(parcel)}</td>
                                <td>{parcel.created_at}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary mr-2" onClick={() => handleEdit(parcel)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(parcel.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showOverlay && editingParcel && (
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
                        <h4>Edit Parcel</h4>
                        <div className="form-group">
                            <label>Recipient Name</label>
                            <input className="form-control" name="recipient_name" value={form.recipient_name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Recipient Address</label>
                            <input className="form-control" name="recipient_address" value={form.recipient_address} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select className="form-control" name="status" value={form.status} onChange={handleChange}>
                                <option value="">Select status</option>
                                <option value="pending">Pending</option>
                                <option value="planning">Planning</option>
                                <option value="in_transit">In Transit</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Weight (kg)</label>
                            <input className="form-control" type="number" name="weight" value={form.weight} onChange={handleChange} min="0" step="0.01" />
                        </div>
                        <div className="form-group">
                            <label>Dimensions</label>
                            <input className="form-control" name="dimensions" value={form.dimensions} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Recipient Location (Lat, Lng)</label>
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
                                    <LocationMarker setForm={setForm} setMapCenter={setMapCenter} />
                                    <MoveMapToMarker
                                        lat={form.recipient_location && form.recipient_location.includes(',') ? parseFloat(form.recipient_location.split(',')[0]) : null}
                                        lng={form.recipient_location && form.recipient_location.includes(',') ? parseFloat(form.recipient_location.split(',')[1]) : null}
                                    />
                                    {form.recipient_location && form.recipient_location.includes(',') && (
                                        <Marker position={form.recipient_location.split(',').map(Number)}>
                                            <Popup>
                                                Parcel Location<br />
                                                Lat: {form.recipient_location.split(',')[0]}<br />
                                                Lng: {form.recipient_location.split(',')[1]}
                                            </Popup>
                                        </Marker>
                                    )}
                                </MapContainer>
                            </div>
                            <input
                                type="text"
                                className="form-control mt-2"
                                name="recipient_location"
                                value={form.recipient_location || ''}
                                readOnly
                                placeholder="Location (lat,lng)"
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                            <button className="btn btn-secondary mr-2" onClick={handleOverlayClose}>
                                Cancel
                            </button>
                            <button className="btn btn-success" onClick={handleSave}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParcelEditPage;