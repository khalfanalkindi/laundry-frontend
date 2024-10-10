import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function CustomerModal({ show, onHide, onAddCustomer }) {
    const { t, i18n } = useTranslation();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [idCode, setIdCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCustomer = {
            name,
            phone,
            address,
            email,
            id_code: idCode,
        };
        onAddCustomer(newCustomer);
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{t('add_new_customer')}</Modal.Title>
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
                            style={{ 
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                fontFamily: i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit'
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="formCustomerPhone" className="mt-3">
                        <Form.Control
                            type="text"
                            placeholder={t('enter_customer_phone')}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            style={{ 
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                fontFamily: i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit'
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="formCustomerAddress" className="mt-3">
                        <Form.Control
                            type="text"
                            placeholder={t('enter_customer_address')}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{ 
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                fontFamily: i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit'
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="formCustomerEmail" className="mt-3">
                        <Form.Control
                            type="email"
                            placeholder={t('enter_customer_email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ 
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                fontFamily: i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit'
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="formCustomerIdCode" className="mt-3">
                        <Form.Control
                            type="text"
                            placeholder={t('enter_customer_id_code')}
                            value={idCode}
                            onChange={(e) => setIdCode(e.target.value)}
                            style={{ 
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                fontFamily: i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit'
                            }}
                        />
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="mt-3" 
                        style={{ 
                            backgroundColor: '#00BCD4', 
                            borderColor: '#00BCD4', 
                            borderRadius: '10px',
                            fontFamily: i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit'
                        }}
                    >
                        {t('add_customer')}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default CustomerModal;
