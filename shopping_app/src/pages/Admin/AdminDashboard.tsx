import React, { useState } from 'react';
import { Row, Col, Nav, Tab, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBoxes, FaClipboardList, FaHome, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useAuthStore } from '../../store/useAuthStore'; // הנחה שזה מיקום ה-store שלך
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';

const AdminDashboard: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('האם אתה בטוח שברצונך להתנתק?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <>
      <Tab.Container id="admin-tabs" defaultActiveKey="products">
        {/* תפריט עליון למסכים קטנים */}
        <div className="d-md-none bg-white shadow-sm p-3 d-flex justify-content-between align-items-center sticky-top">
          <Button variant="link" className="text-dark p-0" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars size={20} />
          </Button>
          <h5 className="fw-bold text-danger mb-0">כל בו אקספרס</h5>
          <div style={{ width: 20 }} />
        </div>

        {sidebarOpen && (
          <div className="d-md-none bg-white shadow-sm p-3">
            <Nav variant="pills" className="flex-column gap-2">
              <Nav.Item>
                <Nav.Link eventKey="products" className="d-flex align-items-center py-2" onClick={() => setSidebarOpen(false)}>
                  <FaBoxes className="me-2" /> ניהול מוצרים
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders" className="d-flex align-items-center py-2" onClick={() => setSidebarOpen(false)}>
                  <FaClipboardList className="me-2" /> ניהול הזמנות
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Button as={Link as any} to="/" variant="outline-secondary" size="sm" className="w-100 mt-2 border-0">
                  <FaHome className="me-2" /> חזרה לחנות
                </Button>
              </Nav.Item>
              <Nav.Item>
                <Button variant="link" size="sm" className="w-100 text-danger text-decoration-none" onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" /> התנתקות
                </Button>
              </Nav.Item>
            </Nav>
          </div>
        )}

        <Row className="g-0">
          {/* סרגל צד ימני - מוסתר במסכים קטנים */}
          <Col md={3} lg={2} className="bg-white shadow-sm p-3 d-none d-md-flex flex-column sticky-top" style={{ height: '100vh', overflowY: 'auto' }}>
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
          <Col md={9} lg={10} className="p-3 p-md-4">
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-3 p-md-4">
                <Tab.Content>
                  <Tab.Pane eventKey="products">
                    <div className="mb-4">
                      <h3 className="fw-bold text-dark">קטלוג מוצרים</h3>
                      <p className="text-muted">ניהול מלאי ומוצרים</p>
                    </div>
                    <AdminProducts />
                  </Tab.Pane>

                  <Tab.Pane eventKey="orders">
                    <div className="mb-4">
                      <h3 className="fw-bold text-dark">ניהול הזמנות</h3>
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
    </>
  );
};

export default AdminDashboard;