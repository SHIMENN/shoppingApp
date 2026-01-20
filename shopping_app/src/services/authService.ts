import api from './api';

/**
 * התחברות למערכת
 */
export const loginApi = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  // השרת מחזיר אובייקט עם { access_token, user }
  return response.data; 
};

/**
 * הרשמה למערכת
 */
export const registerApi = async (username: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};

/**
 * קבלת פרטי המשתמש המחובר
 */
export const getMeApi = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

/**
 * התנתקות
 */
export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};