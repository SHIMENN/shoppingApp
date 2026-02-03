// hooks/useRegister.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

export const useRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setAuthData = useAuthStore((state) => state.setAuthData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('הסיסמאות אינן תואמות. אנא נסה שוב.');
      return;
    }

    try {
      const response = await registerApi(formData.username, formData.email, formData.password);
      setAuthData(response.userData, response.access_token);

      // סנכרון עגלה לאחר התחברות
      await useCartStore.getState().syncCartWithServer();

      alert('נרשמת והתחברת בהצלחה!');
      navigate('/');
    } catch {
      alert('שגיאה בהרשמה. וודא שהפרטים תקינים או שהמשתמש לא קיים כבר.');
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    showPassword,
    setShowPassword,
    handleSubmit,
    updateField
  };
};