import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import api from './axiosConfig';
import ReceiptModal from './ReceiptModal';
import { FaEye, FaPrint, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function PickOrdersPage() {
    const { t, i18n } = useTranslation();
    const [bills, setBills] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [showBillModal, setShowBillModal] = useState(false);
    const [billDetails, setBillDetails] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [currentBillId, setCurrentBillId] = useState(null);
    const [alertMessage, setAlertMessage] = useState(localStorage.getItem('alertMessage') || null);
    const [alertVariant, setAlertVariant] = useState(localStorage.getItem('alertVariant') || null);

    useEffect(() => {
        api.get('/bills/')
            .then(response => {
                const notPickedBills = response.data.filter(bill => !bill.picked);
                setBills(notPickedBills);
                setFilteredBills(notPickedBills);
            })
            .catch(error => {
                console.error(t('error_fetching_bills'), error);
                setAlertMessage(t('error_fetching_bills'));
                setAlertVariant('danger');
            });
    }, [t]);

    const filterBills = (searchTerm) => {
        if (!searchTerm || searchTerm.trim() === '') {
            return bills; 
        }

        return bills.filter(bill => {
            const customerName = bill.customer_name?.toLowerCase() || '';
            const phone = bill.phone?.toLowerCase() || '';
            const idCode = bill.id_code?.toLowerCase() || '';

            return (
                customerName.includes(searchTerm.toLowerCase()) ||
                phone.includes(searchTerm.toLowerCase()) ||
                idCode.includes(searchTerm.toLowerCase())
            );
        });
    };

    const handleSearchChange = (event) => {
        const searchTerm = event.target.value;
        setSearchText(searchTerm);
        const filtered = filterBills(searchTerm);
        setFilteredBills(filtered);
    };

    const handleShowBillDetails = (bill) => {
        setBillDetails(bill);
        setShowBillModal(true);
    };

    const handlePickBill = (billId) => {
        const payload = {
            picked: true,
            paid: true,
            last_picked_date: new Date().toISOString(),
            last_paid_date: new Date().toISOString(),
        };

        api.patch(`/bills/${billId}/`, payload)
            .then(() => {
                // Show success message and reload page
                localStorage.setItem('alertMessage', t('order_picked_successfully'));
                localStorage.setItem('alertVariant', 'success');
                window.location.reload(); // Reload the page
            })
            .catch(error => {
                console.error(t('error_picking_order'), error);
                setAlertMessage(t('error_picking_order'));
                setAlertVariant('danger');
            });
    };

    const handlePrintSelectedBills = (billId) => {
        setCurrentBillId(billId);
        setShowReceiptModal(true);
    };

    const toggleRowDetails = (billId) => {
        if (expandedRows.includes(billId)) {
            setExpandedRows(expandedRows.filter(id => id !== billId));
        } else {
            setExpandedRows([...expandedRows, billId]);
        }
    };

    useEffect(() => {
        // Clear alert message after reload
        if (alertMessage) {
            setTimeout(() => {
                localStorage.removeItem('alertMessage');
                localStorage.removeItem('alertVariant');
                setAlertMessage(null);
            }, 3000); // Dismiss alert after 3 seconds
        }
    }, [alertMessage]);

    return (
        <Container style={{ marginTop: '20px', fontFamily: i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit', direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Alert Message */}
            {alertMessage && (
                <Alert variant={alertVariant} onClose={() => setAlertMessage(null)} dismissible>
                    {alertMessage}
                </Alert>
            )}

<div style={{ position: 'sticky', top: '0', zIndex: '1000', paddingBottom: '10px', paddingTop: '10px'}}>
    <Row className="mb-4 d-flex align-items-center">
        <Col md={8}>
            <h3>{t('pick_orders_title')}</h3> {/* Title added */}
        </Col>
        <Col md={4} className="d-flex justify-content-end">
            <Form.Control
                type="text"
                placeholder={`${t('search_by_customer_phone_id')} 🔍`}  // Translate this text with search icon
                value={searchText}
                onChange={handleSearchChange}
                style={{
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderColor: '#ccc',
                    paddingRight: '30px'  // Adjust padding for the icon
                }}
            />
        </Col>
    </Row>
</div>

            <Row>
                <Col>
                    <Table hover responsive style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
                        <thead style={{ backgroundColor: '#00BCD4', color: '#fff', textAlign: 'center' }}>
                            <tr>
                                <th>{t('customer')}</th>
                                <th>{t('phone')}</th>
                                <th>{t('id_code')}</th>
                                <th>{t('price')}</th>
                                <th>{t('discount')}</th>
                                <th>{t('actions')}</th>
                                <th>{t('pick_order')}</th> {/* New column */}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBills.length > 0 ? (
                                filteredBills.map((bill, index) => (
                                    <React.Fragment key={bill.id}>
                                        <tr
                                            onClick={() => toggleRowDetails(bill.id)}
                                            style={{ backgroundColor: index % 2 === 0 ? '#F7F7F7' : '#E0E0E0', textAlign: 'center', cursor: 'pointer' }}
                                        >
                                            <td>{bill.customer_name || t('no_name')}</td>
                                            <td>{bill.phone}</td>
                                            <td>{bill.id_code}</td>
                                            <td>{Number(bill.price).toFixed(3)} OMR</td>
                                            <td>{Number(bill.discount_rate).toFixed(0)}%</td>
                                            <td className="text-center">
                                                <Button
                                                    variant="link"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row click event
                                                        handleShowBillDetails(bill);
                                                    }}
                                                    style={{ color: '#00BCD4' }} // Assign color
                                                >
                                                    <FaEye />
                                                </Button>
                                                {' '}
                                                <Button
                                                    variant="link"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row click event
                                                        handlePrintSelectedBills(bill.id);
                                                    }}
                                                    style={{ color: '#4fb0c6' }} // Assign color
                                                >
                                                    <FaPrint />
                                                </Button>
                                            </td>
                                            <td className="text-center">
                                                <Button
                                                    variant="link"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row click event
                                                        handlePickBill(bill.id);
                                                    }}
                                                    style={{ color: '#28a745' }} // Green color
                                                >
                                                    <FaCheckCircle />
                                                </Button>
                                            </td>
                                        </tr>
                                        {expandedRows.includes(bill.id) && bill.cart_items && bill.cart_items.length > 0 && (
                                            <tr style={{ backgroundColor: '#F1F1F1' }}>
                                                <td colSpan="7">
                                                    <Table bordered style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                                        <thead style={{ backgroundColor: '#00BCD4', color: '#fff', textAlign: 'center' }}>
                                                            <tr>
                                                                <th>{t('service')}</th>
                                                                <th>{t('quantity')}</th>
                                                                <th>{t('price')}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {bill.cart_items.map(item => (
                                                                <tr key={item.id}>
                                                                    <td>{item.ent_srv_name}</td>
                                                                    <td>{item.quantity}</td>
                                                                    <td>{item.price} OMR</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">{t('no_items_found')}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Bill Details Modal */}
            <Modal show={showBillModal} onHide={() => setShowBillModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('bill_details')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {billDetails && (
                        <div>
                            <p><strong>{t('bill_id')}:</strong> {billDetails.id}</p> {/* Display Bill ID */}
                            <p><strong>{t('customer')}:</strong> {billDetails.customer_name || t('no_name')}</p>
                            <p><strong>{t('phone')}:</strong> {billDetails.phone}</p>
                            <p><strong>{t('id_code')}:</strong> {billDetails.id_code}</p>
                            <p><strong>{t('price')}:</strong> {Number(billDetails.price).toFixed(3)} OMR</p>
                            <p><strong>{t('discount')}:</strong> {billDetails.discount ? `${Number(billDetails.discount_rate).toFixed(0)}%` : t('no_discount')}</p>

                            <h5>{t('items')}:</h5>
                            <ul>
                                {billDetails.cart_items && billDetails.cart_items.length > 0 ? (
                                    billDetails.cart_items.map(item => (
                                        <li key={item.id}>
                                            {item.ent_srv_name} - {item.quantity} x {item.price} OMR
                                        </li>
                                    ))
                                ) : (
                                    <li>{t('no_items_found')}</li>
                                )}
                            </ul>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="primary" 
                        onClick={() => window.print()}
                        style={{ 
                            backgroundColor: '#00BCD4', 
                            borderColor: '#00BCD4',
                            borderRadius: '10px'
                        }}
                    >
                        {t('print')}
                    </Button>
                    <Button 
                        variant="secondary" 
                        onClick={() => setShowBillModal(false)}
                        style={{ 
                            borderRadius: '10px'
                        }}
                    >
                        {t('close')}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Receipt Modal */}
            <ReceiptModal 
                show={showReceiptModal} 
                onHide={() => setShowReceiptModal(false)} 
                billId={currentBillId} 
            />
        </Container>
    );
}

export default PickOrdersPage;
