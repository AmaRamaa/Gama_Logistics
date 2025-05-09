import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { supabase } from "../../supaBase/supaBase";
import { Link } from "react-router-dom";
import Maintenance from "./Maintenance"; // Import the Maintenance component

const AvailableVehicles = () => {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const fetchAvailableVehicles = async () => {
            const { data, error } = await supabase
                .from("Vehicles") // Replace with your table name
                .select("*")
                .eq("status", "in_use"); // Filter for available vehicles

            if (error) {
                console.error("Error fetching vehicles:", error);
            } else {
                setVehicles(data);
            }
        };

        fetchAvailableVehicles();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Vehicles in Use</h1>
            <div className="row">
                {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => (
                        <div className="col-md-4 mb-4" key={vehicle.id}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{vehicle.model}</h5>
                                    <p className="card-text">
                                        License Plate: {vehicle.license_plate}
                                    </p>
                                    <p className="card-text">
                                        Capacity: {vehicle.capacity}
                                    </p>
                                    <Link
                                        to={`/vehicle/${vehicle.id}`}
                                        className="btn btn-primary"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No available vehicles found.</p>
                )}
            </div>
        </div>
    );
};

export default AvailableVehicles;