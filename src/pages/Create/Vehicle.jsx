import { useState, useEffect } from 'react';
import { supabase } from '../../supaBase/supaBase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MODEL_3D_MAP = {
    "Ford Transit": {
        title: "Ford Transit Cargo",
        src: "https://sketchfab.com/models/97e42c17df95452093aceb7c8680b8b8/embed"
    },
    "Mercedes Sprinter": {
        title: "Mercedes-Benz Sprinter",
        src: "https://sketchfab.com/models/6d6427ecd66b4661b22a4644d48cec6a/embed"
    },
    "Renault Kangoo": {
        title: "Renault Kangoo",
        src: "https://sketchfab.com/models/863158c941d94475b4374579caae28dd/embed"
    },
    "Peugeot Boxer": {
        title: "Peugeot Boxer",
        src: "https://sketchfab.com/models/5b3cf1234ef14be59072464935501578/embed"
    },
    "Nissan NV200": {
        title: "Nissan NV200",
        src: "https://sketchfab.com/models/0f34caf6ffe64c8f8a999d5b07e86a64/embed"
    },
    "Volkswagen Crafter": {
        title: "Volkswagen Crafter",
        src: "https://sketchfab.com/models/ed06bddd8bc24654b1be023b3af5957d/embed"
    },
    "Citroën Jumper": {
        title: "Citroën Jumper",
        src: "https://sketchfab.com/models/1c2bf52273a941e0b102db6beb16b6b6/embed"
    }
};

const Vehicle = () => {
    const [form, setForm] = useState({
        license_plate: '',
        model: '',
        capacity: '',
        status: '',
        last_maintenance_date: '',
        locations: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [enable3D] = useState(true);

    const [vehiclesData, setVehiclesData] = useState([]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchVehicles = async () => {
            const { data, error } = await supabase.from('Vehicles').select('*');
            if (!error) {
                setVehiclesData(data || []);
                console.log('Vehicles Data:', data);
            }
        };
        fetchVehicles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Convert locations string to array of floats if not empty
        let locationsArray = [];
        if (form.locations && typeof form.locations === 'string') {
            const parts = form.locations.split(',').map(s => parseFloat(s.trim()));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                locationsArray = parts;
            }
        }

        const payload = {
            ...form,
            locations: locationsArray.length === 2 ? locationsArray : null
        };

        const { error } = await supabase.from('Vehicles').insert([payload]);
        if (error) {
            setMessage('Error: ' + error.message);
        } else {
            setMessage('Vehicle created successfully!');
            setForm({
                license_plate: '',
                model: '',
                capacity: '',
                status: '',
                last_maintenance_date: '',
                locations: ''
            });
        }

        console.log('Form Data:', payload);
        setLoading(false);
    };

    const model3D = MODEL_3D_MAP[form.model];
    const [showMap, setShowMap] = useState(false);
    const [marker, setMarker] = useState({ lat: 51.505, lng: -0.09 });

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const lat = e.latlng.lat.toFixed(6);
                const lng = e.latlng.lng.toFixed(6);
                setMarker({ lat, lng });
                setForm(prev => ({ ...prev, locations: `${lat}, ${lng}` }));
            }
        });
        return null;
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Create Vehicle</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">License Plate:</label>
                                    <input type="text" name="license_plate" value={form.license_plate} onChange={handleChange} required className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Model:</label>
                                    <input type="text" name="model" value={form.model} onChange={handleChange} required list="vehicle-models" className="form-control" />
                                    <datalist id="vehicle-models">
                                        {Object.keys(MODEL_3D_MAP).map(model => (
                                            <option key={model} value={model} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Capacity:</label>
                                    <input type="number" name="capacity" value={form.capacity} onChange={handleChange} required className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Status:</label>
                                    <input type="text" name="status" value={form.status} onChange={handleChange} required className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Last Maintenance Date:</label>
                                    <input type="date" name="last_maintenance_date" value={form.last_maintenance_date} onChange={handleChange} required className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Location (lat, lng):</label>
                                    <div className="input-group">
                                        <input type="text" name="locations" value={form.locations} onChange={handleChange} className="form-control" />
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowMap(true)}>Pick on Map</button>
                                    </div>
                                </div>
                                <div className="d-grid">
                                    <button type="submit" disabled={loading} className="btn btn-primary">
                                        {loading ? 'Creating...' : 'Create Vehicle'}
                                    </button>
                                </div>
                            </form>
                            {message && (
                                <div className={`alert mt-3 ${message.startsWith('Error') ? 'alert-danger' : 'alert-success'}`}>
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>

                    {enable3D && (
                        <div className="card mt-4 shadow">
                            <div className="card-body">
                                <h3 className="card-title text-center mb-3">3D Vehicle Model</h3>
                                <div style={{ width: "100%", height: "400px" }}>
                                    {model3D ? (
                                        <iframe
                                            title={model3D.title}
                                            allowFullScreen
                                            allow="autoplay; fullscreen; xr-spatial-tracking"
                                            src={model3D.src}
                                            style={{ width: "100%", height: "100%", border: "none" }}
                                        ></iframe>
                                    ) : (
                                        <p className="text-center text-muted">No 3D model available for this vehicle.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {showMap && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            background: 'rgba(0,0,0,0.5)',
                            zIndex: 2000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{
                                background: '#fff',
                                borderRadius: '10px',
                                padding: '20px',
                                width: '90vw',
                                maxWidth: '600px',
                                height: '70vh',
                                position: 'relative',
                                boxShadow: '0 0 20px rgba(0,0,0,0.2)'
                            }}>
                                <button className="btn btn-danger" style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }} onClick={() => setShowMap(false)}>Close</button>
                                <MapContainer
                                    center={[marker.lat, marker.lng]}
                                    zoom={13}
                                    scrollWheelZoom
                                    style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <LocationMarker />
                                    <Marker position={[marker.lat, marker.lng]}>
                                        <Popup>
                                            Driver Location<br />
                                            Lat: {marker.lat}<br />
                                            Lng: {marker.lng}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Vehicle;
