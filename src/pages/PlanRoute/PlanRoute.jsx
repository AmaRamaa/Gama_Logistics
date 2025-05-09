import React from 'react';
import { useParams } from 'react-router-dom';
import North from './North';
import South from './South';
import East from './East';
import West from './West';

const Fleet = () => {
  const { topbarAttributes } = useParams();

  const renderSubComponent = () => {
    switch (topbarAttributes) {
      case 'north':
        return <North />;
      case 'south':
        return <South />;
      case 'east':
        return <East />;
      case 'west':
        return <West />;
      default:
        return <North />;
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
