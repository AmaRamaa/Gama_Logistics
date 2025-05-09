import React from 'react';
import { useParams } from 'react-router-dom';
import Unread from './Unread';
import All from './All';
import System from './System';

const Notification = () => {
  const { topbarAttributes } = useParams();
  const attribute = topbarAttributes ? String(topbarAttributes) : '';

    // Removed redundant switch statement

  const renderSubComponent = () => {
    switch (attribute) {
      case 'unread':
        return <Unread />;
      case 'all':
        return <All />;
      case 'system':
        return <System />;
      default:
        return <Unread />;
    }
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 text-muted">Notification</h2>
      {renderSubComponent()}
    </div>
  );
};

export default Notification;
