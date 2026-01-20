import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({//הגדרת כתובת השרת
    baseURL:API_URL,
    withCredentials: true,
    headers:{
    'Content-Type': 'application/json'
    },
});//שליחה של טוקן עם כל בקשה
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export default api;