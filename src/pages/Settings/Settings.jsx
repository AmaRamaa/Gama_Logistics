import React from 'react';
import { useParams } from 'react-router-dom';
import Display from './Display';
import Language from './Language';
import Profile from './Profile';
import Security from './Security';


const Dashboard = () => {
    const { topbarAttributes } = useParams();

    const renderSubComponent = () => {
        switch (topbarAttributes) {
            case 'profile':
                return <Profile />;
            case 'security':
                return <Security />;
            case 'display':
                return <Display />;
            case 'language':
                return <Language />;
            default:
                return <Profile />;
        }
    };

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-4 text-muted">Settings</h2>
            {renderSubComponent()}
        </div>
    );
};

export default Dashboard;
