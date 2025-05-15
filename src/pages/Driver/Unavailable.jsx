import React, { useEffect, useState } from 'react';
import { supabase } from '../../supaBase/supaBase';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Dummy data for waypoints, truckIcon, depotIcon, and generateColor for demonstration
const waypoints = [
    [
        {  },
    ]
];
const truckIcon = new L.Icon.Default();
const depotIcon = new L.Icon.Default();
const generateColor = (index) => ['#FF0000', '#00FF00', '#0000FF'][index % 3];

const Driver = () => {
    const [drivers, setDrivers] = useState([]);
    const [users, setUsers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            const [
                { data: driversData, error: driversError },
                { data: usersData, error: usersError },
                { data: vehiclesData, error: vehiclesError }
            ] = await Promise.all([
                supabase.from('Drivers').select('*').eq('status', 'Unavailable'),
                supabase.from('Users').select('*'),
                supabase.from('Vehicles').select('*'),
            ]);
            if (!driversError) setDrivers(driversData);
            if (!usersError) setUsers(usersData);
            if (!vehiclesError) setVehicles(vehiclesData);
            setLoading(false);
        };
        fetchAll();
    }, []);

    if (loading) return <div>Loading...</div>;
    
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Idle Drivers</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {drivers.map((driver) => {
                    // Find the user with id matching driver.user_id
                    const user = users.find(u => u.id === driver.user_id) || {};
                    const assignedVehicle = vehicles.find(v => v.id === driver.vehicle_id) || {};
                    return (
                        <div
                            key={driver.id}
                            style={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '10px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                                padding: '1.5rem',
                                background: '#fff',
                                width: '100%',
                                maxWidth: '100%',
                            }}
                        >
                            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                                Driver #{driver.id}
                            </h2>
                            <div style={{ marginBottom: '0.5rem', color: '#555' }}>
                                <strong>UserName:</strong> {user.name || driver.user_id}
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <strong>Status:</strong>{' '}
                                <span
                                    style={{
                                        color: driver.status === 'active' ? 'green' : 'red',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {driver.status}
                                </span>
                            </div>
                            <div>
                                <strong>Assigned Vehicle:</strong>{' '}
                                {(() => {
                                    return assignedVehicle
                                        ? <span style={{ color: '#111' }}>{assignedVehicle.model}</span>
                                        : <span style={{ color: '#aaa' }}>None</span>;
                                    })()}
                            </div>
                            {/* Example map rendering for each driver, adjust as needed */}
                            <div
                                style={{
                                    marginTop: '20px',
                                    width: '100%',
                                    height: '300px',
                                    backgroundColor: '#eaeaea',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <MapContainer
                                    center={[51.505, -0.09]}
                                    zoom={13}
                                    scrollWheelZoom={true}
                                    style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {waypoints.map((route, index) => (
                                        <React.Fragment key={index}>
                                            {route.map((point, pointIndex) => (
                                                <Marker
                                                    key={`${index}-${pointIndex}`}
                                                    position={[driver.latitude, driver.longitude]}
                                                    icon={pointIndex === 0 ? truckIcon : depotIcon}
                                                >
                                                    <Popup>
                                                        {pointIndex === 0 ? 'Truck (Start Point)' : `Depot ${pointIndex}`}
                                                    </Popup>
                                                </Marker>
                                            ))}
                                        </React.Fragment>   
                                    ))}
                                </MapContainer>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Driver;
