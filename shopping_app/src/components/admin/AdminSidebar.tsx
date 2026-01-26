import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/products', label: ' מוצרים' },
    { path: '/admin/orders', label: ' הזמנות' },
    { path: '/', label: 'דף הבית' },
  ];

  return (
    <div 
      className="bg-dark text-white vh-100 sticky-top d-flex flex-column" 
      style={{ width: '250px' }} // רוחב קבוע לסיידבר
    >
      <div className="p-4 text-center border-bottom border-secondary">
        <h4 className="mb-0 text-uppercase fw-bold">ניהול</h4>
      </div>

      <Nav className="flex-column p-3 gap-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Nav.Link
              key={item.path}
              as={Link}
              to={item.path}
              className={`
                d-flex align-items-center py-3 px-3 rounded text-white
                ${isActive ? 'bg-primary shadow' : 'bg-transparent border-0'}
              `}
              style={{ transition: '0.3s' }}
            >
              <span className="fw-medium">{item.label}</span>
            </Nav.Link>
          );
        })}
      </Nav>
    </div>
  );
};

export default AdminSidebar;