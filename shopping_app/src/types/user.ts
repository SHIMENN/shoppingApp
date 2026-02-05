/**
 * טיפוסים עבור משתמשים - פרטי משתמש, הרשאות, ומצב אותנטיקציה
 */

export interface User {
  user_id: number;
  user_name: string;
  email: string;
  role: 'user' | 'admin';
  first_name?: string;
  last_name?: string;
  created_at?: Date;
  google_id?: string;
  provider?: string;
  picture?: string;
  deleted_at?: string;
}
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuthData: (userData: User, token: string) => void;
  login: (userData: User, token: string) => void;
  logout: () => void;
}
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  isMenuOpen: boolean;
  setAuthData: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
  setIsMenuOpen: (open: boolean) => void;
}

export interface UserFormData {
  user_name: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin';
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  loadUsers: (includeDeleted?: boolean) => Promise<void>;
  updateUser: (userId: number, data: Partial<UserFormData>) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  restoreUser: (userId: number) => Promise<void>;
  clearError: () => void;
}