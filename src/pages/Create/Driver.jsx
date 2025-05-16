import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../supaBase/supaBase';
import 'bootstrap/dist/css/bootstrap.min.css';

// Helper component for map click events
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
    const [form, setForm] = useState({
        user_id: '',
        license_number: '',
        rating: '',
        status: 'Active',
        latitude: '',
        longitude: '',
        vehicle_id: '',
    });

    const [drivers, setDrivers] = useState([]);
    const [marker, setMarker] = useState({ lat: 0, lng: 0 });
    const [driverUsers, setDriverUsers] = useState([]);
    const [vehicles, setVehicles] = useState([]);

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
        console.log(usersData);
        setDriverUsers(usersData || []);
        setVehicles(vehiclesData || []);
    };
    useEffect(() => {
        fetchAll();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.vehicle_id) {
            alert('Please assign a vehicle.');
            return;
        }

        const existingDriver = drivers.find(driver => driver.user_id === form.user_id);

        if (existingDriver) {
            // Update existing driver
            const { error: updateError } = await supabase
                .from('Drivers')
                .update({
                    license_number: form.license_number,
                    rating: form.rating,
                    status: form.status,
                    latitude: form.latitude,
                    longitude: form.longitude,
                    vehicle_id: form.vehicle_id,
                    updated_at: new Date(),
                })
                .eq('user_id', form.user_id);

            if (updateError) {
                alert('Error updating driver: ' + updateError.message);
                return;
            }

            // Update vehicle status
            const { error: vehicleError } = await supabase
                .from('Vehicles')
                .update({ status: 'in_use' })
                .eq('id', form.vehicle_id);

            if (vehicleError) {
                alert('Driver updated, but failed to update vehicle status: ' + vehicleError.message);
            } else {
                alert('Driver updated successfully!');
            }
        } else {
            // Check for duplicate license number before insert
            const duplicateLicense = drivers.find(
                driver => driver.license_number === form.license_number
            );
            if (duplicateLicense) {
                alert('A driver with this license number already exists. Please use a unique license number.');
                return;
            }

            // Insert new driver
            const { error } = await supabase.from('Drivers').insert([{
                ...form,
                vehicle_id: form.vehicle_id,
                created_at: new Date(),
                updated_at: new Date(),
            }]);

            if (error) {
                alert('Error creating driver: ' + error.message);
                return;
            }

            // Update vehicle status
            const { error: vehicleError } = await supabase
                .from('Vehicles')
                .update({ status: 'in_use' })
                .eq('id', form.vehicle_id);

            if (vehicleError) {
                alert('Driver created, but failed to update vehicle status: ' + vehicleError.message);
            } else {
                alert('Driver created successfully!');
            }
        }

        // Reset form
        setForm({
            user_id: '',
            license_number: '',
            rating: '',
            status: 'Active',
            latitude: '',
            longitude: '',
            vehicle_id: '',
        });
        setMarker({ lat: 0, lng: 0 });

        fetchAll(); // Refresh data
    };



    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Create Driver</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Driver</label>
                                    <select
                                        className="form-select"
                                        name="user_id"
                                        value={form.user_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Driver</option>
                                        {driverUsers.map(user => (

                                            <option key={user.id} value={user.id}>
                                                {user.username || user.name || user.id}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">License Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="license_number"
                                        value={form.license_number}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Rating</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="rating"
                                        value={form.rating}
                                        onChange={handleChange}
                                        min="0"
                                        max="5"
                                        step="0.1"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Idle">Idle</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Assign Vehicle</label>
                                    <select
                                        className="form-select"
                                        name="vehicle_id"
                                        value={form.vehicle_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Vehicle</option>
                                        {vehicles
                                            .filter(vehicle => vehicle.status !== 'in_use' && vehicle.status !== 'maintenance')
                                            .map(vehicle => (
                                                <option key={vehicle.id} value={vehicle.id}>
                                                    {vehicle.model+ "  |  " +vehicle.license_plate || vehicle.id}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Location (Lat, Lng)</label>
                                    <div className="mb-2" style={{ width: '100%', height: 250 }}>
                                        <MapContainer
                                            center={[marker.lat || 51.505, marker.lng || -0.09]}
                                            zoom={13}
                                            scrollWheelZoom={true}
                                            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <LocationMarker setMarker={setMarker} setForm={setForm} />
                                            {marker.lat !== 0 && marker.lng !== 0 && (
                                                <Marker position={[marker.lat, marker.lng]}>
                                                    <Popup>
                                                        Driver Location<br />
                                                        Lat: {marker.lat.toFixed(6)}<br />
                                                        Lng: {marker.lng.toFixed(6)}
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
                                <button type="submit" className="btn btn-primary w-100">
                                    Create Driver
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Driver;
