import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token'); // Corrected token key
    console.log("Access Token: ", token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;
