import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../supaBase/supaBase';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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

const darkIconStyle = {
    filter: 'brightness(0.5) contrast(1.2)',
};

const RoutingMachine = ({ waypoints, color }) => {
    const map = useMap();
    const routingControlRef = useRef(null);





    useEffect(() => {
        if (!map || !waypoints.length) return;

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

const RouteEditor = () => {
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [waypoints, setWaypoints] = useState([]);
    const [routeName, setRouteName] = useState('');
    const [originalRoute, setOriginalRoute] = useState(null);

    useEffect(() => {
        const fetchRoutes = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('Routes').select('*');
            if (error) {
                console.error('Error fetching routes:', error.message);
            } else {
                setRoutes(data);
            }
            setLoading(false);
        };
        fetchRoutes();
    }, []);

    useEffect(() => {
        if (selectedRoute) {
            setOriginalRoute(selectedRoute); // Save original for cancel
            try {
                const [startLat, startLng] = JSON.parse(selectedRoute.start_point.replace(/'/g, '"'));
                const [endLat, endLng] = JSON.parse(selectedRoute.end_point.replace(/'/g, '"'));
                setWaypoints([
                    { lat: startLat, lng: startLng },
                    { lat: endLat, lng: endLng },
                ]);
                setRouteName(selectedRoute.name || '');
            } catch (e) {
                setWaypoints([]);
                setRouteName('');
            }
        } else {
            setWaypoints([]);
            setRouteName('');
        }
    }, [selectedRoute]);

    const handleMarkerDrag = (idx, e) => {
        const newWaypoints = [...waypoints];
        newWaypoints[idx] = {
            lat: e.target.getLatLng().lat,
            lng: e.target.getLatLng().lng,
        };
        setWaypoints(newWaypoints);
    };

    const handleSave = async () => {
        if (!selectedRoute) return;
        const start_point = JSON.stringify([waypoints[0].lat, waypoints[0].lng]);
        const end_point = JSON.stringify([waypoints[1].lat, waypoints[1].lng]);
        const { error } = await supabase
            .from('Routes')
            .update({
                start_point,
                end_point,
                name: routeName,
            })
            .eq('id', selectedRoute.id);
        if (error) {
            alert('Error saving route: ' + error.message);
        } else {
            alert('Route updated!');
            const { data } = await supabase.from('Routes').select('*');
            setRoutes(data);
            setSelectedRoute(data.find(r => r.id === selectedRoute.id));
        }
    };

    const handleCancel = () => {
        if (originalRoute) {
            try {
                const [startLat, startLng] = JSON.parse(originalRoute.start_point.replace(/'/g, '"'));
                const [endLat, endLng] = JSON.parse(originalRoute.end_point.replace(/'/g, '"'));
                setWaypoints([
                    { lat: startLat, lng: startLng },
                    { lat: endLat, lng: endLng },
                ]);
                setRouteName(originalRoute.name || '');
            } catch (e) {
                setWaypoints([]);
                setRouteName('');
            }
        }
    };

    const exportToCSV = () => {
        const headers = [
            'ID',
            'Name',
            'Status',
            'Distance',
            'Estimated Time',
            'Start Point',
            'End Point',
            'Created At',
            'Updated At'
        ];

        const rows = routes.map(route => [
            route.id,
            route.name || '',
            route.status || '',
            route.distance || '',
            route.estimated_time || '',
            route.start_point || '',
            route.end_point || '',
            route.created_at || '',
            route.updated_at || ''
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'routes.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container my-4">
            <div className="card shadow">
                <div className="card-body">
                    {loading ? (
                        <div className="text-center my-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-3">
                                <select
                                    className="form-select"
                                    value={selectedRoute ? selectedRoute.id : ''}
                                    onChange={e => {
                                        const route = routes.find(r => r.id === Number(e.target.value));
                                        setSelectedRoute(route);
                                    }}
                                >
                                    <option value="">Select a route</option>
                                    {routes.map(route => (
                                        <option key={route.id} value={route.id}>
                                            {route.name || `Route ${route.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {selectedRoute && waypoints.length === 2 && (
                                <div className="mt-3">
                                    <h2 className="card-title mb-3">Edit Routes</h2>
                                    <button className="btn btn-outline-success mb-3" onClick={exportToCSV}>
                                        Export as CSV
                                    </button>

                                    <p className="text-secondary mb-3">
                                        You are supposed to Drag the icons.
                                    </p>
                                    <form className="row g-3 align-items-center mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label mb-1">Route Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={routeName}
                                                onChange={e => setRouteName(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label mb-1">Status</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedRoute.status || ''}
                                                onChange={e =>
                                                    setSelectedRoute({
                                                        ...selectedRoute,
                                                        status: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label mb-1">Distance</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={selectedRoute.distance || ''}
                                                onChange={e =>
                                                    setSelectedRoute({
                                                        ...selectedRoute,
                                                        distance: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label mb-1">Estimated Time</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={selectedRoute.estimated_time || ''}
                                                onChange={e =>
                                                    setSelectedRoute({
                                                        ...selectedRoute,
                                                        estimated_time: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="col-md-3 d-flex align-items-end">
                                            <button
                                                type="button"
                                                className="btn btn-primary me-2"
                                                onClick={handleSave}
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                    <div style={{ height: 400 }}>
                                        <MapContainer
                                            center={[waypoints[0].lat, waypoints[0].lng]}
                                            zoom={13}
                                            scrollWheelZoom={true}
                                            style={{ height: '100%', width: '100%' }}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            {waypoints.map((point, idx) => (
                                                <div key={idx} style={darkIconStyle}>
                                                    <Marker
                                                        position={[point.lat, point.lng]}
                                                        icon={idx === 0 ? truckIcon : depotIcon}
                                                        draggable={true}
                                                        eventHandlers={{
                                                            dragend: (e) => handleMarkerDrag(idx, e),
                                                        }}
                                                    >
                                                        <Popup>
                                                            {idx === 0 ? 'Truck (Start Point)' : 'Depot (End Point)'}
                                                        </Popup>
                                                    </Marker>
                                                </div>
                                            ))}
                                            <RoutingMachine waypoints={waypoints} color="#FF5733" />
                                        </MapContainer>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RouteEditor;