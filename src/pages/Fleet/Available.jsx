import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { supabase } from "../../supaBase/supaBase";
import { Link } from "react-router-dom";

const AvailableVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchAvailableVehiclesAndUsers = async () => {
            try {
                // Fetch vehicles
                const { data: vehicleData, error: vehicleError } = await supabase
                    .from("Vehicles") // Replace with your table name
                    .select("*")
                    .eq("status", "available"); // Filter for available vehicles

                if (vehicleError) {
                    console.error("Error fetching vehicles:", vehicleError);
                    return;
                }
                setVehicles(vehicleData);

                // Fetch users
                const { data: userData, error: userError } = await supabase
                    .from("Drivers") // Replace with your users table name
                    .select("*");

                if (userError) {
                    console.error("Error fetching users:", userError);
                    return;
                }
                setUsers(userData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchAvailableVehiclesAndUsers();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Available Vehicles</h1>
            <div className="row">
                {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => {
                        const assignedUser = users.find(
                            (user) => user.assigned_vehicle === vehicle.id
                        );

                        return (
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
                                        <p className="card-text">
                                            Assigned To:{" "}
                                            {assignedUser
                                                ? assignedUser.name
                                                : "Not Assigned"}
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
                        );
                    })
                ) : (
                    <p className="text-center">No available vehicles found.</p>
                )}
            </div>
        </div>
    );
};

export default AvailableVehicles;