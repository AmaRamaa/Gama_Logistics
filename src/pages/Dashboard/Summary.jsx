import React from 'react';

const Summary = () => {
    // Example driver data — you could fetch this from an API later
    const drivers = [
        {
            name: 'John Doe',
            status: 'Active',
            deliveries: 5,
            phone: '555-123-4567',
        },
        {
            name: 'Jane Smith',
            status: 'On Break',
            deliveries: 2,
            phone: '555-987-6543',
        },
    ];

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Summary</h1>
            <p>Welcome to the summary section. Here is an overview of your data:</p>

            {/* Summary Metrics */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={summaryCardStyle}>
                    <h3>Total Orders</h3>
                    <p>120</p>
                </div>
                <div style={summaryCardStyle}>
                    <h3>Revenue</h3>
                    <p>$15,000</p>
                </div>
                <div style={summaryCardStyle}>
                    <h3>Pending Deliveries</h3>
                    <p>8</p>
                </div>
            </div>

            {/* Driver Information */}
            <div style={{ marginTop: '40px' }}>
                <h2>Driver Information</h2>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {drivers.map((driver, index) => (
                        <div key={index} style={driverCardStyle}>
                            <h4>{driver.name}</h4>
                            <p><strong>Status:</strong> {driver.status}</p>
                            <p><strong>Active Deliveries:</strong> {driver.deliveries}</p>
                            <p><strong>Phone:</strong> {driver.phone}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const summaryCardStyle = {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9'
};

const driverCardStyle = {
    flex: '1 1 300px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
};

export default Summary;
