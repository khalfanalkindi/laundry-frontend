import React, { useState, useEffect } from 'react';
import api from './axiosConfig';
import { Table, Button, Container, Row, Col, Modal, Form, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function EntitiesPage() {
    const { t, i18n } = useTranslation();  // Importing useTranslation hook
    const [entities, setEntities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentEntity, setCurrentEntity] = useState(null);
    const [name, setName] = useState('');
    const [nameAr, setNameAr] = useState(''); // Arabic name
    const [type, setType] = useState('');
    const [image, setImage] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [alertMessage, setAlertMessage] = useState(null); // Alert state
    const [alertVariant, setAlertVariant] = useState(null); // Alert variant (success, danger, etc.)

    useEffect(() => {
        fetchEntities();
    }, []);

    const fetchEntities = () => {
        api.get('/entities/')
            .then(response => {
                setEntities(response.data);
            })
            .catch(error => {
                console.error(t('error_fetching_entities'), error);
            });
    };

    const handleShowModal = (entity = null) => {
        setCurrentEntity(entity);
        if (entity) {
            setName(entity.name);
            setNameAr(entity.name_ar); // Set Arabic name
            setType(entity.type);
            setImage(null); // Reset image state for editing
        } else {
            setName('');
            setNameAr(''); // Reset Arabic name
            setType('');
            setImage(null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('name_ar', nameAr); // Append Arabic name
        formData.append('type', type || '');
        if (image) {
            formData.append('entity_image', image);
        }

        const apiCall = currentEntity
            ? api.put(`/entities/${currentEntity.id}/`, formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
              })
            : api.post('/entities/', formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
              });

        apiCall
            .then(() => {
                fetchEntities();
                setAlertMessage(currentEntity ? t('entity_updated_successfully') : t('entity_added_successfully'));
                setAlertVariant('success');
                handleCloseModal(); // Close the modal after successful submission
            })
            .catch(error => {
                console.error(t('error_saving_entity'), error);
                setAlertMessage(t('error_saving_entity'));
                setAlertVariant('danger');
            });
    };

    const handleDelete = (id) => {
        if (window.confirm(t('confirm_delete_entity'))) {
            api.delete(`/entities/${id}/`)
                .then(() => {
                    fetchEntities();
                    setAlertMessage(t('entity_deleted_successfully'));
                    setAlertVariant('success');
                })
                .catch(error => {
                    console.error(t('error_deleting_entity'), error);
                    setAlertMessage(t('error_deleting_entity'));
                    setAlertVariant('danger');
                });
        }
    };

    const handleSearchChange = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchText(searchTerm);

        const filteredEntities = entities.filter(entity =>
            entity.name.toLowerCase().includes(searchTerm) ||
            entity.name_ar?.toLowerCase().includes(searchTerm) ||  // Search in Arabic name
            entity.type.toLowerCase().includes(searchTerm)
        );

        setEntities(filteredEntities);
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
                        placeholder={t('search_entities')}
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
                        {t('add_entity')}
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
                                <th>{t('type')}</th>
                                <th>{t('image')}</th>
                                <th>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entities.length > 0 ? (
                                entities.map((entity, index) => (
                                    <tr key={entity.id} style={{ backgroundColor: index % 2 === 0 ? '#F7F7F7' : '#E0E0E0', textAlign: 'center' }}>
                                        <td>{entity.id}</td>
                                        <td>{entity.name}</td>
                                        <td>{entity.name_ar}</td> {/* Display Arabic name */}
                                        <td>{entity.type}</td>
                                        <td>
                                            {entity.entity_image ? (
                                                <img
                                                    src={entity.entity_image}
                                                    alt={entity.name}
                                                    style={{ width: '100px', height: 'auto', borderRadius: '10px' }}
                                                />
                                            ) : (
                                                t('no_image')
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                variant="warning"
                                                onClick={() => handleShowModal(entity)}
                                                style={{
                                                    borderRadius: '10px',
                                                    marginRight: '10px'
                                                }}
                                            >
                                                {t('edit')}
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDelete(entity.id)}
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
                                    <td colSpan="6" className="text-center">{t('no_entities_found')}</td> {/* Update colspan */}
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Modal for Add/Edit Entity */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentEntity ? t('edit_entity') : t('add_entity')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formEntityName">
                            <Form.Control
                                type="text"
                                placeholder={t('enter_entity_name')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEntityNameAr" className="mt-3">
                            <Form.Control
                                type="text"
                                placeholder={t('enter_entity_name_arabic')}
                                value={nameAr}
                                onChange={(e) => setNameAr(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEntityType" className="mt-3">
                            <Form.Control
                                type="text"
                                placeholder={t('enter_entity_type')}
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEntityImage" className="mt-3">
                            <Form.Control
                                type="file"
                                onChange={handleImageChange}
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
                            {currentEntity ? t('update_entity') : t('add_entity')}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default EntitiesPage;
