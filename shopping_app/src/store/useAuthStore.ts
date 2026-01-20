import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMeApi } from '../services/authService';
import { type AuthState } from '../types/user';


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          loading: false 
        });
        localStorage.removeItem('auth-storage'); // ניקוי ה-persist
      },

      // בדיקת אימות מול השרת (בשביל העוגיות של גוגל)
      checkAuth: async () => {
        set({ loading: true });
        try {
          const userData = await getMeApi();
          set({ 
            user: userData, 
            isAuthenticated: true, 
            loading: false 
          });
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