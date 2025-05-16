import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { supabase } from "../../supaBase/supaBase";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const truckIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
});

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


const VehicleDetails = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enable3D] = useState(() => {
        const storedValue = localStorage.getItem('enable3D');
        return storedValue !== null ? JSON.parse(storedValue) : true;
    });


    useEffect(() => {
        const fetchVehicleDetails = async () => {
            const { data, error } = await supabase
                .from("Vehicles")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Error fetching vehicle details:", error);
            } else {
                setVehicle(data);
            }
            setLoading(false);
        };

        fetchVehicleDetails();
    }, [id]);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (!vehicle) return <div className="text-center mt-5">Vehicle not found.</div>;

    const location = Array.isArray(vehicle.locations)
        ? vehicle.locations
        : vehicle.locations
            ? JSON.parse(vehicle.locations)
            : null;

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Vehicle Details</h1>

            <div className="row">
                {/* Vehicle Info Card */}
                <div className="col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">{vehicle.model}</h5>
                            <p className="card-text">License Plate: {vehicle.license_plate}</p>
                            <p className="card-text">Capacity: {vehicle.capacity}</p>
                            <p className="card-text">Status: {vehicle.status}</p>
                            <p className="card-text">Last Maintenance Date: {vehicle.last_maintenance_date}</p>
                            <p className="card-text">Created At: {new Date(vehicle.created_at).toLocaleString()}</p>
                            <p className="card-text">Updated At: {new Date(vehicle.updated_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Map */}
                <div className="col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body p-0">
                            {location && location.length === 2 ? (
                                <MapContainer
                                    center={[location[0], location[1]]}
                                    zoom={13}
                                    scrollWheelZoom={true}
                                    style={{ height: "100%", minHeight: "350px", width: "100%", borderRadius: "0 0 .25rem .25rem" }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[location[0], location[1]]} icon={truckIcon}>
                                        <Popup>
                                            {vehicle.model} - {vehicle.license_plate}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <p className="text-center text-muted m-3">Location data not available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3D Model */}
            {enable3D && (
                <div className="card mt-4 shadow">
                    <div className="card-body">
                        <h3 className="card-title text-center mb-3">3D Vehicle Model</h3>
                        <div style={{ width: "100%", height: "400px" }}>
                            {MODEL_3D_MAP[vehicle.model] ? (
                                <iframe
                                    title={MODEL_3D_MAP[vehicle.model].title}
                                    allowFullScreen
                                    allow="autoplay; fullscreen; xr-spatial-tracking"
                                    src={MODEL_3D_MAP[vehicle.model].src}
                                    style={{ width: "100%", height: "100%", border: "none" }}
                                ></iframe>
                            ) : (
                                <p className="text-center text-muted">
                                    No 3D model available for this vehicle.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleDetails;
