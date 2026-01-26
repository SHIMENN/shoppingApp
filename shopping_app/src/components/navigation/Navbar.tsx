import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import UserMenu from '../UserMenu/UserMenu';

const AppNavbar: React.FC = () => {
  const location = useLocation(); // בודק באיזה דף אנחנו
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const totalItems = useCartStore((state) => state.getTotalItems());

  // פונקציה שעוזרת לנו לקבוע את הצבע: אפור אם זה הדף הנוכחי, כחול אם לא
  const getButtonClass = (path: string) => {
    const isActive = location.pathname === path;
    return `nav-link border rounded px-3 ms-lg-2 transition-all ${
      isActive ? 'bg-secondary text-white' : 'bg-primary text-white'
    }`;
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="py-2 shadow-sm">
      <Container>
        {/* דף הבית */}
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className={getButtonClass('/')}
        >
          דף הבית
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto text-end align-items-center">
            
            {/* כפתור הזמנות */}
            {isAuthenticated && (
              <Nav.Link 
                as={Link} 
                to="/my-orders" 
                className={getButtonClass('/my-orders')}
              >
                הזמנות
              </Nav.Link>
            )}
            
            {/* כפתור עגלה */}
            <Nav.Link 
              as={Link} 
              to="/cart" 
              className={getButtonClass('/cart')}
            >
              עגלה 
              {totalItems > 0 && (
                <Badge pill bg="danger" className="ms-2">{totalItems}</Badge>
              )}
            </Nav.Link>
            
            {/* פאנל ניהול */}
            {isAuthenticated && user?.role === 'admin' && (
              <Nav.Link 
                as={Link} 
                to="/admin" 
                className={getButtonClass ('/admin')}
              >
                פאנל ניהול
              </Nav.Link>
            )}
          </Nav>
          
          <Nav className="align-items-center ">
            <UserMenu />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;