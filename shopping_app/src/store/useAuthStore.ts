import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMeApi, updateUserApi } from '../services/authService';
import { type AuthState, type User } from '../types/user';
import { useCartStore } from './useCartStore';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // --- מצב ראשוני ---
      user: null,
      token: null,
      isAuthenticated: false,
      loading: true,
      isMenuOpen: false, // סטייט חדש לתפריט

      // --- פעולות (Actions) ---

      // שליטה בתפריט
      setIsMenuOpen: (open: boolean) => set({ isMenuOpen: open }),

      setAuthData: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          loading: false
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          isMenuOpen: false // סגירת התפריט בזמן התנתקות
        });
        localStorage.removeItem('auth-storage');
        useCartStore.setState({ cart: [] });
      },

      updateUser: async (data: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = await updateUserApi(currentUser.user_id, data);
        set({ user: { ...currentUser, ...updatedUser } });
      },

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

          if (!wasAuthenticated) {
            await useCartStore.getState().syncCartWithServer();
          }
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            isMenuOpen: false
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      // חשוב: אנחנו מוסיפים רק את מה שצריך להישמר בריענון דף
      // ה-isMenuOpen נשאר בחוץ כדי שיתאפס ל-false בכל טעינה
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);