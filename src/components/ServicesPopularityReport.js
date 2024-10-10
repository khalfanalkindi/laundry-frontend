import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import api from './axiosConfig';
import { useTranslation } from 'react-i18next';

function ServicesPopularityReport() {
    const { t, i18n } = useTranslation();  // Importing useTranslation hook
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reportData, setReportData] = useState([]);

    const fetchReportData = () => {
        api.get(`/reports/services-popularity/`, { params: { from: fromDate, to: toDate } })
            .then(response => setReportData(response.data))
            .catch(error => console.error(t('error_fetching_report_data'), error));
    };

    return (
        <Container style={{ fontFamily: i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit' }}>
            <Row className="mb-4">
                <Col md={4}>
                    <Form.Group as={Row} className="align-items-center">
                        <Form.Label column sm={3}>{t('from')}</Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                style={{
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    borderColor: '#ccc',
                                }}
                            />
                        </Col>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group as={Row} className="align-items-center">
                        <Form.Label column sm={3}>{t('to')}</Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                style={{
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    borderColor: '#ccc',
                                }}
                            />
                        </Col>
                    </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-center">
                    <Button
                        onClick={fetchReportData}
                        style={{
                            backgroundColor: '#00BCD4',
                            borderColor: '#00BCD4',
                            borderRadius: '10px',
                            width: '100%',
                        }}
                    >
                        {t('generate_report')}
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table hover responsive style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
                        <thead style={{ backgroundColor: '#00BCD4', color: '#fff', textAlign: 'center' }}>
                            <tr>
                                <th>{t('service')}</th>
                                <th>{t('times_ordered')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.length > 0 ? (
                                reportData.map((item, index) => (
                                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#F7F7F7' : '#E0E0E0', textAlign: 'center' }}>
                                        <td>{item.service_name}</td>
                                        <td>{item.times_ordered}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center">{t('no_data_available')}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default ServicesPopularityReport;
