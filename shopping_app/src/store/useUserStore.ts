import { create } from 'zustand';
import { AxiosError } from 'axios';
import { type UserState } from '../types/user';
import * as userService from '../services/userService';

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  actionLoading: false,

  loadUsers: async (includeDeleted = false) => {
    set({ loading: true, error: null });
    try {
      const users = includeDeleted
        ? await userService.getAllUsersWithDeleted()
        : await userService.getAllUsers();
      set({ users, loading: false });
    } catch (error) {
      const err = error as AxiosError;
      set({
        error: err.response?.status === 429
          ? 'יותר מדי בקשות. אנא המתן דקה ונסה שוב.'
          : 'שגיאה בטעינת משתמשים',
        loading: false,
      });
    }
  },

  updateUser: async (userId, data) => {
    set({ actionLoading: true, error: null });
    try {
      const updatedUser = await userService.updateUser(userId, data);
      set((state) => ({
        users: state.users.map((u) =>
          u.user_id === userId ? { ...u, ...updatedUser } : u
        ),
        actionLoading: false,
      }));
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({
        error: err.response?.data?.message || 'שגיאה בעדכון משתמש',
        actionLoading: false,
      });
      throw err;
    }
  },

  deleteUser: async (userId) => {
    set({ actionLoading: true, error: null });
    const previousUsers = get().users;

    set((state) => ({
      users: state.users.filter((u) => u.user_id !== userId),
    }));

    try {
      await userService.deleteUser(userId);
      set({ actionLoading: false });
    } catch (error) {
      set({
        users: previousUsers,
        error: 'שגיאה במחיקת משתמש',
        actionLoading: false,
      });
      throw error;
    }
  },

  restoreUser: async (userId) => {
    set({ actionLoading: true, error: null });
    try {
      const restoredUser = await userService.restoreUser(userId);
      set((state) => ({
        users: state.users.map((u) =>
          u.user_id === userId ? { ...u, ...restoredUser } : u
        ),
        actionLoading: false,
      }));
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({
        error: err.response?.data?.message || 'שגיאה בשחזור משתמש',
        actionLoading: false,
      });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
