import React, { useState, useEffect } from 'react';
import api from './axiosConfig';
import { Table, Button, Container, Row, Col, Modal, Form, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function ServicesPage() {
    const { t, i18n } = useTranslation();  // Importing useTranslation hook
    const [services, setServices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [name, setName] = useState('');
    const [nameAr, setNameAr] = useState(''); // Arabic name
    const [remarks, setRemarks] = useState('');
    const [remarksAr, setRemarksAr] = useState(''); // Arabic remarks
    const [searchText, setSearchText] = useState('');
    const [alertMessage, setAlertMessage] = useState(null); // Alert state
    const [alertVariant, setAlertVariant] = useState(null); // Alert variant (success, danger, etc.)

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = () => {
        api.get('/services/')
            .then(response => {
                setServices(response.data);
            })
            .catch(error => {
                console.error(t('error_fetching_services'), error);
            });
    };

    const handleShowModal = (service = null) => {
        setCurrentService(service);
        if (service) {
            setName(service.name);
            setNameAr(service.name_ar); // Set Arabic name
            setRemarks(service.remarks);
            setRemarksAr(service.remarks_ar); // Set Arabic remarks
        } else {
            setName('');
            setNameAr(''); // Reset Arabic name
            setRemarks('');
            setRemarksAr(''); // Reset Arabic remarks
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const serviceData = {
            name,
            name_ar: nameAr, // Include Arabic name
            remarks,
            remarks_ar: remarksAr, // Include Arabic remarks
        };

        if (currentService) {
            api.put(`/services/${currentService.id}/`, serviceData)
                .then(() => {
                    fetchServices();
                    setAlertMessage(t('service_updated_successfully'));
                    setAlertVariant('success');
                    handleCloseModal();
                })
                .catch(error => {
                    console.error(t('error_updating_service'), error);
                    setAlertMessage(t('error_updating_service'));
                    setAlertVariant('danger');
                });
        } else {
            api.post('/services/', serviceData)
                .then(() => {
                    fetchServices();
                    setAlertMessage(t('service_added_successfully'));
                    setAlertVariant('success');
                    handleCloseModal();
                })
                .catch(error => {
                    console.error(t('error_creating_service'), error);
                    setAlertMessage(t('error_creating_service'));
                    setAlertVariant('danger');
                });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm(t('confirm_delete_service'))) {
            api.delete(`/services/${id}/`)
                .then(() => {
                    fetchServices();
                    setAlertMessage(t('service_deleted_successfully'));
                    setAlertVariant('success');
                })
                .catch(error => {
                    console.error(t('error_deleting_service'), error);
                    setAlertMessage(t('error_deleting_service'));
                    setAlertVariant('danger');
                });
        }
    };

    const handleSearchChange = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchText(searchTerm);

        const filteredServices = services.filter(service =>
            service.name.toLowerCase().includes(searchTerm) ||
            service.name_ar?.toLowerCase().includes(searchTerm) ||  // Search in Arabic name
            service.remarks.toLowerCase().includes(searchTerm) ||
            service.remarks_ar?.toLowerCase().includes(searchTerm)  // Search in Arabic remarks
        );

        setServices(filteredServices);
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
                        placeholder={t('search_services')}
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
                        {t('add_service')}
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
                                <th>{t('name_arabic')}</th> {/* Add Arabic name column */}
                                <th>{t('remarks')}</th>
                                <th>{t('remarks_arabic')}</th> {/* Add Arabic remarks column */}
                                <th>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.length > 0 ? (
                                services.map((service, index) => (
                                    <tr key={service.id} style={{ backgroundColor: index % 2 === 0 ? '#F7F7F7' : '#E0E0E0', textAlign: 'center' }}>
                                        <td>{service.id}</td>
                                        <td>{service.name}</td>
                                        <td>{service.name_ar}</td> {/* Display Arabic name */}
                                        <td>{service.remarks}</td>
                                        <td>{service.remarks_ar}</td> {/* Display Arabic remarks */}
                                        <td className="text-center">
                                            <Button
                                                variant="warning"
                                                onClick={() => handleShowModal(service)}
                                                style={{
                                                    borderRadius: '10px',
                                                    marginRight: '10px'
                                                }}
                                            >
                                                {t('edit')}
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDelete(service.id)}
                                                style={{
                                                    borderRadius: '10px'
                                                }}
                                            >
                                                {t('delete')}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">{t('no_services_found')}</td> {/* Update colspan */}
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Modal for Add/Edit Service */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentService ? t('edit_service') : t('add_service')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formServiceName">
                            <Form.Control
                                type="text"
                                placeholder={t('enter_service_name')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formServiceNameAr" className="mt-3">
                            <Form.Control
                                type="text"
                                placeholder={t('enter_service_name_arabic')}
                                value={nameAr}
                                onChange={(e) => setNameAr(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formServiceRemarks" className="mt-3">
                            <Form.Control
                                type="text"
                                placeholder={t('enter_remarks')}
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formServiceRemarksAr" className="mt-3">
                            <Form.Control
                                type="text"
                                placeholder={t('enter_remarks_arabic')}
                                value={remarksAr}
                                onChange={(e) => setRemarksAr(e.target.value)}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="mt-4"
                            style={{
                                backgroundColor: '#00BCD4',
                                borderColor: '#00BCD4',
                                borderRadius: '10px'
                            }}
                        >
                            {currentService ? t('update_service') : t('add_service')}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default ServicesPage;
