// רכיב המגן על נתיבי אדמין
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import  {useAuthStore}  from '../../store/useAuthStore'; // ייבוא הסטור של זוסטנד

const AdminRoute: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <div className="text-center mt-5">בודק הרשאות...</div>;
  }
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;