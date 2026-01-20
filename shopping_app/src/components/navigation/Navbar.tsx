import React from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';

const AppNavbar: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top"className="py-2 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">החנות שלי</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto text-end">
            <Nav.Link as={Link} to="/">מוצרים</Nav.Link>
            
            <Nav.Link as={Link} to="/cart" className="d-flex align-items-center">
              עגלה 🛒
              {totalItems > 0 && (
                <Badge pill bg="danger" className="ms-1">
                  {totalItems}
                </Badge>
              )}
            </Nav.Link>

            {isAuthenticated && (
              <Nav.Link as={Link} to="/my-orders">ההזמנות שלי</Nav.Link>
            )}

            {/* בדיקת הרשאת אדמין מהסטור */}
            {user?.role === 'admin' && (
              <Nav.Link as={Link} to="/admin" className="text-warning fw-bold">
                🛠️ פאנל ניהול
              </Nav.Link>
            )}
          </Nav>
          
          <Nav className="align-items-center">
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3 text-light">
                  שלום <strong>{user?.user_name}</strong>
                </Navbar.Text>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  התנתק
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
                התחבר
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;