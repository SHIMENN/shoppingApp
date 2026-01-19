// רכיב המגן על נתיבי אדמין
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // בדיקה האם המשתמש מחובר והאם הוא אדמין 
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // מאפשר גישה לנתיבים הפנימיים
};

export default AdminRoute;