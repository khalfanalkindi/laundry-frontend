import axios from 'axios';
import { refreshAccessToken } from './components/auth';

const api = axios.create({
    baseURL: '/api',
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors and refresh the token
api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshAccessToken();
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (err) {
                logout();
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
