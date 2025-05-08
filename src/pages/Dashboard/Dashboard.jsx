import React from 'react';
import { useParams } from 'react-router-dom';
import Summary from './Summary';
import LiveMap from './LiveMap';
import Recent from './Recent';

const Dashboard = () => {
    const { topbarAttributes } = useParams();

    const renderSubComponent = () => {
        switch (topbarAttributes) {
            case 'summary':
                return <Summary />;
            case 'live-map':
                return <LiveMap />;
            case 'recent':
                return <Recent />;
            case 'notifications':
                window.location.href = '/notification';
                return null;
            default:
                return <Summary />;
        }
    };

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-4 text-muted">Dashboard</h2>
            {renderSubComponent()}
        </div>
    );
};

export default Dashboard;
