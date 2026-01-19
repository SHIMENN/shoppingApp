// סרגל רכיב הניווט הראשי של האפליקציה
import React from 'react';
import { Navbar, Nav, Container, Button,Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';



const AppNavbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">החנות שלי</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
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
            {user?.role === 'admin' && (
            <Nav.Link as={Link} to="/admin">ניהול</Nav.Link>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3">שלום, {user?.username}</Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={logout}>התנתק</Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={() => navigate('/login')}>התחבר</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;