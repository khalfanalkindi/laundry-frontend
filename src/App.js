import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import LoginPage from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import TokenExpiryModal from './components/TokenExpiryModal';
import api from './components/axiosConfig';
import './App.css';
import { useTranslation } from 'react-i18next';

function App() {
    const location = useLocation();
    const isAuthenticated = !!localStorage.getItem('access_token');
    const [showExpiryModal, setShowExpiryModal] = useState(false);
    
    const { i18n } = useTranslation(); // Use i18n from react-i18next

    const isLoginPage = location.pathname === '/login';

    const handleSignOut = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expiry_time');
        window.location.href = '/login'; // Redirect to login
    }, []);

    const scheduleTokenExpiry = useCallback((expiryTime) => {
        const timeLeft = expiryTime - Date.now();
        if (timeLeft > 0) {
            setTimeout(() => {
                setShowExpiryModal(true); // Show modal 1 minute before expiry
            }, timeLeft - 60000); // 1 minute before expiration
        } else {
            handleSignOut(); // Token already expired
        }
    }, [handleSignOut]);

    useEffect(() => {
        const expiryTime = localStorage.getItem('token_expiry_time');
        if (expiryTime) {
            scheduleTokenExpiry(expiryTime);
        }
    }, [scheduleTokenExpiry]);

    const handleRenew = () => {
        api.post('/token/refresh/', {
            refresh: localStorage.getItem('refresh_token')
        })
        .then(response => {
            const newAccessToken = response.data.access;
            const decodedToken = JSON.parse(atob(newAccessToken.split('.')[1]));
            const newExpiryTime = decodedToken.exp * 1000; // Convert to milliseconds

            localStorage.setItem('access_token', newAccessToken);
            localStorage.setItem('token_expiry_time', newExpiryTime);

            setShowExpiryModal(false);
            scheduleTokenExpiry(newExpiryTime);
        })
        .catch(error => {
            console.error('Token refresh failed', error);
            handleSignOut(); // Redirect if token refresh fails
        });
    };

    // Handle language persistence and direction setting
    useEffect(() => {
        const language = localStorage.getItem('language') || 'en'; // Default to English
        i18n.changeLanguage(language); // Set the language based on the stored value
        document.body.dir = language === 'ar' ? 'rtl' : 'ltr'; // Set the text direction
    }, [i18n]);

    return (
        <div className="app">
            {isAuthenticated && !isLoginPage && <Sidebar />}
            <div className={!isLoginPage ? "main-content" : ""}>
                <TokenExpiryModal
                    show={showExpiryModal}
                    onClose={handleSignOut}
                    onRenew={handleRenew}
                />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/*" element={<PrivateRoute element={<MainContent />} />} />
                </Routes>
            </div>
        </div>
    );
}

function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;
