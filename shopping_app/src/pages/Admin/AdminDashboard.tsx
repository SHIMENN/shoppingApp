import React, { useState } from 'react';
import { Row, Col, Nav, Tab, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBoxes, FaClipboardList, FaHome, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import { useAuthStore } from '../../store/useAuthStore';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import MobileSidebar from '../../components/admin/MobileSidebar';

const AdminDashboard: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = () => {
    if (window.confirm('האם אתה בטוח שברצונך להתנתק?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <Tab.Container id="admin-tabs" defaultActiveKey="products">
      <MobileSidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        handleLogout={handleLogout} 
      />

      <Row className="g-0">
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

            <Nav.Item>
              <Nav.Link eventKey="users" className="d-flex align-items-center py-3">
                <FaUsers className="me-2" /> ניהול משתמשים
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <hr className="my-4" />

          {/* כפתורי פעולה בתחתית הסרגל */}
          <div className="d-grid gap-2 mb-3">
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

        {/* 3. תוכן ראשי (Main Content) */}
        <Col md={9} lg={10} className="p-3 p-md-4">
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-3 p-md-4">
              <Tab.Content>
                
                {/* טאב מוצרים */}
                <Tab.Pane eventKey="products">
                  <div className="mb-4">
                    <h3 className="fw-bold text-dark">קטלוג מוצרים</h3>
                    <p className="text-muted">ניהול מלאי ומוצרים</p>
                  </div>
                  <AdminProducts />
                </Tab.Pane>

                {/* טאב הזמנות */}
                <Tab.Pane eventKey="orders">
                  <div className="mb-4">
                    <h3 className="fw-bold text-dark">ניהול הזמנות</h3>
                    <p className="text-muted">מעקב אחר הזמנות לקוחות</p>
                  </div>
                  <AdminOrders />
                </Tab.Pane>

                {/* טאב משתמשים */}
                <Tab.Pane eventKey="users">
                  <div className="mb-4">
                    <h3 className="fw-bold text-dark">ניהול משתמשים</h3>
                    <p className="text-muted">צפייה ועריכת פרטי משתמשים</p>
                  </div>
                  <AdminUsers />
                </Tab.Pane>

              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </Tab.Container>
  );
};

export default AdminDashboard;