import api from './api';

/**
 * התחברות למערכת
 */
export const loginApi = async (email: string, password: string) => {
  const response = await api.post('/auth/login-cookie', { email, password });
  // השרת מגדיר עוגיית access_token ומחזיר { userData }
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

/**
 * עדכון פרטי משתמש
 */
export const updateUserApi = async (userId: number, data: {
  user_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}) => {
  const response = await api.patch(`/users/${userId}`, data);
  return response.data;
};

/**
 * בקשה לאיפוס סיסמה - שליחת אימייל עם קישור
 */
export const forgotPasswordApi = async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

/**
 * איפוס סיסמה עם טוקן
 */
export const resetPasswordApi = async (token: string, newPassword: string) => {
  const response = await api.post('/auth/reset-password', { token, newPassword });
  return response.data;
};

/**
 * אימות אימייל עם טוקן
 */
export const verifyEmailApi = async (token: string) => {
  const response = await api.get(`/auth/verify-email?token=${token}`);
  return response.data;
};

/**
 * שליחת אימייל אימות מחדש
 */
export const resendVerificationEmailApi = async (email: string) => {
  const response = await api.post('/auth/resend-verification', { email });
  return response.data;
};