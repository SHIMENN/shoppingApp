//חיבור לשרת עם עוגיות + טוקן
import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
});

// טיפול אוטומטי בתפוגת עוגייה - אם השרת מחזיר 401, מנקים את המצב ומפנים ללוגין
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // נמנע מלופ אינסופי - לא מפנים אם כבר בדף הלוגין או בקריאת profile
            const isAuthRoute = error.config?.url?.includes('/auth/');
            if (!isAuthRoute) {
                // ניקוי localStorage וניתוב ללוגין
                localStorage.removeItem('auth-storage');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api