import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin';

const AdminLayout: React.FC = () => {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1" style={{ overflowY: 'auto', minHeight: '100vh' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
