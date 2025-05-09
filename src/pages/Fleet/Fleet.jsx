import React from 'react';
import { useParams } from 'react-router-dom';
import Available from './Available';
import InUse from './Use';
import Maintenance from './Maintenance';

const Fleet = () => {
  const { topbarAttributes } = useParams();

  const renderSubComponent = () => {
    switch (topbarAttributes) {
      case 'available':
        return <Available />;
      case 'use':
        return <InUse />;
      case 'in-maintenance':
        return <Maintenance />;
      default:
        return <InUse />;
    }
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 text-muted">Fleet</h2>
      {renderSubComponent()}
    </div>
  );
};

export default Fleet;
