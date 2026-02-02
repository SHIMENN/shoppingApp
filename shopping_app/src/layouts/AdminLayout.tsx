import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout-wrapper">
      <Outlet /> 
    </div>
  );
};

export default AdminLayout;