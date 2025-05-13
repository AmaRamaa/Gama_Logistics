import React from 'react';
import { useParams } from 'react-router-dom';
import Daily from './Daily';
import Weekly from './Weekly';
import Monthly from './Monthly';

const Dashboard = () => {
    const { topbarAttributes } = useParams();

    const renderSubComponent = () => {
        switch (topbarAttributes) {
            case 'daily':
                return <Daily />;
            case 'weekly':
                return <Weekly />;
            case 'monthly':
                return <Monthly />;
            default:
                return <Daily />;
        }
    };

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-4 text-muted">Reports</h2>
            {renderSubComponent()}
        </div>
    );
};

export default Dashboard;
