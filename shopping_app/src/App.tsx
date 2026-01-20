import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import MainLayout from './layouts/MainLayout';
import AdminRoute from './components/AdminRoute';
import FullPageLoader from './components/common/FullPageLoader';
const Home = lazy(() => import('./pages/Home'));
const Cart = lazy(() => import('./pages/CartPage'));
const Login = lazy(() => import('./pages/LoginPage'));
const Register = lazy(() => import('./pages/Register'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const AdminProducts = lazy(() => import('./pages/Admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/Admin/AdminOrders'));

const App: React.FC = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const loading = useAuthStore((state) => state.loading);

  // בדיקת אימות מול השרת בטעינה ראשונה
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // הצגת לואדר עד שהשרת עונה אם יש טוקן/עוגייה בתוקף
  if (loading) return <FullPageLoader />;

  return (
    <Router>
      {/* Suspense מציג לואדר בזמן שהדפים ב-Lazy Loading נטענים */}
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          {/* שימוש ב-MainLayout כעטיפה לכל הנתיבים שצריכים Navbar */}
          <Route element={<MainLayout />}>
            
            {/* נתיבים ציבוריים */}
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-orders" element={<MyOrders />} />

            {/* נתיבים מוגנים למנהלי מערכת (Admin) */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
            </Route>

            {/* נתיב Catch-all למקרה של דף לא נמצא */}
            <Route path="*" element={
              <div className="text-center mt-5">
                <h1>404</h1>
                <p>אופס! הדף שחיפשת לא קיים.</p>
              </div>
            } />
            
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;