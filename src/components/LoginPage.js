import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import api from './axiosConfig';
import logo from '../assets/images/thelogo.png';  // Ensure you have the logo image in place
import './LoginPage.css'; 
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; 

function LoginPage() {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (i18n.language === 'ar') {
            document.body.setAttribute('dir', 'rtl');
        } else {
            document.body.setAttribute('dir', 'ltr');
        }
    }, [i18n.language]);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        api.post('/token/', { username, password })
            .then(response => {
                const accessToken = response.data.access;
                const refreshToken = response.data.refresh;
    
                const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
                const expiryTime = decodedToken.exp * 1000;
    
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', refreshToken);
                localStorage.setItem('username', username);
                localStorage.setItem('token_expiry_time', expiryTime);
    
                api.get('/users/me/', { 
                    headers: { 
                        'Authorization': `Bearer ${accessToken}` 
                    } 
                })
                .then(userResponse => {
                    const userRole = userResponse.data.role.role_name;
                    localStorage.setItem('role', userRole);
    
                    window.location.href = '/';
                })
                .catch(error => {
                    console.error('Error fetching user profile:', error);
                    setError(t('error_fetching_user_details'));
                });
            })
            .catch(() => {
                setError(t('invalid_credentials'));
            });
    };

    return (
        <div className="login-page">
            <Container className="login-container">
                <div className="login-box">
                    <LanguageSwitcher />
                    <img src={logo} alt="Logo" className="login-logo" />
                    <h2>{t('login')}</h2>
                    {error && <p className="error-text">{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicUsername" className="form-group">
                            <Form.Label>{t('username')}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={t('enter_username')}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword" className="form-group">
                            <Form.Label>{t('password')}</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder={t('enter_password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-4 w-100" style={{ backgroundColor: '#00BCD4', borderColor: '#00BCD4' }}>
                            {t('login')}
                        </Button>
                    </Form>
                </div>
            </Container>

            <footer className="footer">
                <small>
                    {t('built_by')} Khalfan | khalfan500@hotmail.com - 95787201
                </small>
            </footer>
        </div>
    );
}

export default LoginPage;
