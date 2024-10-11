import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Login function to obtain JWT tokens (access and refresh)
export const login = (username, password) => {
    return axios.post(`${API_BASE_URL}/api/token/`, { username, password })
        .then(response => {
            // Save the access and refresh tokens to local storage
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            return response.data; // Return the tokens
        })
        .catch(error => {
            console.error('Login error:', error);
            throw error; // Propagate the error to handle it in the UI
        });
};

// Logout function to remove tokens from local storage
export const logout = () => {
    // Remove tokens from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Redirect to the login page
    window.location.href = '/login';  // Redirect to login page
};

// Function to refresh the access token using the refresh token
export const refreshAccessToken = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        // No refresh token available, redirect to login
        window.location.href = '/login';
        return Promise.reject('No refresh token found');
    }

    // Post request to refresh the access token
    return axios.post(`${API_BASE_URL}/api/token/refresh/`, { refresh: refreshToken })
        .then(response => {
            // Save the new access token to local storage
            localStorage.setItem('access_token', response.data.access);
            return response.data.access;
        })
        .catch(error => {
            console.error('Token refresh error:', error);
            // If token refresh fails, log the user out
            logout();
            throw error;
        });
};

// Function to get the access token from local storage
export const getAccessToken = () => {
    return localStorage.getItem('access_token');
};
