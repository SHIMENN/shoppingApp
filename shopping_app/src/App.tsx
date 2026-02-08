import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import MainLayout from './layouts/MainLayout';
import { AdminRoute, ProtectedRoute } from './components/routing';
import FullPageLoader from './components/common/FullPageLoader';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import Profile from './pages/Profile';
import CheckoutPage from './pages/Checkout';
import AdminLayout from './layouts/AdminLayout';

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
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            {/* נתיבים ציבוריים */}
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* נתיבים מוגנים - דורשים התחברות */}
            <Route element={<ProtectedRoute />}>
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Route>


          </Route>
          {/* נתיבים מוגנים למנהלי מערכת (Admin) עם Layout נפרד */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
            </Route>
          </Route>

          {/* נתיב Catch-all למקרה של דף לא נמצא */}
          <Route path="*" element={
            <div className="text-center mt-5">
              <h1>404</h1>
              <p>אופס! הדף שחיפשת לא קיים.</p>
            </div>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;