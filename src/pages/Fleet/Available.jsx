import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Use = () => {
    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Fleet in Use</h1>
            <div className="d-flex flex-column align-items-center">
                <img
                    src="https://as2.ftcdn.net/jpg/05/40/76/61/1000_F_540766172_9BreB2fWcDCPpdArO95n5zGB537lWjdN.jpg" // Replace with your truck image path
                    alt="Transparent Truck"
                    className="img-fluid mb-3"
                    style={{ maxWidth: "300px" }} // Optional inline styling
                />
                <div className="text-center">
                    <p>Item 1</p>
                    <p>Item 2</p>
                    <p>Item 3</p>
                </div>
            </div>
        </div>
    );
};

export default Use;