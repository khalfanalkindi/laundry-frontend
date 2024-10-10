import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';
import api from './axiosConfig';
import { useTranslation } from 'react-i18next';

function TotalIncomeReport() {
    const { t, i18n } = useTranslation();  // Importing useTranslation hook
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null);

    const fetchReportData = () => {
        const params = {};
    
        if (fromDate && toDate) {
            params.from = fromDate;
            params.to = toDate;  // Add date range if both are provided
        }

        // Call the API with the constructed query params
        api.get(`/reports/income-by-days/`, { params })
            .then(response => {
                setReportData(response.data);
                setAlertMessage(null);  // Clear any previous alerts
            })
            .catch(error => {
                console.error('Error fetching report data:', error);
                setAlertMessage(t('error_fetching_report_data'));
            });
    };

    return (
        <Container style={{ fontFamily: i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit' }}>
            <Row className="mb-4">
                <Col md={3}>
                    <Form.Group as={Row} className="align-items-center">
                        <Form.Label column sm={4}>{t('from')}</Form.Label>
                        <Col sm={8}>
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
                <Col md={3}>
                    <Form.Group as={Row} className="align-items-center">
                        <Form.Label column sm={4}>{t('to')}</Form.Label>
                        <Col sm={8}>
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
                <Col md={3}>
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
            {alertMessage && <Alert variant="danger" className="mt-4">{alertMessage}</Alert>}
            <Row className="mt-4">
                <Col>
                    <Table hover responsive style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
                        <thead style={{ backgroundColor: '#00BCD4', color: '#fff', textAlign: 'center' }}>
                            <tr>
                                <th>{t('last_picked_date')}</th>
                                <th>{t('total_income')} (OMR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.length > 0 ? (
                                reportData.map((bill, index) => (
                                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#F7F7F7' : '#E0E0E0', textAlign: 'center' }}>
                                        <td>{bill.last_picked_date}</td>
                                        <td>{Number(bill.total_income).toFixed(3)}</td>
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

export default TotalIncomeReport;
