
export interface User {
  username: string; // [cite: 74, 75]
  email: string; // [cite: 77, 78]
  isAdmin: boolean; // [cite: 82]
  role: 'user' | 'admin'; // [cite: 85]
}
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuthData: (userData: User, token: string) => void;
  login: (userData: User, token: string) => void; // חובה להוסיף את זה כאן!
  logout: () => void;
}
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  setAuthData: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}