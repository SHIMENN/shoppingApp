import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMeApi, updateUserApi } from '../services/authService';
import { type AuthState, type User } from '../types/user';
import { useCartStore } from './useCartStore';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // מצב ראשוני
      user: null,
      token: null,
      isAuthenticated: false,
      loading: true,

      // עדכון נתונים לאחר התחברות/הרשמה
      setAuthData: (user, token) => {
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          loading: false 
        });
      },

      // התנתקות
      logout: () => 
        {set({ user: null, token: null, isAuthenticated: false,loading: false });
        localStorage.removeItem('auth-storage'); 
        useCartStore.setState({ cart: [] });
      },

      // עדכון פרטי משתמש
      updateUser: async (data: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = await updateUserApi(currentUser.user_id, data);
        set({ user: { ...currentUser, ...updatedUser } });
      },

      // בדיקת אימות מול השרת (בשביל העוגיות של גוגל)
      checkAuth: async () => {
        const wasAuthenticated = get().isAuthenticated;
        set({ loading: true });
        try {
          const userData = await getMeApi();
          set({
            user: userData,
            isAuthenticated: true,
            loading: false
          });

          // סנכרון עגלת האורח לשרת רק אם זו התחברות חדשה
          if (!wasAuthenticated) {
            await useCartStore.getState().syncCartWithServer();
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            loading: false
          });
        }
      },
    }),
    {
      name: 'auth-storage', // שם המפתח ב-LocalStorage
      // אנחנו רוצים לשמור רק את ה-user וה-token, לא את ה-loading
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);