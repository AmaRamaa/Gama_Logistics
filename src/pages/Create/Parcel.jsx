import { useState, useEffect, useRef } from "react";
import { supabase } from "../../supaBase/supaBase";
import 'bootstrap/dist/css/bootstrap.min.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";

import "leaflet/dist/leaflet.css";


const initialState = {
    route_id: "",
    weight: "",
    dimensions: "",
    status: "",
    recipient_name: "",
    recipient_address: "",
    In_Vehicle_ID: "",
};

const ParcelCreate = () => {

    const [form, setForm] = useState(initialState);
    // Removed unused showRouteOverlay state and overlay logic
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);

    // New states for vehicles, drivers, and users
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: routesData } = await supabase.from("Routes").select("*");
            setRoutes(routesData || []);

            const { data: vehiclesData } = await supabase.from("Vehicles").select("*");
            setVehicles(vehiclesData || []);

            const { data: driversData } = await supabase.from("Drivers").select("*");
            setDrivers(driversData || []);

            const { data: usersData } = await supabase.from("Users").select("*");
            setUsers(usersData || []);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (form.route_id) {
            const route = routes.find(r => String(r.id) === String(form.route_id));
            setSelectedRoute(route || null);
        } else {
            setSelectedRoute(null);
        }
    }, [form.route_id, routes]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const { error: insertError } = await supabase
                .from("Parcels")
                .insert([form]);

            if (insertError) throw insertError;

            setSuccess(true);
            setForm(initialState);
        } catch (err) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Helper: get route coordinates (adjust this if your schema is different)
    const getRouteCoordinates = (route) => {
        if (!route) return [];
        try {
            // Parse start_point and end_point from string to array
            const start = JSON.parse(route.start_point);
            const end = JSON.parse(route.end_point);
            // Ensure both are arrays of numbers
            if (
                Array.isArray(start) && start.length === 2 &&
                Array.isArray(end) && end.length === 2
            ) {
                return [start, end];
            }
        } catch (e) {
            // Fallback if parsing fails
            return [];
        }
        return [];
    };


    const routeCoords = getRouteCoordinates(selectedRoute);

    // Helper: get driver for a vehicle
    const getDriverForVehicle = (vehicleId) => {
        const driver = drivers.find(d => String(d.vehicle_id) === String(vehicleId));
        if (!driver) return "No driver";
        const user = users.find(u => String(u.id) === String(driver.user_id));
        if (user) {
            return user.name || `User ${user.id}`;
        }
        return "No user";
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Create Parcel</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Route</label>
                                    <select
                                        className="form-select"
                                        name="route_id"
                                        value={form.route_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Route</option>
                                        {routes.map(route => (
                                            <option key={route.id} value={route.id}>
                                                {route.name || `Route ${route.id}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Route Map</label>
                                    <div style={{ width: "100%", height: 250 }}>
                                        {routeCoords && routeCoords[0] ? (
                                            <MapContainer
                                                center={routeCoords[0]}
                                                zoom={13}
                                                scrollWheelZoom={true}
                                                style={{ height: "100%", width: "100%", borderRadius: "8px" }}
                                            >
                                                <TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                {routeCoords.length > 1 && (
                                                    <Polyline positions={routeCoords} color="blue" />
                                                )}
                                                <Marker position={routeCoords[0]}>
                                                    <Popup>Start</Popup>
                                                </Marker>
                                                {routeCoords.length > 1 && (
                                                    <Marker position={routeCoords[routeCoords.length - 1]}>
                                                        <Popup>End</Popup>
                                                    </Marker>
                                                )}
                                            </MapContainer>
                                        ) : (
                                            <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
                                                Select a route to view the map.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Weight (kg)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="weight"
                                        value={form.weight}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Dimensions (cm³)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="dimensions"
                                        value={form.dimensions}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Recipient Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="recipient_name"
                                        value={form.recipient_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Recipient Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="recipient_address"
                                        value={form.recipient_address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">In Vehicle</label>
                                    <select
                                        className="form-select"
                                        name="In_Vehicle_ID"
                                        value={form.In_Vehicle_ID}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Vehicle</option>
                                        {vehicles.map(vehicle => (
                                            <option key={vehicle.id} value={vehicle.id}>
                                                {`${vehicle.model || ""} - ${vehicle.license_plate || ""} - ${getDriverForVehicle(vehicle.id)}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? "Creating..." : "Create Parcel"}
                                </button>
                                {success && <div className="alert alert-success mt-3">Parcel created!</div>}
                                {error && <div className="alert alert-danger mt-3">{error}</div>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParcelCreate;