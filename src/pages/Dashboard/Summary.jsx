import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supaBase/supaBase';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MAX_DRIVERS_DISPLAY = 1;
const truckIcon = new L.Icon.Default();
const depotIcon = new L.Icon.Default();

const Summary = () => {
    const [drivers, setDrivers] = useState([]);
    const [users, setUsers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [depots, setDepots] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            const [
                { data: driversData },
                { data: usersData },
                { data: vehiclesData },
                { data: ordersData },
                { data: depotsData }
            ] = await Promise.all([
                supabase.from('Drivers').select('*'),
                supabase.from('Users').select('*'),
                supabase.from('Vehicles').select('*'),
                supabase.from('Orders').select('*'),
                supabase.from('Depots').select('*'),
            ]);
            setDrivers(driversData || []);
            setUsers(usersData || []);
            setVehicles(vehiclesData || []);
            setOrders(ordersData || []);
            setDepots(depotsData || []);
            setLoading(false);
        };
        fetchAll();
    }, []);

    if (loading) return <div>Loading...</div>;

    // Dashboard summary counts
    const activeDrivers = drivers.filter(d => d.status === 'active').length;
    const availableVehicles = vehicles.filter(v => v.status === 'available').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
            {/* Dashboard Summary Cards */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <SummaryCard title="Total Drivers" value={drivers.length} />
                <SummaryCard title="Active Drivers" value={activeDrivers} />
                <SummaryCard title="Total Vehicles" value={vehicles.length} />
                <SummaryCard title="Available Vehicles" value={availableVehicles} />
                <SummaryCard title="Total Orders" value={orders.length} />
                <SummaryCard title="Pending Orders" value={pendingOrders} />
                <SummaryCard title="Depots" value={depots.length} />
            </div>

            <h1>Drivers</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {drivers.slice(0, MAX_DRIVERS_DISPLAY).map((driver, index) => {
                    const user = users.find(u => u.id === driver.user_id) || {};
                    const assignedVehicle = vehicles.find(v => v.id === driver.vehicle_id) || {};
                    return (
                        <div key={driver.id} style={driverCardStyle}>
                            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                                {user.name || 'N/A'}
                            </h2>
                            <div style={{ marginBottom: '0.5rem', color: '#555' }}>
                                <strong>Status:</strong>{' '}
                                <span style={{
                                    color: driver.status === 'active' ? 'green' : 'red',
                                    fontWeight: 'bold',
                                }}>
                                    {driver.status}
                                </span>
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <strong>Email:</strong> {user.email || ''}
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <strong>Assigned Vehicle:</strong>{' '}
                                {assignedVehicle.model || <span style={{ color: '#aaa' }}>None</span>}
                            </div>
                            <div
                                style={{
                                    marginTop: '20px',
                                    width: '100%',
                                    height: '200px',
                                    backgroundColor: '#eaeaea',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                {(driver.latitude && driver.longitude) ? (
                                    <MapContainer
                                        center={[driver.latitude, driver.longitude]}
                                        zoom={13}
                                        scrollWheelZoom={true}
                                        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker
                                            position={[driver.latitude, driver.longitude]}
                                            icon={truckIcon}
                                        >
                                            <Popup>
                                                {user.name || 'Driver'}
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#888', paddingTop: '80px' }}>
                                        No location data
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {drivers.length > MAX_DRIVERS_DISPLAY && (
                <button
                    style={seeMoreBtnStyle}
                    onClick={() => navigate('/driver')}
                >
                    See more
                </button>
            )}
        </div>
    );
};

const SummaryCard = ({ title, value }) => (
    <div style={{
        minWidth: '160px',
        background: '#f8f9fa',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        padding: '1.2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        textAlign: 'center',
        flex: '1 1 160px'
    }}>
        <div style={{ fontSize: '1.1rem', color: '#555', marginBottom: '0.5rem' }}>{title}</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>{value}</div>
    </div>
);

const driverCardStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    padding: '1.5rem',
    background: '#fff',
    width: '100%',
    maxWidth: '100%',
};

const seeMoreBtnStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    background: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px'
};

export default Summary;
