import React from 'react';
import { Nav, Button, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBoxes, FaClipboardList, FaHome, FaSignOutAlt, FaBars, FaTimes, FaUsers } from 'react-icons/fa';

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleLogout: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, setIsOpen, handleLogout }) => {
  return (
    <div className="d-md-none sticky-top w-100" style={{ zIndex: 1050 }}>
      {/* Navbar עליון קבוע */}
      <div className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center border-bottom">
        <Button 
          variant="link" 
          className="text-dark p-0 shadow-none" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </Button>
        <h5 className="fw-bold text-danger mb-0">כל בו אקספרס</h5>
        <div style={{ width: 20 }} />
      </div>

      {/* תפריט נפתח - משתמש ב-Collapse של Bootstrap */}
      <Collapse in={isOpen}>
        <div className="shadow-lg position-absolute w-100">
          <div className="bg-white p-3 border-bottom rounded-bottom">
            <Nav variant="pills" className="flex-column gap-1">
              <Nav.Item>
                <Nav.Link 
                  eventKey="products" 
                  className="d-flex align-items-center py-3 px-3 rounded-3" 
                  onClick={() => setIsOpen(false)}
                >
                  <FaBoxes className="me-3" /> 
                  <span className="fw-medium">ניהול מוצרים</span>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link
                  eventKey="orders"
                  className="d-flex align-items-center py-3 px-3 rounded-3"
                  onClick={() => setIsOpen(false)}
                >
                  <FaClipboardList className="me-3" />
                  <span className="fw-medium">ניהול הזמנות</span>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link
                  eventKey="users"
                  className="d-flex align-items-center py-3 px-3 rounded-3"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUsers className="me-3" />
                  <span className="fw-medium">ניהול משתמשים</span>
                </Nav.Link>
              </Nav.Item>

              <hr className="my-2 text-muted" />

              <Nav.Item>
                <Button 
                  as={Link as any} 
                  to="/" 
                  variant="light" 
                  className="w-100 text-start py-2 border-0 bg-transparent d-flex align-items-center"
                >
                  <FaHome className="me-3 text-secondary" /> חזרה לחנות
                </Button>
              </Nav.Item>

              <Nav.Item>
                <Button 
                  variant="link" 
                  className="w-100 text-danger text-decoration-none text-start py-2 d-flex align-items-center shadow-none" 
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="me-3" /> התנתקות
                </Button>
              </Nav.Item>
            </Nav>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default MobileSidebar;
