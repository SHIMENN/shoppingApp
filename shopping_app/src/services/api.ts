import axios from 'axios';

const api = axios.create({//הגדרת כתובת השרת
    baseURL:'http://localhost:3000',
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