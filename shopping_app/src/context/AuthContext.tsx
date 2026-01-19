// ניהול הקשר של אימות המשתמש באפליקציה
import React, { createContext, useState, useContext, useEffect } from 'react';
import { type User } from '../types/index';
import  {type AuthContextType}  from '../types/index';



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

  useEffect(() => {
    // בדיקת "זכור אותי" - טעינת המשתמש מה-Storage בטעינת האפליקציה [cite: 22]
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');


    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const setAuthData = (userData: User, token: string) => {
    // 1. שמירה ב-LocalStorage
    localStorage.setItem('token', token); // שמירת ה-JWT [cite: 24]
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token'); // יציאה מהמערכת [cite: 22]
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
       user,
        token,
         isAuthenticated,
         login: setAuthData,
         setAuthData,
          logout 
          }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}