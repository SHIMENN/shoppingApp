import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    // הורדנו את ה-d-flex ואת ה-AdminSidebar
    <div className="admin-layout-wrapper">
      {/* ה-Outlet הוא קריטי - הוא זה שמציג את הדפים שלך (Dashboard, Products וכו') */}
      <Outlet /> 
    </div>
  );
};

export default AdminLayout;