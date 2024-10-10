import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from './axiosConfig';
import { useTranslation } from 'react-i18next';

function ProfilePage() {
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        address: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [alertMessage, setAlertMessage] = useState(null);
    const [alertVariant, setAlertVariant] = useState(null);

    const navigate = useNavigate(); 

    useEffect(() => {
        // Fetch the profile of the currently authenticated user
        api.get('/users/me/')
            .then(response => {
                const user = response.data;
                setFormData(user);
            })
            .catch(error => {
                console.error(t('error_fetching_profile'), error);
                setAlertMessage(t('error_fetching_profile'));
                setAlertVariant('danger');
            });
    }, [t]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (passwordData.newPassword && passwordData.newPassword !== passwordData.confirmNewPassword) {
            setAlertMessage(t('new_passwords_do_not_match'));
            setAlertVariant('danger');
            return;
        }

        // Update profile
        api.put(`/users/${formData.id}/`, formData)
            .then(() => {
                setAlertMessage(t('profile_updated_successfully'));
                setAlertVariant('success');
            })
            .catch(error => {
                console.error(t('error_updating_profile'), error);
                setAlertMessage(t('error_updating_profile'));
                setAlertVariant('danger');
            });

        if (passwordData.currentPassword && passwordData.newPassword) {
            api.post(`/users/change-password/`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            })
                .then(() => {
                    setAlertMessage(t('password_changed_successfully'));
                    setAlertVariant('success');
                    setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmNewPassword: '',
                    });
                })
                .catch(error => {
                    console.error(t('error_changing_password'), error);
                    setAlertMessage(t('failed_to_change_password'));
                    setAlertVariant('danger');
                });
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <Container style={{ marginTop: '20px', fontFamily: i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit' }}>
            <h2>{t('profile')}</h2>

            {/* Alert Message */}
            {alertMessage && (
                <Alert variant={alertVariant} onClose={() => setAlertMessage(null)} dismissible>
                    {alertMessage}
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>{t('username')}</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                readOnly
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>{t('email')}</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col md={6}>
                        <Form.Group controlId="formFirstName">
                            <Form.Label>{t('first_name')}</Form.Label>
                            <Form.Control
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formLastName">
                            <Form.Label>{t('last_name')}</Form.Label>
                            <Form.Control
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col md={6}>
                        <Form.Group controlId="formPhoneNumber">
                            <Form.Label>{t('phone_number')}</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formAddress">
                            <Form.Label>{t('address')}</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <h4 className="mt-4">{t('change_password')}</h4>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="formCurrentPassword">
                            <Form.Label>{t('current_password')}</Form.Label>
                            <Form.Control
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col md={6}>
                        <Form.Group controlId="formNewPassword">
                            <Form.Label>{t('new_password')}</Form.Label>
                            <Form.Control
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formConfirmNewPassword">
                            <Form.Label>{t('confirm_new_password')}</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmNewPassword"
                                value={passwordData.confirmNewPassword}
                                onChange={handlePasswordChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" type="submit" className="mt-4" style={{ backgroundColor: '#00BCD4', borderColor: '#00BCD4' }}>
                    {t('update_profile')}
                </Button>
                <Button variant="secondary" onClick={handleCancel} className="mt-4 ml-3">
                    {t('cancel')}
                </Button>
            </Form>
        </Container>
    );
}

export default ProfilePage;
