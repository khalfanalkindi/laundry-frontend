import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from './axiosConfig';
import logo from '../assets/images/thelogo.png'; // Import the logo

function ReceiptModal({ show, onHide, billId }) {
    const [billData, setBillData] = useState(null);
    const receiptRef = useRef(); // Reference to the receipt content

    useEffect(() => {
        if (billId) {
            api.get(`/bills/${billId}/`)
                .then(response => setBillData(response.data))
                .catch(error => console.error('Error fetching bill data:', error));
        }
    }, [billId]);

    const handlePrint = () => {
        const printContents = receiptRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Reload to reset the page after printing
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Receipt / إيصال</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div ref={receiptRef} style={{ width: '79mm', maxWidth: '79mm', margin: '0 auto', fontSize: '10px' }}>
                    {billData ? (
                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '5px' }}>
                                <img src={logo} alt="Logo" style={{ maxWidth: '50px', marginBottom: '3px' }} />
                                <h4 style={{ fontSize: '12px', margin: '0' }}>Alanaqa Laundry - مغسلة الأناقة</h4>
                            </div>
                            <p><strong>Bill ID:</strong> {billData.id} <strong>رقم الفاتورة:</strong></p>
                            <p><strong>Customer:</strong> {billData.customer_name} - {billData.phone} - {billData.id_code} <strong>: الاسم</strong></p>
                            <p>
                                <strong>Date:</strong> {billData.cart_items[0]?.added_date ? new Intl.DateTimeFormat('en-US', { 
                                day: 'numeric', 
                                month: 'numeric', 
                                year: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit', 
                                second: '2-digit' 
                            }).format(new Date(billData.cart_items[0]?.added_date)) : 'N/A'} <strong>التاريخ:</strong>
                            </p>
                            <hr />
                            <table style={{ width: '100%', textAlign: 'left', fontSize: '10px' }}>
                                <thead>
                                    <tr>
                                        <th>Item الخدمة</th>
                                        <th>Qty الكمية</th>
                                        <th style={{ textAlign: 'right' }}>Price السعر</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {billData.cart_items.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.ent_srv_name} - {item.ent_srv_name_ar}</td>
                                            <td>{item.quantity}</td>
                                            <td style={{ textAlign: 'right' }}>{Number(item.price).toFixed(2)} OMR</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <hr />
                            <p style={{ fontSize: '10px', margin: '3px 0' }}>
                                <strong>Total:</strong> {Number(billData.price).toFixed(3)} OMR <strong>المجموع:</strong>
                            </p>
                            <p style={{ fontSize: '10px', margin: '3px 0' }}>
                                <strong>Discount:</strong> {billData.discount_rate ? `${Number(billData.discount_rate).toFixed(2)}%` : 'None'} <strong>تخفيض:</strong>
                            </p>
                            <p style={{ fontSize: '10px', margin: '3px 0' }}>
                                <strong>Net Total:</strong> {(billData.price - billData.discount).toFixed(3)} OMR <strong>صافي المجموع:</strong>
                            </p>
                            <hr />
                            <p style={{ textAlign: 'center', fontSize: '10px' }}>Thank you! / شكرًا لك!</p>
                            <p style={{ fontSize: '9px', textAlign: 'center' }}>
                                Disclaimer: The laundry is not responsible for items after 30 days.
                                <br />
                                تنويه: المغسلة غير مسؤولة عن الملابس بعد 30 يومًا.
                            </p>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handlePrint} style={{ backgroundColor: '#00BCD4', borderColor: '#00BCD4' }}>
                    Print / طباعة
                </Button>
                <Button variant="secondary" onClick={onHide}>
                    Close / إغلاق
                </Button>
            </Modal.Footer>

            {/* Custom CSS for Printing */}
            <style type="text/css">
                {`
                    @media print {
                        .modal-header, .modal-footer {
                            display: none;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                        }
                    }

                    /* Align prices to the right */
                    table td, table th {
                        padding: 5px 10px;
                    }

                    table th:last-child, table td:last-child {
                        text-align: right;
                    }
                `}
            </style>
        </Modal>
    );
}

export default ReceiptModal;
