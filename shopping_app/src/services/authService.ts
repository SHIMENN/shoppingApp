//    שירות האימות
import api from './api';

export const loginApi = async (email: string, password: string) => {
  // קריאה ל-Endpoint של הכניסה [cite: 21, 23]
  const response = await api.post('/auth/login', { email, password });
  return response.data; // מחזיר { token, user }
};

export const registerApi = async (username: string, email: string, password: string) => {
  // קריאה ל-Endpoint של ההרשמה [cite: 19, 23]
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};