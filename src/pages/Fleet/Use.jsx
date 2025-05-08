import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Use = () => {
    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Fleet in Use</h1>
            <div className="position-relative d-flex justify-content-center">
                <img
                    src="https://as2.ftcdn.net/jpg/05/40/76/61/1000_F_540766172_9BreB2fWcDCPpdArO95n5zGB537lWjdN.jpg"
                    alt="Transparent Truck"
                    className="img-fluid"
                    style={{ maxWidth: "600px" }} // Upscale the truck
                />
                <div
                    className="position-absolute d-flex flex-wrap"
                    style={{
                        top: "43%", // Adjust to align with the truck base
                        left: "38.8%", // Adjust to align horizontally
                        width: "80%", // Adjust width to fit the truck base
                        height: "20%", // Adjust height to fit the truck base
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "10px",
                    }}
                >
                    <div className="bg-light border text-center p-2"><img  style={{width: "40px", height: "40px"}} src="https://img.freepik.com/premium-vector/realistic-cardboard-box-closed-side-view-isolated-white-background_92242-2199.jpg"></img></div>
                    <div className="bg-light border text-center p-2"><img  style={{width: "40px", height: "40px"}} src="https://img.freepik.com/premium-vector/realistic-cardboard-box-closed-side-view-isolated-white-background_92242-2199.jpg"></img></div>
                    <div className="bg-light border text-center p-2"><img  style={{width: "40px", height: "40px"}} src="https://img.freepik.com/premium-vector/realistic-cardboard-box-closed-side-view-isolated-white-background_92242-2199.jpg"></img></div>
                </div>
            </div>
        </div>
    );
};

export default Use;