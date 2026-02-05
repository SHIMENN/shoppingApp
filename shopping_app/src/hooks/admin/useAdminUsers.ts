import { useState, useEffect } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { AxiosError } from 'axios';
import { useToast } from '../useToast';
import { type User, type UserFormData } from '../../types/user';

export const useAdminUsers = () => {
  const { users, loading, loadUsers, updateUser, deleteUser, restoreUser } = useUserStore();
  const { toasts, showToast, removeToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    user_name: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'user',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    loadUsers(showDeleted);
  }, [showDeleted]);

  const handleOpenModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      user_name: user.user_name || '',
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      role: user.role,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!editingUser) return;
    try {
      await updateUser(editingUser.user_id, formData);
      setShowModal(false);
      showToast('המשתמש עודכן בהצלחה', 'success');
    } catch {
      showToast('שגיאה בעדכון המשתמש', 'danger');
    }
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
      try {
        await deleteUser(userId);
        showToast('המשתמש נמחק בהצלחה', 'success');
      } catch (error) {
        // בודקים אם השגיאה קשורה לאילוצי מפתח זר (הזמנות קיימות)
        const err = error as AxiosError<{ message: string; error?: string }>;
        const serverMessage = err.response?.data?.message || err.response?.data?.error || '';

        let displayMessage = 'שגיאה במחיקת המשתמש';
        if (serverMessage.toLowerCase().includes('foreign key') || serverMessage.toLowerCase().includes('order')) {
          displayMessage = 'לא ניתן למחוק משתמש זה (יש לו הזמנות או נתונים מקושרים)';
        } else if (serverMessage) {
          displayMessage = `שגיאה במחיקת המשתמש`;
        }

        showToast(displayMessage, 'danger');
      }
    }
  };

  const handleRestore = async (userId: number) => {
    if (window.confirm('האם אתה בטוח שברצונך לשחזר משתמש זה?')) {
      try {
        await restoreUser(userId);
        showToast('המשתמש שוחזר בהצלחה', 'success');
      } catch {
        showToast('שגיאה בשחזור המשתמש', 'danger');
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      (user.user_name?.toLowerCase() || '').includes(term) ||
      (user.email?.toLowerCase() || '').includes(term) ||
      (user.first_name?.toLowerCase() || '').includes(term) ||
      (user.last_name?.toLowerCase() || '').includes(term)
    );
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const regularCount = users.filter((u) => u.role === 'user').length;
  const googleCount = users.filter((u) => u.provider === 'google').length;

  return {
    users: filteredUsers,
    allUsers: users,
    loading,
    toasts,
    removeToast,
    showModal,
    setShowModal,
    editingUser,
    formData,
    setFormData,
    searchTerm,
    setSearchTerm,
    showDeleted,
    setShowDeleted,
    handleOpenModal,
    handleSubmit,
    handleDelete,
    handleRestore,
    loadUsers,
    totalUsers,
    adminCount,
    regularCount,
    googleCount,
  };
};
