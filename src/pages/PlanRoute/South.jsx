import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { supabase } from '../../supaBase/supaBase';

// Ensure supabase is configured correctly
if (!supabase) {
    console.error('Supabase instance is not configured properly. Check your supabase setup.');
}

// Ensure leaflet-routing-machine is compatible with your Leaflet version
if (!L.Routing) {
    console.error('Leaflet Routing Machine is not loaded properly. Check your imports.');
}

// Fix Leaflet icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1995/1995574.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
});

const depotIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2910/2910793.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
});

const RoutingMachine = ({ waypoints }) => {
    const map = useMapEvents({});
    const routingRef = useRef(null);

    useEffect(() => {
        if (!map || waypoints.length < 2) return;

        if (routingRef.current) {
            map.removeControl(routingRef.current);
        }

        routingRef.current = L.Routing.control({
            waypoints: waypoints.map((wp) => L.latLng(wp.lat, wp.lng)),
            routeWhileDragging: false,
            addWaypoints: false,
            show: false,
            fitSelectedRoutes: true,
            lineOptions: {
                styles: [{ color: '#FF5733', weight: 5 }]
            },
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1'
            })
        }).addTo(map);

        return () => {
            if (routingRef.current) {
                map.removeControl(routingRef.current);
            }
        };
    }, [waypoints, map]);

    return null;
};

const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        }
    });
    return null;
};

const South = () => {
    const [markers, setMarkers] = useState([]);
    const [routeForm, setRouteForm] = useState({ name: '', status: '', distance: '', estimated_time: '' });

    const handleMapClick = (latlng) => {
        if (markers.length < 2) {
            const newMarker = { lat: latlng.lat, lng: latlng.lng };
            const updatedMarkers = [...markers, newMarker];
            setMarkers(updatedMarkers);
        }
    };

    const handleInputChange = (e) => {
        setRouteForm({ ...routeForm, [e.target.name]: e.target.value });
    };

    const handleAddRoute = async () => {
        if (markers.length < 2) return alert('Select both start and end points.');
    
        const { name, status, distance, estimated_time } = routeForm;
        if (!name || !status || !distance || !estimated_time) {
            return alert('Fill in all fields.');
        }
    
        const { error: routeError } = await supabase.from('Routes').insert([{
            name,
            status,
            distance,
            estimated_time,
            start_point: JSON.stringify([markers[0].lat, markers[0].lng]),
            end_point: JSON.stringify([markers[1].lat, markers[1].lng])
        }]);
    
        if (routeError) {
            console.error('Error adding route:', routeError);
            return;
        }
    
        // Add a notification to the Notifications table
        const notificationMessage = `Route "${name}" has been added successfully.`;
        const { error: notificationError } = await supabase.from('Notifications').insert([{
            user_id: null, // Set this to the appropriate user ID if needed
            message: notificationMessage,
            status: 'system',
            created_at: new Date().toISOString()
        }]);
    
        if (notificationError) {
            console.error('Error adding notification:', notificationError);
        } else {
            alert('Route and notification added!');
            setMarkers([]);
            setRouteForm({ name: '', status: '', distance: '', estimated_time: '' });
        }
    };
    

    return (
        <div className="container d-flex flex-column align-items-center py-4 bg-light min-vh-100">
            <h2 className="fs-4 fw-bold mb-4 text-dark">Click Map to Set Route</h2>

            <div className="d-flex flex-column gap-3 mb-4 w-100" style={{ maxWidth: '400px' }}>
                <input
                    className="form-control"
                    name="name"
                    placeholder="Name"
                    onChange={handleInputChange}
                    value={routeForm.name}
                />
                <input
                    className="form-control"
                    name="status"
                    placeholder="Status"
                    onChange={handleInputChange}
                    value={routeForm.status}
                />
                <input
                    className="form-control"
                    name="distance"
                    placeholder="Distance"
                    onChange={handleInputChange}
                    value={routeForm.distance}
                />
                <input
                    className="form-control"
                    name="estimated_time"
                    placeholder="ETA"
                    onChange={handleInputChange}
                    value={routeForm.estimated_time}
                />
                <button className="btn btn-primary" onClick={handleAddRoute}>Add Route</button>
                <button className="btn btn-danger" onClick={() => setMarkers([])}>Reset</button>
            </div>

            <MapContainer center={[40, 15]} zoom={5} className="w-100" style={{ height: '500px', border: '2px solid #ccc', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                />
                <MapClickHandler onMapClick={handleMapClick} />

                {markers.map((pos, idx) => (
                    <Marker
                        key={idx}
                        position={[pos.lat, pos.lng]}
                        icon={idx === 0 ? truckIcon : depotIcon}>
                        <Popup>{idx === 0 ? 'Start Point' : 'End Point'}</Popup>
                    </Marker>
                ))}
                {markers.length === 2 && <RoutingMachine waypoints={markers} />}
            </MapContainer>
        </div>
    );
};

export default South;