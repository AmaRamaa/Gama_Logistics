import React from 'react';

const Recent = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Recent Activity</h1>
            <p>Here is a summary of your recent activities:</p>
            <ul style={{ marginTop: '20px', listStyleType: 'none', padding: 0 }}>
                <li style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                    <strong>Order #12345</strong> - Delivered on 2023-10-01
                </li>
                <li style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                    <strong>Order #12346</strong> - In transit
                </li>
                <li style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                    <strong>Order #12347</strong> - Pending confirmation
                </li>
                <li style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                    <strong>Order #12348</strong> - Cancelled
                </li>
            </ul>
        </div>
    );
};

export default Recent;