import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { loginApi } from '../services/authService';
import { API_URL } from '../services/api';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuthData = useAuthStore((state) => state.setAuthData);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { token, user } = await loginApi(email, password);
      setAuthData(user, token);
      navigate('/');
    } catch (err) {
      setError('פרטי התחברות שגויים. נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // עדיף להשתמש במשתנה סביבה (ENV) במקום כתובת קשיחה
    window.location.href = `${API_URL}/auth/google`;
  };

  return { email, setEmail, password, setPassword, error, loading, handleLogin, handleGoogleLogin };
};