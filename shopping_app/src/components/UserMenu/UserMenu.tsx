import React from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { handleLogoutAction } from './UserMenu.logic';

// Custom Toggle כדי למנוע את החץ הכפול של בוטסטראפ
const CustomToggle = React.forwardRef(({ children, onClick }: any, ref: any) => (
  <div
    ref={ref}
    role="button"
    className="d-flex align-items-center gap-3 text-dark border-0 p-0 bg-transparent shadow-none"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </div>
));

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user, isMenuOpen, setIsMenuOpen } = useAuthStore();

  return (
    <div className="d-inline-block">
      <Dropdown show={isMenuOpen} onToggle={(next) => setIsMenuOpen(next)}>

        <Dropdown.Toggle as={CustomToggle}>
          <i className="bi bi-chevron-down text-muted small" />

          <div className="d-flex flex-column text-end">
            <span className="text-muted small lh-1 mb-1">ברוכים הבאים</span>
            <span className="fw-bold small lh-1 text-nowrap">
              {isAuthenticated ? user?.user_name?.split(' ')[0] : 'התחבר / הרשמה'}
            </span>
          </div>

          <i className="bi bi-person-circle text-muted fs-5" />
        </Dropdown.Toggle>

        <Dropdown.Menu
          className="shadow border-0 rounded-4 p-4 mt-2 text-center start-50 translate-middle-x w-auto"
        >
          {!isAuthenticated ? (
            <>
              <i className="bi bi-person-circle d-block mb-2 text-secondary fs-1" />

              <div className="d-grid mb-3">
                <Button
                  variant="dark"
                  className="rounded-pill py-2 fw-bold text-white border-0 shadow-none"
                  onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                >
                  התחבר
                </Button>
              </div>

              <div
                className="text-danger fw-bold small py-1"
                role="button"
                onClick={() => { navigate('/register'); setIsMenuOpen(false); }}
              >
                הרשם
              </div>
            </>
          ) : (
            <>
              <div className="pb-3 mb-2 border-bottom text-center">
                <i className="bi bi-person-circle d-block mb-1 text-secondary fs-2" />
                <span className="text-muted small">שלום,</span>
                <div className="fw-bold text-dark text-truncate">{user?.user_name}</div>
              </div>

              <Dropdown.Item
                onClick={() => handleLogoutAction(logout, navigate)}
                className="text-danger fw-bold py-2 bg-transparent border-0 shadow-none d-flex align-items-center justify-content-center"
              >
                <span className="me-2">התנתקות</span>
                <i className="bi bi-box-arrow-right fs-6" />
              </Dropdown.Item>
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserMenu;