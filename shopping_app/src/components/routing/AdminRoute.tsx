// רכיב המגן על נתיבי אדמין
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import  {useAuthStore}  from '../../store/useAuthStore'; // ייבוא הסטור של זוסטנד

const AdminRoute: React.FC = () => {
  // שליפת הנתונים מה-Store
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);

  // בזמן שהמערכת בודקת אימות (למשל מול עוגיות גוגל), נציג טעינה
  if (loading) {
    return <div className="text-center mt-5">בודק הרשאות...</div>;
  }

  // בדיקה האם המשתמש מחובר והאם התפקיד שלו הוא אדמין
  // הערה: וודא שב-User Type שלך מוגדר 'role' או 'isAdmin'
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // אם הכל תקין, אפשר לגשת לנתיבי האדמין
  return <Outlet />;
};

export default AdminRoute;