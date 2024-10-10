import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import api from './axiosConfig';
import { useTranslation } from 'react-i18next';

function CustomersPage() {
    const { t, i18n } = useTranslation();  // Using translation
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [idCode, setIdCode] = useState('');
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [alertMessage, setAlertMessage] = useState(null); // Alert state
    const [alertVariant, setAlertVariant] = useState(null); // Alert variant (success, danger, etc.)

    useEffect(() => {
        api.get('/customers/')
            .then(response => {
                setCustomers(response.data);
                setFilteredCustomers(response.data);
            })
            .catch(error => {
                console.error('Error fetching customers:', error);
                setAlertMessage(t('error_fetching_customers'));
                setAlertVariant('danger');
            });
    }, [t]);

    const handleShowModal = (customer = null) => {
        if (customer) {
            setName(customer.name);
            setPhone(customer.phone);
            setAddress(customer.address);
            setEmail(customer.email);
            setIdCode(customer.id_code);
            setCurrentCustomer(customer);
        } else {
            setName('');
            setPhone('');
            setAddress('');
            setEmail('');
            setIdCode('');
            setCurrentCustomer(null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = {
            name: name,
            phone: phone,
            address: address,
            email: email,
            id_code: idCode,
        };

        if (currentCustomer) {
            api.put(`/customers/${currentCustomer.id}/`, payload)
                .then(response => {
                    setCustomers(customers.map(customer =>
                        customer.id === currentCustomer.id ? response.data : customer
                    ));
                    setFilteredCustomers(filteredCustomers.map(customer =>
                        customer.id === currentCustomer.id ? response.data : customer
                    ));
                    setAlertMessage(t('customer_updated_successfully'));
                    setAlertVariant('success');
                    handleCloseModal();
                })
                .catch(error => {
                    console.error('Error updating customer:', error);
                    setAlertMessage(t('error_updating_customer'));
                    setAlertVariant('danger');
                });
        } else {
            api.post('/customers/', payload)
                .then(response => {
                    setCustomers([...customers, response.data]);
                    setFilteredCustomers([...filteredCustomers, response.data]);
                    setAlertMessage(t('customer_added_successfully'));
                    setAlertVariant('success');
                    handleCloseModal();
                })
                .catch(error => {
                    console.error('Error creating customer:', error);
                    setAlertMessage(t('error_creating_customer'));
                    setAlertVariant('danger');
                });
        }
    };

    const handleDelete = (id) => {
        api.delete(`/customers/${id}/`)
            .then(() => {
                setCustomers(customers.filter(customer => customer.id !== id));
                setFilteredCustomers(filteredCustomers.filter(customer => customer.id !== id));
                setAlertMessage(t('customer_deleted_successfully'));
                setAlertVariant('success');
            })
            .catch(error => {
                console.error('Error deleting customer:', error);
                setAlertMessage(t('error_deleting_customer'));
                setAlertVariant('danger');
            });
    };

    const handleSearchChange = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchText(searchTerm);

        const filtered = customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm) ||
            customer.phone.toLowerCase().includes(searchTerm) ||
            customer.id_code.toLowerCase().includes(searchTerm)
        );

        setFilteredCustomers(filtered);
    };

    return (
        <Container style={{ marginTop: '20px', fontFamily: i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit' }}>
            {/* Alert Message */}
            {alertMessage && (
                <Alert variant={alertVariant} onClose={() => setAlertMessage(null)} dismissible>
                    {alertMessage}
                </Alert>
            )}

            <Row className="mb-4">
                <Col md={4}>
                    <Form.Control
                        type="text"
                        placeholder={t('search_customers')}
                        value={searchText}
                        onChange={handleSearchChange}
                        style={{
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            borderColor: '#ccc'
                        }}
                    />
                </Col>
                <Col md={8} className="text-right">
                    <Button
                        variant="primary"
                        onClick={() => handleShowModal()}
                        style={{
                            backgroundColor: '#00BCD4',
                            borderColor: '#00BCD4',
                            borderRadius: '10px',
                            marginRight: '10px'
                        }}
                    >
                        {t('add_customer')}
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table hover responsive style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
                        <thead style={{ backgroundColor: '#00BCD4', color: '#fff', textAlign: 'center' }}>
                            <tr>
                                <th>{t('id')}</th>
                                <th>{t('name')}</th>
                                <th>{t('phone')}</th>
                                <th>{t('address')}</th>
                                <th>{t('email')}</th>
                                <th>{t('id_code')}</th>
                                <th>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer, index) => (
                                <tr key={customer.id} style={{ backgroundColor: index % 2 === 0 ? '#F7F7F7' : '#E0E0E0', textAlign: 'center' }}>
                                    <td>{customer.id}</td>
                                    <td>{customer.name}</td>
                                    <td>{customer.phone}</td>
                                    <td>{customer.address}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.id_code}</td>
                                    <td className="text-center">
                                        <Button
                                            variant="warning"
                                            onClick={() => handleShowModal(customer)}
                                            style={{
                                                borderRadius: '10px',
                                                marginRight: '10px'
                                            }}
                                        >
                                            {t('edit')}
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(customer.id)}
                                            style={{
                                                borderRadius: '10px'
                                            }}
                                        >
                                            {t('delete')}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentCustomer ? t('edit_customer') : t('add_customer')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formCustomerName">
                            <Form.Control
                                type="text"
                                placeholder={t('enter_customer_name')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formCustomerPhone" className="mt-3">
                            <Form.Control
                                type="text"
                                placeholder={t('enter_customer_phone')}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formCustomerAddress" className="mt-3">
                            <Form.Control
                                type="text"
                                placeholder={t('enter_customer_address')}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formCustomerEmail" className="mt-3">
                            <Form.Control
                                type="email"
                                placeholder={t('enter_customer_email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formCustomerIdCode" className="mt-3">
                            <Form.Control
                                type="text"
                                placeholder={t('enter_customer_id_code')}
                                value={idCode}
                                onChange={(e) => setIdCode(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3" style={{ backgroundColor: '#00BCD4', borderColor: '#00BCD4', borderRadius: '10px' }}>
                            {currentCustomer ? t('update_customer') : t('add_customer')}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default CustomersPage;
