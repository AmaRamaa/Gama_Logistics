import { useEffect, useState } from 'react';
import { supabase } from '../../supaBase/supaBase';

const Daily = () => {
    const [form, setForm] = useState({
        driverName: '',
        car: '',
        location: '',
        gas: ''
    });
    const [loading, setLoading] = useState(false);

    // Fetch current user and driver/vehicle info
    useEffect(() => {
        const fetchDriverName = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            console.log(user);
            if (user) {
                const { data: userData, error } = await supabase
                    .from('Users')
                    .select('name')
                    .eq('email', user.email)
                    .single();
                if (!error && userData?.name) {
                    setForm((prev) => ({
                        ...prev,
                        driverName: userData.name
                    }));
                }
            }
        };
        // Fetch driver info and assigned vehicle for the current user
        const fetchDriverAndCar = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('User:', user);
            if (user) {
                const { data: driverData, error: driverError } = await supabase
                    .from('Drivers')
                    .select('id, vehicle_id')
                    .eq('user_id', user.id)
                    .single();
                console.log('DriverData:', driverData, 'DriverError:', driverError);

                if (!driverError && driverData) {
                    if (driverData.vehicle_id) {
                        const { data: vehicleData, error: vehicleError } = await supabase
                            .from('Vehicles')
                            .select('model, license_plate')
                            .eq('id', driverData.vehicle_id)
                            .single();
                        console.log('VehicleData:', vehicleData, 'VehicleError:', vehicleError);
                    
                        if (!vehicleError && vehicleData) {
                            setForm((prev) => ({
                                ...prev,
                                car: `${vehicleData.model} (${vehicleData.license_plate})`
                            }));
                        } else {
                            setForm((prev) => ({
                                ...prev,
                                car: 'Vehicle not found'
                            }));
                        }
                    } else {
                        setForm((prev) => ({
                            ...prev,
                            car: 'No vehicle assigned'
                        }));
                    }
                }
            }
        };

        fetchDriverAndCar();
        fetchDriverName();
    }, []);


    // Get location
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setForm((prev) => ({
                        ...prev,
                        location: `${latitude},${longitude}`
                    }));
                },
                () => {
                    setForm((prev) => ({
                        ...prev,
                        location: 'Location unavailable'
                    }));
                }
            );
        } else {
            setForm((prev) => ({
                ...prev,
                location: 'Geolocation not supported'
            }));
        }
    }, []);

    // Fetch existing reports
    // Fetch existing reports
    // (Removed unused reports state and fetchReports effect)
    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('Reports').insert([
            {
                type: 'daily',
                data: {
                    driverName: form.driverName,
                    car: form.car,
                    location: form.location,
                    gas: Number(form.gas)
                },
                generated_at: new Date().toISOString()
            }
        ]);

        setLoading(false);
        if (!error) {
            setForm({ driverName: form.driverName, car: form.car, location: form.location, gas: '' });
            alert('Report submitted!');
        } else {
            alert('Error submitting report');
        }
    };

    return (
        <div>
            <h1>Daily Report Form</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="driverName">Driver Name</label>
                    <input
                        type="text"
                        id="driverName"
                        className="form-control"
                        value={form.driverName}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="car">Car</label>
                    <input
                        type="text"
                        id="car"
                        className="form-control"
                        value={form.car}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>Location</label>
                    <div style={{ height: '300px', width: '100%', borderRadius: '8px', marginBottom: '1rem' }}>
                        <MapContainer
                            center={
                                form.location && form.location !== 'Location unavailable' && form.location !== 'Geolocation not supported'
                                    ? form.location.split(',').map(Number)
                                    : [51.505, -0.09]
                            }
                            zoom={13}
                            scrollWheelZoom={true}
                            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {form.location && form.location !== 'Location unavailable' && form.location !== 'Geolocation not supported' && (
                                <Marker position={form.location.split(',').map(Number)}>
                                    <Popup>
                                        Current Location
                                    </Popup>
                                </Marker>
                            )}
                        </MapContainer>
                    </div>
                    <input
                        type="text"
                        id="location"
                        className="form-control"
                        value={form.location}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="gas">Gas Used</label>
                    <input
                        type="number"
                        id="gas"
                        className="form-control"
                        placeholder="Enter gas used (in liters)"
                        value={form.gas}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Report'}
                </button>
            </form>
        </div>
    );
};

export default Daily;
