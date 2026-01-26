import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const useProfile = () => {
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    first_name: '',
    last_name: '',
    email: '',
  });

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        user_name: user.user_name || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (formData.user_name && formData.user_name.length < 3) {
      alert('שם משתמש חייב להכיל לפחות 3 תווים');
      return;
    }

    setIsSaving(true);
    try {
      const dataToUpdate: Record<string, string> = {};
      if (formData.user_name !== (user?.user_name || '')) dataToUpdate.user_name = formData.user_name;
      if (formData.first_name !== (user?.first_name || '')) dataToUpdate.first_name = formData.first_name;
      if (formData.last_name !== (user?.last_name || '')) dataToUpdate.last_name = formData.last_name;
      if (formData.email !== (user?.email || '')) dataToUpdate.email = formData.email;

      if (Object.keys(dataToUpdate).length === 0) {
        setIsEditing(false);
        return;
      }

      await updateUser(dataToUpdate);
      setIsEditing(false);
      alert('הפרטים עודכנו בהצלחה!');
    } catch (error) {
      alert('שגיאה בעדכון הפרטים');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        user_name: user.user_name || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
      });
    }
    setIsEditing(false);
  };

  return {
    user, isAuthenticated, isEditing, isSaving, formData,
    setFormData, setIsEditing, handleSave, handleCancel, navigate
  };
};