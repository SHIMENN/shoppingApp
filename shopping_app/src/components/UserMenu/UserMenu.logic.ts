import { type NavigateFunction } from 'react-router-dom';
import { logoutApi } from '../../services/authService';

export const handleLogout = async (logoutFn: () => void, navigate: NavigateFunction) => {
  try {
    await logoutApi(); // קריאה לשרת (אם קיימת)
  } catch (error) {
    console.error("Logout failed", error);
  }
  
  logoutFn(); // ניקוי ה-Zustand
  navigate('/'); // שליחת המשתמש לדף הבית
};