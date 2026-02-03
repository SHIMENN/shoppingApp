import React from 'react';
import { Navbar, Nav, Container, Badge, Stack } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaHome, FaClipboardList, FaUserShield } from 'react-icons/fa';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import UserMenu from '../user-menu/UserMenu';

const AppNavbar: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const totalItems = useCartStore((state) => state.getTotalItems());

  // פונקציה לעיצוב הקישורים באמצעות מחלקות בוטסטראפ בלבד
  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    // שימוש ב-text-danger לדף פעיל, text-dark לדף רגיל, ו-fw-bold להדגשה
    return `nav-link d-flex align-items-center px-3 fw-bold transition-all ${
      isActive ? 'text-danger border-bottom border-danger border-2' : 'text-dark opacity-75'
    }`;
  };

  return (
    <Navbar bg="white" expand="lg" sticky="top" className="py-2 shadow-sm border-bottom" dir="rtl">
      <Container>
        {/* לוגו בעיצוב נקי - שימוש ב-text-danger ו-fw-bolder */}
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="fw-bolder fs-3 text-danger d-flex align-items-center"
          style={{ letterSpacing: '-1px' }}
        >
          כל בו <span className="text-dark ms-1">אקספרס</span>
        </Navbar.Brand>

        {/* כפתור המבורגר למובייל ללא מסגרת (border-0) */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto align-items-center">
            
            {/* דף הבית */}
            <Nav.Link as={Link} to="/" className={getLinkClass('/')}>
              <FaHome className="ms-2" /> דף הבית
            </Nav.Link>

            {/* עגלת קניות - שימוש ב-position-relative עבור הבאדג' */}
            <Nav.Link as={Link} to="/cart" className={getLinkClass('/cart')}>
              <div className="position-relative ms-2">
                <FaShoppingCart size={20} />
                {totalItems > 0 && (
                  <Badge 
                    pill 
                    bg="danger" 
                    className="position-absolute top-0 start-100 translate-middle border border-light border-2"
                    style={{ fontSize: '0.6rem' }}
                  >
                    {totalItems}
                  </Badge>
                )}
              </div>
              עגלה
            </Nav.Link>

            {/* הזמנות שלי */}
            {isAuthenticated && (
              <Nav.Link as={Link} to="/my-orders" className={getLinkClass('/my-orders')}>
                <FaClipboardList className="ms-2" /> ההזמנות שלי
              </Nav.Link>
            )}

            {/* פאנל ניהול - צבע כחול כדי להבדיל (text-primary) */}
            {isAuthenticated && user?.role === 'admin' && (
              <Nav.Link as={Link} to="/admin" className={getLinkClass('/admin')}>
                <FaUserShield className="ms-2 text-primary" /> ניהול
              </Nav.Link>
            )}
          </Nav>

          {/* אזור המשתמש - עטוף ברקע בהיר ומעוגל (bg-light, rounded-pill) */}
          <Nav className="align-items-center mt-3 mt-lg-0 ms-lg-3">
            <Stack direction="horizontal" className="bg-light rounded-pill px-3 py-1 border shadow-sm">
              <UserMenu />
            </Stack>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;