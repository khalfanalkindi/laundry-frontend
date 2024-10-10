import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, InputGroup, FormControl, Alert } from 'react-bootstrap';
import CustomerModal from './CustomerModal';
import api from './axiosConfig';
import Select from 'react-select';
import { FaTrash } from 'react-icons/fa';
import ReceiptModal from './ReceiptModal';
import { useTranslation } from 'react-i18next';

function CreateOrderPage() {
    const { t, i18n } = useTranslation();
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [billData, setBillData] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [services, setServices] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [entities, setEntities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [currentBillId, setCurrentBillId] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertVariant, setAlertVariant] = useState(null);

    useEffect(() => {
        // Fetch services
        api.get('/entities-services-mapping/')
        .then(response => {
            console.log("Services Data:", response.data);  // Log the services data to check Arabic fields
            setServices(response.data);
        })
        .catch(error => console.error('Error fetching services:', error));

        // Fetch customers
        api.get('/customers/')
            .then(response => setCustomers(response.data))
            .catch(error => console.error('Error fetching customers:', error));

        // Fetch entities (to get images)
        api.get('/entities/')
            .then(response => setEntities(response.data))
            .catch(error => console.error('Error fetching entities:', error));
    }, []);

    const getEntityImage = (entityId) => {
        const entity = entities.find(e => e.id === entityId);
        return entity?.entity_image || "https://via.placeholder.com/150";
    };

    const handleAddToCart = (service) => {
        const existingItemIndex = cartItems.findIndex(item => item.id === service.id);

        if (existingItemIndex !== -1) {
            const newCartItems = [...cartItems];
            newCartItems[existingItemIndex].quantity += 1;
            setCartItems(newCartItems);
        } else {
            setCartItems([...cartItems, { ...service, quantity: 1 }]);
        }
    };

    const handleIncreaseQuantity = (index) => {
        const newCartItems = [...cartItems];
        newCartItems[index].quantity += 1;
        setCartItems(newCartItems);
    };

    const handleDecreaseQuantity = (index) => {
        const newCartItems = [...cartItems];
        if (newCartItems[index].quantity > 1) {
            newCartItems[index].quantity -= 1;
        } else {
            newCartItems.splice(index, 1);
        }
        setCartItems(newCartItems);
    };

    const handleRemoveFromCart = () => {
        setCartItems([]);
        setAlertMessage(t('cart_cleared'));
        setAlertVariant('info');
    };

    const handlePlaceOrder = () => {
        if (!selectedCustomer) {
            setAlertMessage(t('select_customer_before_order'));
            setAlertVariant('danger');
            return;
        }

        const currentDate = new Date();
        const gmtPlus4Date = new Date(currentDate.getTime() + (240 * 60 * 1000));
        const totalPrice = cartItems.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

        const payload = {
            price: totalPrice.toFixed(4),
            payment_type: null,
            paid: 1,
            last_paid_date: null,
            picked: 0,
            last_picked_date: null,
            discount: discount > 0 ? (totalPrice * (discount / 100)).toFixed(2) : 0,
            discount_rate: discount.toFixed(3),
            tax: null,
            created_user: null,
            phone: selectedCustomer.phone,
            id_code: selectedCustomer.id_code,
            customer_id: selectedCustomer.id,
            created_date: gmtPlus4Date.toISOString(), 
        };

        api.post('/bills/', payload)
            .then(response => {
                const billId = response.data.id;

                const cartPromises = cartItems.map(item => {
                    const cartPayload = {
                        bill_id: billId,
                        ent_srv_id: item.id,
                        quantity: item.quantity,
                        price: Number(item.price).toFixed(2),
                        added_date: new Date().toISOString(),
                        picked: 0,
                    };

                    return api.post('/cart/', cartPayload);
                });

                Promise.all(cartPromises)
                    .then(() => {
                        setBillData(response.data);
                        setCurrentBillId(billId);
                        setShowReceiptModal(true);
                        setCartItems([]);
                        setAlertMessage(t('order_placed_successfully'));
                        setAlertVariant('success');
                    })
                    .catch(error => {
                        console.error('Error saving cart items:', error);
                        setAlertMessage(t('error_saving_cart_items'));
                        setAlertVariant('danger');
                    });
            })
            .catch(error => {
                console.error('Error placing order:', error);
                setAlertMessage(t('error_placing_order'));
                setAlertVariant('danger');
            });
    };

    const handleDiscountChange = (e) => {
        const discountValue = Number(e.target.value);
        setDiscount(discountValue);
    };

    const customerOptions = customers.map(customer => ({
        value: customer.id,
        label: `${customer.name} (${customer.phone})`,
    }));

    const filteredServices = services.filter(service => {
        if (i18n.language === 'ar') {
            return (
                (service.entity_name_ar && service.entity_name_ar.includes(searchTerm)) || 
                (service.service_name_ar && service.service_name_ar.includes(searchTerm))
            );
        } else {
            const searchLowerCase = searchTerm.toLowerCase();
            return (
                service.entity_name?.toLowerCase().includes(searchLowerCase) || 
                service.service_name?.toLowerCase().includes(searchLowerCase)
            );
        }
    });

    return (
        <Container style={{ marginTop: '20px', fontFamily: i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : 'inherit' }}>
            {/* Alert Message */}
            {alertMessage && (
                <Alert variant={alertVariant} onClose={() => setAlertMessage(null)} dismissible>
                    {alertMessage}
                </Alert>
            )}

            <Row>
                <Col md={9}>
                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                        <Select
                            value={selectedCustomer ? customerOptions.find(option => option.value === selectedCustomer.id) : null}
                            onChange={(selectedOption) => {
                                const customer = customers.find(c => c.id === selectedOption.value);
                                setSelectedCustomer(customer);
                            }}
                            options={customerOptions}
                            placeholder={t('select_customer')}
                            className="w-75"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
                                    borderColor: '#ccc', 
                                    '&:hover': {
                                        borderColor: '#ccc'
                                    }
                                })
                            }}
                        />
                        <Button 
                            variant="outline-secondary" 
                            onClick={() => setShowCustomerModal(true)} 
                            style={{ 
                                marginLeft: '10px', 
                                height: '38px',
                                backgroundColor: '#00BCD4', 
                                color: 'white',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
                                borderColor: '#00BCD4',
                                width: '25%' 
                            }}
                        >
                            {t('add_new_customer')}
                        </Button>
                    </div>
                    <FormControl
                        placeholder={t('search_services')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4"
                        style={{ 
                            borderRadius: '15px', 
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
                            borderColor: '#ccc', 
                            '&:hover': { 
                                borderColor: '#ccc'
                            }
                        }}
                    />
                    <Row style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {filteredServices.map((service, idx) => (
                            <Col md={3} key={idx} className="mb-4"> {/* Changed to 4 columns */}
                                <Card 
                                    onClick={() => handleAddToCart(service)}
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
                                    <Card.Title style={{ fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
    <span>
        {i18n.language === 'ar' ? (service.entity_name_ar || service.entity_name) : service.entity_name} - 
        {i18n.language === 'ar' ? (service.service_name_ar || service.service_name) : service.service_name}
    </span>
    <span>{service.price} OMR</span>
</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>

                <Col md={3}>
                    <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '15px', marginBottom: '20px' }}>
                        <div style={{ marginBottom: '20px', maxHeight: '500px', overflowY: 'auto' }}>
                            <div className="d-flex justify-content-end mb-2">
                                <FaTrash onClick={handleRemoveFromCart} style={{ cursor: 'pointer', color: 'red' }} />
                            </div>
                            {cartItems.map((item, index) => (
                                <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                                    <img src={getEntityImage(item.entity)} alt={item.name} style={{ borderRadius: '5px', width: '50px', height: '50px' }} />
                                    <div className="flex-grow-1 mx-3">
                                        <p className="mb-0">
                                            {i18n.language === 'ar' ? item.entity_name_ar : item.entity_name} - 
                                            {i18n.language === 'ar' ? item.service_name_ar : item.service_name}
                                        </p>
                                        <p className="mb-0">{item.price} OMR</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Button variant="outline-secondary" size="sm" onClick={() => handleDecreaseQuantity(index)}>-</Button>
                                        <span className="mx-2">{item.quantity}</span>
                                        <Button variant="outline-secondary" size="sm" onClick={() => handleIncreaseQuantity(index)}>+</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <InputGroup className="mb-2">
                            <FormControl
                                placeholder={t('discount_rate')}
                                value={discount}
                                onChange={handleDiscountChange}
                                style={{ 
                                    borderTopLeftRadius: '0px', 
                                    borderBottomLeftRadius: '0px', 
                                    borderTopRightRadius: '0px', 
                                    borderBottomRightRadius: '0px' 
                                }}
                            />
                            <InputGroup.Text 
                                style={{ 
                                    borderTopRightRadius: '0px', 
                                    borderBottomRightRadius: '0px', 
                                    borderTopLeftRadius: '0px', 
                                    borderBottomLeftRadius: '0px' 
                                }}
                            >
                                %
                            </InputGroup.Text>
                        </InputGroup>

                        <p className="mb-2">{t('discount')}: {discount} %</p>
                        <p>{t('total')}: {(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * (1 - discount / 100)).toFixed(3)} OMR</p>
                        <Button 
                            variant="primary" 
                            className="w-100" 
                            onClick={handlePlaceOrder} 
                            style={{ 
                                backgroundColor: '#00BCD4', 
                                borderColor: '#00BCD4', 
                                borderRadius: '10px' 
                            }}
                        >
                            {t('place_order')} 
                        </Button>
                    </div>
                </Col>
            </Row>

            <CustomerModal
                show={showCustomerModal}
                onHide={() => setShowCustomerModal(false)}
                onAddCustomer={customer => {
                    setSelectedCustomer(customer);
                    setShowCustomerModal(false);
                }}
            />

            {/* Receipt Modal */}
            <ReceiptModal 
                show={showReceiptModal} 
                onHide={() => setShowReceiptModal(false)} 
                billId={currentBillId} 
            />
        </Container>
    );
}

export default CreateOrderPage;
