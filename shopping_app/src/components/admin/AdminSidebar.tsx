import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: '📊', label: 'לוח בקרה' },
    { path: '/admin/products', icon: '📦', label: 'ניהול מוצרים' },
    { path: '/admin/orders', icon: '🛒', label: 'ניהול הזמנות' },
    { path: '/', icon: '🏠', label: 'חזרה לאתר' },
  ];

  return (
    <div
      className="bg-dark text-white"
      style={{
        minHeight: '100vh',
        width: '250px',
        position: 'sticky',
        top: 0,
      }}
    >
      <div className="p-4 text-center border-bottom border-secondary">
        <h4 className="mb-0">🛠️ פאנל ניהול</h4>
      </div>

      <Nav className="flex-column p-3">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={item.path}
            className={`text-white py-3 px-3 mb-2 rounded ${
              location.pathname === item.path
                ? 'bg-primary'
                : 'hover-bg-secondary'
            }`}
            style={{
              textDecoration: 'none',
              transition: 'background-color 0.2s',
            }}
          >
            <span className="me-2">{item.icon}</span>
            {item.label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default AdminSidebar;
