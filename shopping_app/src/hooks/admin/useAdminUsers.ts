import { useState, useEffect } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useToast } from '../useToast';
import { type User, type UserFormData } from '../../types/user';

export const useAdminUsers = () => {
  const { users, loading, loadUsers, updateUser, deleteUser } = useUserStore();
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

  useEffect(() => {
    loadUsers();
  }, []);

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
      } catch {
        showToast('שגיאה במחיקת המשתמש', 'danger');
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
    handleOpenModal,
    handleSubmit,
    handleDelete,
    loadUsers,
    totalUsers,
    adminCount,
    regularCount,
    googleCount,
  };
};
