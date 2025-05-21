import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { supabase } from '../../supaBase/supaBase';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Truck 3D-style icon
const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1995/1995574.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
});

// Depot 3D-style icon
const depotIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2910/2910793.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
});

// Component to handle routing
const RoutingMachine = ({ waypoints, color }) => {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!map) return;
        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
        }
        routingControlRef.current = L.Routing.control({
            waypoints: waypoints.map((point) => L.latLng(point.lat, point.lng)),
            routeWhileDragging: false,
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            lineOptions: {
                styles: [{ color, weight: 6, opacity: 0.8 }],
            },
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
            }),
        }).addTo(map);

        return () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
            }
        };
    }, [map, waypoints, color]);

    return null;
};

const LiveMap = () => {
    const [waypoints, setWaypoints] = useState([]);
    const [routes, setRoutes] = useState([]); // Store all routes from DB
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // Filtering state

    useEffect(() => {
        const fetchingWaypoints = async () => {
            const { data, error } = await supabase.from('Routes').select('*');
            if (data) {
                setRoutes(data); // Save all routes for filtering
                const fetchedWaypoints = data.map((route) => {
                    const [startLat, startLng] = JSON.parse(route.start_point.replace(/'/g, '"'));
                    const [endLat, endLng] = JSON.parse(route.end_point.replace(/'/g, '"'));
                    return {
                        id: route.id,
                        name: route.name || `Route ${route.id}`,
                        points: [
                            { lat: startLat, lng: startLng },
                            { lat: endLat, lng: endLng },
                        ],
                    };
                });
                setWaypoints(fetchedWaypoints);
            }
            if (error) {
                console.error('Error fetching waypoints:', error);
            }
        };
        fetchingWaypoints();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const generateColor = (index) => {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF5'];
        return colors[index % colors.length];
    };

    // Filtered waypoints based on filter state
    const filteredWaypoints =
        filter === 'all'
            ? waypoints
            : waypoints.filter((route) => String(route.id) === filter);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
            <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '10px' }}>Live Map</h1>
            <p style={{ color: '#555', textAlign: 'center', marginBottom: '20px' }}>
                Track your deliveries in real-time on the map below:
            </p>
            {/* Filtering Dropdown */}
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <label htmlFor="routeFilter" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                    Filter by Route:
                </label>
                <select
                    id="routeFilter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="all">All Routes</option>
                    {routes.map((route) => (
                        <option key={route.id} value={route.id}>
                            {route.name || `Route ${route.id}`}
                        </option>
                    ))}
                </select>
            </div>
            {loading ? (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '500px',
                        backgroundColor: '#eaeaea',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div style={{ color: '#555', fontSize: '18px' }}>
                        <div className="d-flex justify-content-center align-items-center vh-100">
                            <DotLottieReact
                                src="https://lottie.host/d1978416-f80a-4f61-9aeb-d45248747fcc/71mHxPhcAZ.lottie"
                                loop
                                autoplay
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        marginTop: '20px',
                        width: '100%',
                        height: '500px',
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

                        {filteredWaypoints.map((route, index) => (
                            <React.Fragment key={route.id}>
                                {route.points.map((point, pointIndex) => (
                                    <Marker
                                        key={`${route.id}-${pointIndex}`}
                                        position={[point.lat, point.lng]}
                                        icon={pointIndex === 0 ? truckIcon : depotIcon}
                                    >
                                        <Popup>
                                            {pointIndex === 0 ? 'Truck (Start Point)' : `Depot ${pointIndex}`}
                                        </Popup>
                                    </Marker>
                                ))}
                                <RoutingMachine waypoints={route.points} color={generateColor(index)} />
                            </React.Fragment>
                        ))}
                    </MapContainer>
                </div>
            )}
        </div>
    );
};

export default LiveMap;
