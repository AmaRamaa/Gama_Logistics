import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Truck 3D-style icon
const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1995/1995574.png', // Example truck icon
    iconSize: [45, 45],
    iconAnchor: [22, 44],
    popupAnchor: [0, -40],
});

// Depot 3D-style icon
const depotIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2910/2910793.png', // Example warehouse icon
    iconSize: [45, 45],
    iconAnchor: [22, 44],
    popupAnchor: [0, -40],
});

// Component to handle routing
const RoutingMachine = ({ waypoints }) => {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!map) return;

        // Remove previous control
        if (routingControlRef.current) {
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
                styles: [{ color: 'blue', weight: 8 }], // Adjust the weight to make the line thicker
            },
        }).addTo(map);

        return () => {
            if (map && routingControlRef.current) {
                map.removeControl(routingControlRef.current);
            }
        };
    }, [map, waypoints]);

    return null;
};


const LiveMap = () => {
    const [waypoints, setWaypoints] = useState([
        { lat: 51.505, lng: -0.09 },
        { lat: 51.51, lng: -0.1 },
    ]);

    const handleMarkerDrag = (index, event) => {
        const newWaypoints = [...waypoints];
        const { lat, lng } = event.target.getLatLng();
        newWaypoints[index] = { lat, lng };
        setWaypoints(newWaypoints);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Live Map</h1>
            <p>Track your deliveries in real-time on the map below:</p>
            <div
                style={{
                    marginTop: '20px',
                    width: '100%',
                    height: '400px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                }}
            >
                <MapContainer
                    center={[51.505, -0.09]}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {waypoints.map((point, index) => (
                        <Marker
                            style={{ display: 'none' }}
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
