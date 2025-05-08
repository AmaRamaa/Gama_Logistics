import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Use = () => {
    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Fleet in Use</h1>
            <div className="d-flex flex-column align-items-center">
                <img
                    src="https://www.shutterstock.com/image-vector/vector-truck-template-isolated-on-260nw-2461858727.jpg" // Replace with your truck image path
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