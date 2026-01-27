import React, { useState } from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaUserPlus, FaSignInAlt, FaChevronDown } from 'react-icons/fa';
import { useAuthStore } from '../../store/useAuthStore';
import { handleLogout } from './UserMenu.logic';

const UserMenu: React.FC = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuthStore();

  return (
    <div 
      className="d-inline-block position-relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Dropdown show={show} align="start">
        {/* כפתור הניווט הראשי */}
        <Dropdown.Toggle 
          as={Button}
          variant={isAuthenticated ? "outline-danger" : "light"}
          className="rounded-pill px-3 py-2 d-flex align-items-center shadow-sm border-2 fw-bold"
          style={{ fontSize: '0.9rem' }}
          onClick={() => !isAuthenticated && navigate('/login')}
        >
          <FaChevronDown className="me-2 small" size={10} />
          
          <span className="mx-2">
            {isAuthenticated ? `שלום ${user?.user_name?.split(' ')[0]}` : 'התחברות'}
          </span>
          
          <FaUser size={14} className={isAuthenticated ? "text-danger" : "text-muted"} />
        </Dropdown.Toggle>

        {/* תפריט נקי - ללא כותרת "אזור אישי" */}
        <Dropdown.Menu 
          show={show} 
          className="shadow-lg border-0 rounded-3 overflow-hidden text-end m-0 p-0"
          style={{ minWidth: '180px' }}
        >
          {/* pt-2 שומר על רצף ה-Hover כדי שהחלון לא ייסגר */}
          <div className="pt-2 bg-transparent"> 
            <div className="bg-white">
              {isAuthenticated ? (
                <>
                  {/* ישר לאופציות - בלי השם למעלה */}
                  <Dropdown.Item onClick={() => navigate('/profile')} className="py-3 border-bottom text-dark">
                    הפרופיל שלי <FaUser className="ms-2 text-muted" size={12} />
                  </Dropdown.Item>
                  
                  <Dropdown.Item 
                    onClick={() => handleLogout(logout, navigate)} 
                    className="py-3 text-danger fw-bold"
                  >
                    התנתקות <FaSignOutAlt className="ms-2" size={12} />
                  </Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.Item onClick={() => navigate('/login')} className="py-3 border-bottom">
                    כניסה למערכת <FaSignInAlt className="ms-2 text-muted" />
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate('/register')} className="py-3">
                    הרשמה <FaUserPlus className="ms-2 text-muted" />
                  </Dropdown.Item>
                </>
              )}
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserMenu;