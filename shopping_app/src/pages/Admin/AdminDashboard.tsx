import React from 'react';
import { Container, Row, Col, Nav, Tab, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBoxes, FaClipboardList, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useAuthStore } from '../../store/useAuthStore'; // הנחה שזה מיקום ה-store שלך
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';

const AdminDashboard: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('האם אתה בטוח שברצונך להתנתק?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <Container fluid className="bg-light min-vh-100 p-0" dir="rtl">
      <Tab.Container id="admin-tabs" defaultActiveKey="products">
        <Row className="g-0">
          {/* סרגל צד ימני */}
          <Col md={3} lg={2} className="bg-white shadow-sm min-vh-100 p-3 d-flex flex-column sticky-top">
            <div className="text-center mb-4 pt-3">
              <h4 className="fw-bold text-danger">כל בו אקספרס</h4>
              <small className="text-muted">ניהול מערכת</small>
            </div>
            
            <Nav variant="pills" className="flex-column gap-2 flex-grow-1">
              <Nav.Item>
                <Nav.Link eventKey="products" className="d-flex align-items-center py-3">
                  <FaBoxes className="me-2" /> ניהול מוצרים
                </Nav.Link>
              </Nav.Item>
              
              <Nav.Item>
                <Nav.Link eventKey="orders" className="d-flex align-items-center py-3">
                  <FaClipboardList className="me-2" /> ניהול הזמנות
                </Nav.Link>
              </Nav.Item>
            </Nav>
            
            <hr className="my-4" />

            {/* כפתורי פעולה בתחתית */}
            <div className="d-grid gap-2 mb-3">
              {/* תיקון שגיאת ה-TypeScript באמצעות (Link as any) */}
              <Button 
                as={Link as any} 
                to="/" 
                variant="outline-secondary" 
                className="d-flex align-items-center justify-content-center py-2 border-0"
              >
                <FaHome className="me-2" /> חזרה לחנות
              </Button>

              <Button 
                variant="link" 
                className="d-flex align-items-center justify-content-center py-2 text-danger text-decoration-none shadow-none"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-2" /> התנתקות
              </Button>
            </div>

            <div className="text-center">
              <small className="text-muted">גרסה 1.0.2</small>
            </div>
          </Col>

          {/* תוכן ראשי */}
          <Col md={9} lg={10} className="p-4">
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4">
                <Tab.Content>
                  <Tab.Pane eventKey="products">
                    <div className="mb-4">
                      <h3 className="fw-bold text-dark">📦 קטלוג מוצרים</h3>
                      <p className="text-muted">ניהול מלאי ומוצרים</p>
                    </div>
                    <AdminProducts />
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="orders">
                    <div className="mb-4">
                      <h3 className="fw-bold text-dark">📑 ניהול הזמנות</h3>
                      <p className="text-muted">מעקב אחר הזמנות לקוחות</p>
                    </div>
                    <AdminOrders />
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default AdminDashboard;