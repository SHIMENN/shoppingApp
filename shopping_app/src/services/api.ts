import axios from 'axios';

// שליפת כתובת ה-API ממשתני הסביבה
export const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // מאפשר שליחת עוגיות אם צריך
    headers: {
        'Content-Type': 'application/json'
    },
});

/**
 * Interceptor להוספת טוקן האימות לכל בקשה יוצאת.
 * התיקון: שליפה מתוך ה-Storage של Zustand (auth-storage).
 */
api.interceptors.request.use((config) => {
    try {
        const authData = localStorage.getItem('auth-storage');
        if (authData) {
            const parsedData = JSON.parse(authData);
            // Zustand שומר את המידע תחת אובייקט state
            const token = parsedData.state?.token || parsedData.state?.user?.access_token;
            
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    } catch (error) {
        console.error("Error parsing auth token from localStorage", error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;