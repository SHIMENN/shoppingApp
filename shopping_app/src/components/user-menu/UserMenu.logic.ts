// UserMenu.logic.ts
import { useAuthStore } from '../../store/useAuthStore';
import { logoutApi } from '../../services/authService';

let timeoutId: ReturnType<typeof setTimeout> | null = null;

/**
 * פתיחת התפריט במעבר עכבר
 */
export const handleMouseEnter = () => {
  if (timeoutId) clearTimeout(timeoutId);
  useAuthStore.getState().setIsMenuOpen(true);
};

/**
 * סגירת התפריט במעבר עכבר עם השהייה (Delay)
 */
export const handleMouseLeave = () => {
  timeoutId = setTimeout(() => {
    useAuthStore.getState().setIsMenuOpen(false);
  }, 150);
};

/**
 * לוגיקת התנתקות מהמערכת
 */
export const handleLogoutAction = async (logoutFn: () => void, navigate: (path: string) => void) => {
  try {
    // 1. קריאה לשרת (אופציונלי - לפי ה-API שלך)
    await logoutApi(); 
  } catch (error) {
    console.error("Logout failed", error);
  } finally {
    // 2. ניקוי הסטייט בזוסטנד (כולל סגירת התפריט)
    logoutFn(); 
    
    // 3. ניקוי ה-persist באופן ידני לביטחון
    localStorage.removeItem('auth-storage');
    
    // 4. העברה לדף הבית
    navigate('/');
  }
};