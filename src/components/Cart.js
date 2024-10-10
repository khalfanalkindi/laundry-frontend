import React, { useState } from 'react';
import { ListGroup, Button, Row, Col, Form } from 'react-bootstrap';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

function Cart({ cartItems, onIncreaseQuantity, onDecreaseQuantity, onRemoveFromCart, onPlaceOrder }) {
    const [discount, setDiscount] = useState(0);  // Discount percentage

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalAfterDiscount = total - (total * (discount / 100));  // Calculate total after discount

    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '15px', marginBottom: '20px' }}>
            <ListGroup variant="flush">
                {cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                        <Row className="align-items-center">
                            <Col xs={4}>
                                <h5>{item.serviceName}</h5>
                                <p>{item.entityName}</p>
                            </Col>
                            <Col xs={2}>
                                <p>{(item.price * item.quantity).toFixed(3)} OMR</p> {/* Updated price calculation */}
                            </Col>
                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                <Button variant="outline-secondary" onClick={() => onDecreaseQuantity(index)} style={{ fontSize: '0.8rem' }}>
                                    <FaMinus />
                                </Button>
                                <span style={{ margin: '0 10px' }}>{item.quantity}</span> {/* Added margin for spacing */}
                                <Button variant="outline-secondary" onClick={() => onIncreaseQuantity(index)} style={{ fontSize: '0.8rem' }}>
                                    <FaPlus />
                                </Button>
                            </Col>
                            <Col xs={2} className="text-right">
                                <Button variant="danger" onClick={() => onRemoveFromCart(index)} style={{ fontSize: '0.8rem' }}>
                                    <FaTrash />
                                </Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Form.Group controlId="formDiscount" className="mt-3">
                <Form.Label>Discount (%)</Form.Label>
                <Form.Control
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    placeholder="Enter discount percentage"
                />
            </Form.Group>
            <h3 className="mt-3">Total: {totalAfterDiscount.toFixed(3)} OMR</h3>
            <Button variant="success" className="mt-3" onClick={onPlaceOrder}>Place Order</Button>
        </div>
    );
}

export default Cart;
