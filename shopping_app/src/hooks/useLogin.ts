import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { loginApi } from '../services/authService';
import { API_URL } from '../services/api';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const navigate = useNavigate();

  // ניקוי שגיאות בעת שינוי שדות
  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    if (error) setError('');
  }, [error]);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    if (error) setError('');
  }, [error]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email.trim() || !password.trim()) {
      setError('נא למלא את כל השדות');
      return;
    }

    if (!email.includes('@')) {
      setError('כתובת אימייל לא תקינה');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // התחברות
      const { userData } = await loginApi(email, password);
      
      // העוגייה נשלחת אוטומטית ע"י הדפדפן
      setAuthData(userData, ''); // 👈 שמרתי את הפרמטר השני
      
      // סנכרון עגלת קניות
      try {
        await useCartStore.getState().syncCartWithServer();
      } catch (syncError) {
        // לוג השגיאה אבל לא לחסום את המשתמש
        console.error('Failed to sync cart:', syncError);
      }

      // ניקוי הטופס
      setEmail('');
      setPassword('');
      
      // מעבר לדף הבית
      navigate('/');
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'שגיאה בהתחברות. אנא נסה שנית.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useCallback(() => {
    // העברת השליטה לשרת
    window.location.href = `${API_URL}/auth/google`;
  }, []);

  return {
    email,
    setEmail: handleEmailChange,
    password,
    setPassword: handlePasswordChange,
    error,
    loading,
    handleLogin,
    handleGoogleLogin
  };
};