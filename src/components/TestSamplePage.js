import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import api from './axiosConfig';

function TestSamplePage() {
    const [billId, setBillId] = useState('');
    const [billData, setBillData] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('');

    const handleSearch = () => {
        if (!billId) {
            setAlertMessage('Please enter a valid Bill ID.');
            setAlertVariant('danger');
            return;
        }

        // Fetch bill data by ID
        api.get(`/bills/${billId}/`)
            .then(response => {
                setBillData(response.data);
                setAlertMessage('Bill data found.');
                setAlertVariant('success');
            })
            .catch(error => {
                console.error('Error fetching bill:', error);
                setAlertMessage('Bill not found.');
                setAlertVariant('danger');
            });
    };

    const handleUpdate = () => {
        if (!billData) {
            setAlertMessage('No bill data available for updating.');
            setAlertVariant('danger');
            return;
        }

        const payload = {
            picked: true,
            paid: true,
            last_picked_date: new Date().toISOString(),
            last_paid_date: new Date().toISOString(),
        };

        api.patch(`/bills/${billId}/`, payload)
            .then(() => {
                setAlertMessage('Bill updated successfully.');
                setAlertVariant('success');
            })
            .catch(error => {
                console.error('Error updating bill:', error);
                setAlertMessage('Failed to update the bill.');
                setAlertVariant('danger');
            });
    };

    return (
        <Container style={{ marginTop: '20px' }}>
            {/* Alert Message */}
            {alertMessage && (
                <Alert variant={alertVariant} onClose={() => setAlertMessage('')} dismissible>
                    {alertMessage}
                </Alert>
            )}

            <h2>Test Bill Update Page</h2>
            <Form.Group controlId="billIdInput" className="mb-3">
                <Form.Label>Enter Bill ID</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Bill ID"
                    value={billId}
                    onChange={(e) => setBillId(e.target.value)}
                />
            </Form.Group>

            <Button variant="primary" onClick={handleSearch}>
                Search Bill
            </Button>

            {billData && (
                <div style={{ marginTop: '20px' }}>
                    <h5>Bill Details:</h5>
                    <p><strong>Customer Name:</strong> {billData.customer_name || 'No Name'}</p>
                    <p><strong>Phone:</strong> {billData.phone}</p>
                    <p><strong>Price:</strong> {Number(billData.price).toFixed(3)} OMR</p>
                    <p><strong>Discount:</strong> {Number(billData.discount_rate).toFixed(0)}%</p>
                    <Button variant="success" onClick={handleUpdate}>
                        Update Bill (Picked & Paid)
                    </Button>
                </div>
            )}
        </Container>
    );
}

export default TestSamplePage;
