import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Truck 3D-style icon
const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1995/1995574.png', // Example truck icon
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
});

// Depot 3D-style icon
const depotIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2910/2910793.png', // Example warehouse icon
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
});

// Component to handle routing
const RoutingMachine = ({ waypoints }) => {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!map) return;

        // Remove previous control
        if (routingControlRef.current && routingControlRef.current.getPlan && map.hasLayer(routingControlRef.current.getPlan())) {
            map.removeControl(routingControlRef.current);
        }

        // Add new routing control with custom line options
        routingControlRef.current = L.Routing.control({
            waypoints: waypoints.map((point) => L.latLng(point.lat, point.lng)),
            routeWhileDragging: true,
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            lineOptions: {
                styles: [{ color: '#0078FF', weight: 6, opacity: 0.8 }], // Softer blue with slight transparency
            },
        }).addTo(map);

        return () => {
            if (map && routingControlRef.current && routingControlRef.current.getPlan && map.hasLayer(routingControlRef.current.getPlan())) {
                map.removeControl(routingControlRef.current);
            }
        };
    }, [map, waypoints]);

    return null;
};

const LiveMap = () => {
    const [waypoints, setWaypoints] = useState([
        { lat: 51.505, lng: -0.09 },
        { lat: 42.6026, lng: 20.9030 },
    ]);

    const handleMarkerDrag = (index, event) => {
        const newWaypoints = [...waypoints];
        const { lat, lng } = event.target.getLatLng();
        newWaypoints[index] = { lat, lng };
        setWaypoints(newWaypoints);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
            <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '10px' }}>Live Map</h1>
            <p style={{ color: '#555', textAlign: 'center', marginBottom: '20px' }}>
                Track your deliveries in real-time on the map below:
            </p>
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

                    {waypoints.map((point, index) => (
                        <Marker
                            key={index}
                            position={[point.lat, point.lng]}
                            icon={index === 0 ? truckIcon : depotIcon}
                            draggable={true}
                            eventHandlers={{
                                dragend: (event) => handleMarkerDrag(index, event),
                            }}
                        >
                            <Popup>
                                {index === 0 ? 'Truck (Start Point)' : 'Depot (End Point)'}
                            </Popup>
                        </Marker>
                    ))}

                    <RoutingMachine waypoints={waypoints} />
                </MapContainer>
            </div>
        </div>
    );
};

export default LiveMap;
