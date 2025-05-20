import { useEffect, useState } from 'react';
import { supabase } from '../../supaBase/supaBase';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const Weekly = () => {
    const [form, setForm] = useState({
        driverName: '',
        car: '',
        location: '',
        gas: '',
        week: ''
    });
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
    const [mapInstance, setMapInstance] = useState(null);

    useEffect(() => {
        const fetchDriverName = async () => {
            const { data: { user } } = await supabase.auth.getUser();
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
        setForm((prev) => ({
            ...prev,
            car: ''
        }));
        fetchDriverName();
    }, []);

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

    useEffect(() => {
        const fetchVehicles = async () => {
            const { data, error } = await supabase
                .from('Vehicles')
                .select('*')
                .order('model');
            if (!error && data) {
                setVehicles(data.map(v => ({
                    model: v.model,
                    license_plate: v.license_plate
                })));
            }
        };
        fetchVehicles();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    useEffect(() => {
    if (
        form.location &&
        form.location !== 'Location unavailable' &&
        form.location !== 'Geolocation not supported'
    ) {
        const coords = form.location.split(',').map(Number);
        setMapCenter(coords);
        if (mapInstance) {
            mapInstance.flyTo(coords, 13); // 13 is the zoom level
        }
    }
}, [form.location, mapInstance]);


    const driverVehicle = vehicles.length > 0 ? vehicles[0] : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('Reports').insert([
            {
                type: 'weekly',
                data: {
                    driverName: form.driverName,
                    car: driverVehicle
                        ? `${driverVehicle.model} (${driverVehicle.license_plate})`
                        : '',
                    location: form.location,
                    gas: Number(form.gas),
                    week: form.week
                },
                created_at: new Date().toISOString()
            }
        ]);

        setLoading(false);
        if (!error) {
            setForm({
                driverName: form.driverName,
                car: form.car,
                location: form.location,
                gas: '',
                week: ''
            });
            alert('Weekly report submitted!');
        } else {
            alert('Error submitting report');
        }
    };

    return (
        <div>
            <h1>Weekly Report Form</h1>
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
                        value={
                            driverVehicle
                                ? `${driverVehicle.model} (${driverVehicle.license_plate})`
                                : 'Null'
                        }
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>Location</label>
                    <div style={{ height: '300px', width: '100%', borderRadius: '8px', marginBottom: '1rem' }}>
                        <MapContainer
                            center={mapCenter}
                            zoom={13}
                            scrollWheelZoom={true}
                            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                            whenCreated={setMapInstance}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {form.location && (
                                <Marker position={mapCenter}>
                                    <Popup>
                                        Your location: {form.location}
                                    </Popup>
                                </Marker>
                            )}
                        </MapContainer>
                    </div>
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
                <div className="form-group">
                    <label htmlFor="week">Week</label>
                    <input
                        type="week"
                        id="week"
                        className="form-control"
                        value={form.week}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Report'}
                </button>
            </form>
        </div>
    );
};

export default Weekly;