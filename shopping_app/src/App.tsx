// קובץ הניהול הראשי של האפליקציה
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppNavbar from './components/Navbar';
import Home from './pages/Home/Home'; // דף הבית  
import Cart from './pages/Cart'; // דף העגלה
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminRoute from './components/AdminRoute';
import AdminOrders from './pages/Admin/AdminOrders';
import MyOrders from './pages/MyOrders';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppNavbar />
          <main className="py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
              </Route>
            </Routes>
          </main>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;