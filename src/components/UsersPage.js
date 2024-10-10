import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import api from './axiosConfig';
import { useTranslation } from 'react-i18next';

function UsersPage() {
    const { t, i18n } = useTranslation(); // Importing translation hook
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        address: '',
        role: '',
        password: '',
        confirmPassword: '',
        is_active: true,
        is_staff: false,
    });
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertVariant, setAlertVariant] = useState(null);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    // Fetch users and filter out those with the 'superadmin' role
    const fetchUsers = () => {
        api.get('/users/')
            .then(response => {
                const filteredUsers = response.data.filter(user => user.role?.role_name !== 'superadmin');
                setUsers(filteredUsers);
            })
            .catch(error => console.error(t('error_fetching_users'), error));
    };

    const fetchRoles = () => {
        api.get('/roles/')
            .then(response => setRoles(response.data))
            .catch(error => console.error(t('error_fetching_roles'), error));
    };

    const handleShowModal = (user = null) => {
        setCurrentUser(user);
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number,
                address: user.address,
                role: user.role?.id || '',
                password: '',
                confirmPassword: '',
                is_active: user.is_active,
                is_staff: user.is_staff || false,
            });
        } else {
            setFormData({
                username: '',
                email: '',
                first_name: '',
                last_name: '',
                phone_number: '',
                address: '',
                role: '',
                password: '',
                confirmPassword: '',
                is_active: true,
                is_staff: false,
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSaveUser = () => {
        const { confirmPassword, password, role, ...userData } = formData;

        const isNewUser = !currentUser;

        if (isNewUser && (!formData.username || !formData.password || !formData.role)) {
            setAlertMessage(t('username_password_role_required'));
            setAlertVariant('danger');
            return;
        }

        if (formData.password && formData.password !== confirmPassword) {
            setAlertMessage(t('passwords_do_not_match'));
            setAlertVariant('danger');
            return;
        }

        const formattedData = {
            ...userData,
            is_active: formData.is_active ? true : false,
            is_staff: formData.is_staff ? true : false,
            role_id: formData.role, // Send role as an ID
        };

        if (!isNewUser && !formData.password) {
            delete formattedData.password; // Remove password if not changing
        }

        const apiCall = isNewUser
            ? api.post('/users/', formattedData) // Create new user
            : api.put(`/users/${currentUser.id}/`, formattedData); // Update existing user

        apiCall
            .then(() => {
                fetchUsers();
                setAlertMessage(isNewUser ? t('user_added_successfully') : t('user_updated_successfully'));
                setAlertVariant('success');
                setShowModal(false);
            })
            .catch(error => {
                console.error(t('error_saving_user'), error.response?.data); 
                setAlertMessage(t('error_saving_user') + ': ' + JSON.stringify(error.response?.data));
                setAlertVariant('danger');
            });
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm(t('confirm_delete_user'))) {
            api.delete(`/users/${userId}/`)
                .then(() => {
                    fetchUsers();
                    setAlertMessage(t('user_deleted_successfully'));
                    setAlertVariant('success');
                })
                .catch(error => {
                    console.error(t('error_deleting_user'), error);
                    setAlertMessage(t('error_deleting_user'));
                    setAlertVariant('danger');
                });
        }
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const isNewUser = !currentUser;

    return (
        <Container style={{ marginTop: '20px', fontFamily: i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit' }}>
            {/* Alert Message */}
            {alertMessage && (
                <Alert variant={alertVariant} onClose={() => setAlertMessage(null)} dismissible>
                    {alertMessage}
                </Alert>
            )}

            <Row className="mb-4">
                <Col>
                    <h2>{t('user_management')}</h2>
                </Col>
                <Col className="text-right">
                    <Button
                        variant="primary"
                        onClick={() => handleShowModal()}
                        style={{
                            backgroundColor: '#00BCD4',
                            borderColor: '#00BCD4',
                            borderRadius: '10px',
                        }}
                    >
                        {t('add_user')}
                    </Button>
                </Col>
            </Row>
            <Table hover responsive style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
                <thead style={{ backgroundColor: '#00BCD4', color: '#fff', textAlign: 'center' }}>
                    <tr>
                        <th>{t('username')}</th>
                        <th>{t('email')}</th>
                        <th>{t('first_name')}</th>
                        <th>{t('last_name')}</th>
                        <th>{t('role')}</th>
                        <th>{t('active')}</th>
                        <th>{t('staff')}</th>
                        <th>{t('actions')}</th>
                    </tr>
                </thead>
                <tbody style={{ textAlign: 'center' }}>
                    {users.length > 0 ? (
                        users.map(user => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.role?.role_name || t('no_role')}</td>
                                <td>{user.is_active ? t('yes') : t('no')}</td>
                                <td>{user.is_staff ? t('yes') : t('no')}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleShowModal(user)} style={{ marginRight: '10px' }}>
                                        {t('edit')}
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>
                                        {t('delete')}
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">{t('no_users_found')}</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal for Add/Edit User */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentUser ? t('edit_user') : t('add_user')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formUsername">
                            <Form.Label>{t('username')} <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>{t('email')}</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formFirstName" className="mt-3">
                            <Form.Label>{t('first_name')}</Form.Label>
                            <Form.Control
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formLastName" className="mt-3">
                            <Form.Label>{t('last_name')}</Form.Label>
                            <Form.Control
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhoneNumber" className="mt-3">
                            <Form.Label>{t('phone_number')}</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddress" className="mt-3">
                            <Form.Label>{t('address')}</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formRole" className="mt-3">
                            <Form.Label>{t('role')} <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                as="select"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="">{t('select_role')}</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.role_name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formPassword" className="mt-3">
                            <Form.Label>{t('password')} {isNewUser && <span className="text-danger">*</span>}</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={isNewUser ? t('enter_password') : t('leave_blank_to_keep_same')}
                            />
                        </Form.Group>
                        <Form.Group controlId="formConfirmPassword" className="mt-3">
                            <Form.Label>{t('confirm_password')} {isNewUser && <span className="text-danger">*</span>}</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder={isNewUser ? t('confirm_password') : t('leave_blank_to_keep_same')}
                            />
                        </Form.Group>
                        <Form.Group controlId="formIsActive" className="mt-3">
                            <Form.Check
                                type="checkbox"
                                label={t('is_active')}
                                name="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formIsStaff" className="mt-3">
                            <Form.Check
                                type="checkbox"
                                label={t('is_staff')}
                                name="is_staff"
                                checked={formData.is_staff}
                                onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        {t('close')}
                    </Button>
                    <Button variant="primary" onClick={handleSaveUser} style={{ backgroundColor: '#00BCD4', borderColor: '#00BCD4' }}>
                        {currentUser ? t('update') : t('save')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default UsersPage;
