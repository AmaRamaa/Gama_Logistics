import React from 'react';
import { useParams } from 'react-router-dom';
import Available from './Available';
import InUse from './Use';
import Maintenance from './Maintenance';

const Fleet = () => {
  const { fleetStatus } = useParams();

  const renderFleetComponent = () => {
    switch (fleetStatus) {
      case 'available':
        return <Available />;
      case 'in-use':
        return <InUse />;
      case 'maintenance':
        return <Maintenance />;
      default:
        return <InUse />;
    }
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 text-muted">Fleet</h2>
      {renderFleetComponent()}
    </div>
  );
};

export default Fleet;
