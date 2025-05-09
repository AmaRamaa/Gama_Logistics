import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { supabase } from "../../supaBase/supaBase";
import { useParams } from "react-router-dom";

const VehicleDetails = () => {
    const { id } = useParams(); // Get the vehicle ID from the URL
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            const { data, error } = await supabase
                .from("Vehicles") // Replace with your table name
                .select("*")
                .eq("id", id) // Filter by the vehicle ID
                .single(); // Expect a single result

            if (error) {
                console.error("Error fetching vehicle details:", error);
            } else {
                setVehicle(data);
            }
            setLoading(false);
        };

        fetchVehicleDetails();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (!vehicle) {
        return <div className="text-center mt-5">Vehicle not found.</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Vehicle Details</h1>
            <div className="card">
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
    );
};

export default VehicleDetails;