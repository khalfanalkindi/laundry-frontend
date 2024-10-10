import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, FormControl } from 'react-bootstrap';
import api from './axiosConfig';

function ServiceSelection({ onAddToCart }) {
    const [services, setServices] = useState([]);
    const [entities, setEntities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch services
        api.get('/entities-services-mapping/')
            .then(response => setServices(response.data))
            .catch(error => console.error('Error fetching services:', error));

        // Fetch entities (to get images)
        api.get('/entities/')
            .then(response => setEntities(response.data))
            .catch(error => console.error('Error fetching entities:', error));
    }, []);

    const getEntityImage = (entityId) => {
        const entity = entities.find(e => e.id === entityId);
        return entity?.entity_image || "https://via.placeholder.com/150";
    };

    const filteredServices = services.filter(service =>
        service.entity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.service_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container>
            {/* Search bar */}
            <FormControl
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
            />
            <Row>
                {filteredServices.map((service, idx) => (
                    <Col md={3} key={idx} className="mb-4">
                        <Card
                            onClick={() => onAddToCart(service)}
                            style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                        >
                            <div style={{ width: '100%', height: '150px', overflow: 'hidden' }}>
                                <Card.Img
                                    variant="top"
                                    src={getEntityImage(service.entity)}
                                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '15px 15px 0 0' }}
                                />
                            </div>
                            <Card.Body>
                                <Card.Title style={{ fontSize: '14px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                    {service.entity_name} - {service.service_name}
                                    <span>{service.price} OMR</span>
                                </Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default ServiceSelection;
