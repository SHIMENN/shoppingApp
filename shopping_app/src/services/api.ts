//חיבור לשרת רק עם עוגיות
import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // זה החלק הקריטי עבור עוגיות!
    headers: {
        'Content-Type': 'application/json'
    },
});

export default api;