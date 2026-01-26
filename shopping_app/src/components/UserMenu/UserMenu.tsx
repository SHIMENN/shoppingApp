import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { handleLogout } from './UserMenu.logic';
import silhouette from '../../assets/silhouette.png';

const UserMenu: React.FC = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <div 
      className="d-inline-block position-relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {/* הריבוע האדום-לבן עם התמונה */}
      <div 
        className="d-flex align-items-center justify-content-center bg-danger text-white fw-bold shadow-sm rounded-0 border border-2 border-white overflow-hidden"
        style={{ width: '45px', height: '45px', cursor: 'pointer' }}
        onClick={() => !isAuthenticated && navigate('/login')}
      >
        <img 
          src={silhouette} 
          alt="User" 
          className="img-fluid w-100 h-100 p-1" 
        />
      </div>

      {/* התפריט הנפתח */}
      <Dropdown.Menu 
        show={show} 
        className="mt-0 shadow-lg border-0 overflow-hidden"
        align="end"
      >
        {isAuthenticated ? (
          <>
            {/* אפשר להוסיף כאן קישור לפרופיל או הגדרות */}
            <Dropdown.Item onClick={() => navigate('/profile')} className="py-2">
              הפרופיל שלי
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item 
              onClick={() => handleLogout(logout, navigate)} 
              className="py-2 text-danger fw-bold"
            >
              התנתקות
            </Dropdown.Item>
          </>
        ) : (
          <>
            <Dropdown.Item onClick={() => navigate('/login')} className="py-2">
              כניסה
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/register')} className="py-2">
              הרשמה
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </div>
  );
};

export default UserMenu;