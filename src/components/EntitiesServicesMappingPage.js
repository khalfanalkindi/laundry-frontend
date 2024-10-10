import React, { useState, useEffect } from 'react';
import api from './axiosConfig';
import { Container, Row, Col, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function EntitiesServicesMappingPage() {
    const { t, i18n } = useTranslation();  // Importing useTranslation hook
    const [entities, setEntities] = useState([]);
    const [services, setServices] = useState([]);
    const [mappings, setMappings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
    const [currentMapping, setCurrentMapping] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertVariant, setAlertVariant] = useState(null);

    useEffect(() => {
        fetchEntities();
        fetchServices();
        fetchMappings();
    }, []);

    const fetchEntities = () => {
        api.get('/entities/')
            .then(response => setEntities(response.data))
            .catch(error => console.error(t('error_fetching_entities'), error));
    };

    const fetchServices = () => {
        api.get('/services/')
            .then(response => setServices(response.data))
            .catch(error => console.error(t('error_fetching_services'), error));
    };

    const fetchMappings = () => {
        api.get('/entities-services-mapping/')
            .then(response => setMappings(response.data))
            .catch(error => console.error(t('error_fetching_mappings'), error));
    };

    const handleShowModal = (mapping = null) => {
        if (mapping) {
            setSelectedEntity(mapping.entity);
            setSelectedService(mapping.service);
            setDuration(mapping.duration);
            setPrice(mapping.price);
            setCurrentMapping(mapping);
        } else {
            setSelectedEntity('');
            setSelectedService('');
            setDuration('');
            setPrice('');
            setCurrentMapping(null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = {
            entity: selectedEntity,
            service: selectedService,
            duration: duration,
            price: price,
        };

        if (currentMapping) {
            api.put(`/entities-services-mapping/${currentMapping.id}/`, payload)
                .then(response => {
                    setMappings(mappings.map(mapping =>
                        mapping.id === currentMapping.id ? response.data : mapping
                    ));
                    setAlertMessage(t('mapping_updated_successfully'));
                    setAlertVariant('success');
                    handleCloseModal();
                })
                .catch(error => {
                    console.error(t('error_updating_mapping'), error);
                    setAlertMessage(t('error_updating_mapping'));
                    setAlertVariant('danger');
                });
        } else {
            api.post('/entities-services-mapping/', payload)
                .then(response => {
                    setMappings([...mappings, response.data]);
                    setAlertMessage(t('mapping_added_successfully'));
                    setAlertVariant('success');
                    handleCloseModal();
                })
                .catch(error => {
                    console.error(t('error_creating_mapping'), error);
                    setAlertMessage(t('error_creating_mapping'));
                    setAlertVariant('danger');
                });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm(t('confirm_delete_mapping'))) {
            api.delete(`/entities-services-mapping/${id}/`)
                .then(() => {
                    setMappings(mappings.filter(mapping => mapping.id !== id));
                    setAlertMessage(t('mapping_deleted_successfully'));
                    setAlertVariant('success');
                })
                .catch(error => {
                    console.error(t('error_deleting_mapping'), error);
                    setAlertMessage(t('error_deleting_mapping'));
                    setAlertVariant('danger');
                });
        }
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
                        placeholder={t('search_by_entity_or_service')}
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
                        {t('add_mapping')}
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table hover responsive style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
                        <thead style={{ backgroundColor: '#00BCD4', color: '#fff', textAlign: 'center' }}>
                            <tr>
                                <th>{t('id')}</th>
                                <th>{t('entity')}</th>
                                <th>{t('service')}</th>
                                <th>{t('duration')}</th>
                                <th>{t('price')}</th>
                                <th>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mappings.length > 0 ? (
                                mappings.map((mapping, index) => (
                                    <tr key={mapping.id} style={{ backgroundColor: index % 2 === 0 ? '#F7F7F7' : '#E0E0E0', textAlign: 'center' }}>
                                        <td>{mapping.id}</td>
                                        <td>{i18n.language === 'ar' ? mapping.entity_name_ar : mapping.entity_name}</td>
                                        <td>{i18n.language === 'ar' ? mapping.service_name_ar : mapping.service_name}</td>
                                        <td>{mapping.duration}</td>
                                        <td>{mapping.price}</td>
                                        <td className="text-center">
                                            <Button
                                                variant="warning"
                                                onClick={() => handleShowModal(mapping)}
                                                style={{
                                                    borderRadius: '10px',
                                                    marginRight: '10px'
                                                }}
                                            >
                                                {t('edit')}
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDelete(mapping.id)}
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
                                    <td colSpan="6" className="text-center">{t('no_mappings_found')}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Modal for Add/Edit Mapping */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentMapping ? t('edit_mapping') : t('add_mapping')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formEntitySelect">
                            <Form.Control
                                as="select"
                                value={selectedEntity}
                                onChange={(e) => setSelectedEntity(e.target.value)}
                                required
                                style={{
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    borderColor: '#ccc'
                                }}
                            >
                                <option value="">{t('select_entity')}</option>
                                {entities.map(entity => (
                                    <option key={entity.id} value={entity.id}>
                                        {i18n.language === 'ar' ? entity.name_ar : entity.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formServiceSelect" className="mt-3">
                            <Form.Control
                                as="select"
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                required
                                style={{
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    borderColor: '#ccc'
                                }}
                            >
                                <option value="">{t('select_service')}</option>
                                {services.map(service => (
                                    <option key={service.id} value={service.id}>
                                        {i18n.language === 'ar' ? service.name_ar : service.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formDuration" className="mt-3">
                            <Form.Control
                                type="number"
                                placeholder={t('enter_duration')}
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                                style={{
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    borderColor: '#ccc'
                                }}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPrice" className="mt-3">
                            <Form.Control
                                type="number"
                                placeholder={t('enter_price')}
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                style={{
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    borderColor: '#ccc'
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
                                borderRadius: '10px'
                            }}
                        >
                            {currentMapping ? t('update_mapping') : t('add_mapping')}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default EntitiesServicesMappingPage;
