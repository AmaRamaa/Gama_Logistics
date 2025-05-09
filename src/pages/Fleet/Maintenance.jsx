import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { supabase } from "../../supaBase/supaBase";
import { Link } from "react-router-dom";

const Maintenance = () => {
    const [vehicles, setVehicles] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchMaintenanceVehiclesAndUsers = async () => {
            // Fetch vehicles under maintenance
            const { data: vehicleData, error: vehicleError } = await supabase
                .from("Vehicles") // Replace with your table name
                .select("*")
                .eq("status", "maintenance"); // Filter for vehicles under maintenance

            if (vehicleError) {
                console.error("Error fetching vehicles:", vehicleError);
            } else {
                setVehicles(vehicleData);
            }

            // Fetch users
            const { data: userData, error: userError } = await supabase
                .from("Users") // Replace with your users table name
                .select("*");

            if (userError) {
                console.error("Error fetching users:", userError);
            } else {
                setUsers(userData);
            }
        };

        fetchMaintenanceVehiclesAndUsers();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Vehicles Under Maintenance</h1>
            <div className="row">
                {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => {
                        const assignedUser = users.find(
                            (user) => user.id === vehicle.assigned_to
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
                                            Issue: {vehicle.issue || "N/A"}
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
                    <p className="text-center">No vehicles under maintenance found.</p>
                )}
            </div>
        </div>
    );
};

export default Maintenance;