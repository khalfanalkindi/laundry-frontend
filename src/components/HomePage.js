import React, { useState, useEffect } from 'react';
import api from './axiosConfig';
import { Card, Container, Row, Col, Table } from 'react-bootstrap';
import { format, subDays } from 'date-fns';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
    const { t, i18n } = useTranslation();
    const [todayOrders, setTodayOrders] = useState(0);
    const [todayTotalAmount, setTodayTotalAmount] = useState(0);
    const [pickedOrders, setPickedOrders] = useState(0);
    const [pickedTotalAmount, setPickedTotalAmount] = useState(0);
    const [ordersByDate, setOrdersByDate] = useState([]);

    useEffect(() => {
        const language = localStorage.getItem('language') || 'en';
        i18n.changeLanguage(language); // Ensure the correct language is set on load
        document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.body.style.fontFamily = i18n.language === 'ar' ? "'Noto Sans Arabic', sans-serif" : "'Noto Sans', sans-serif";

        // Fetch today's orders count and total amount
        api.get('/orders/today/')
            .then(response => {
                setTodayOrders(response.data.count);
                setTodayTotalAmount(response.data.total_amount);
            })
            .catch(error => console.error('Error fetching today\'s orders:', error));

        // Fetch today's picked orders count and total amount
        api.get('/orders/picked/')
            .then(response => {
                setPickedOrders(response.data.count);
                setPickedTotalAmount(response.data.total_amount);
            })
            .catch(error => console.error('Error fetching picked orders:', error));

        // Fetch the orders for the last 7 days
        api.get('/orders/chart/')
            .then(response => {
                const dataWithZeroOrders = fillMissingDates(response.data);
                setOrdersByDate(dataWithZeroOrders);
            })
            .catch(error => console.error('Error fetching orders by date:', error));
    }, [i18n]);

    const fillMissingDates = (orders) => {
        const last7Days = Array.from({ length: 7 }, (_, index) => format(subDays(new Date(), index), 'yyyy-MM-dd')).reverse();
        const ordersMap = orders.reduce((acc, order) => {
            acc[order.date] = order.count;
            return acc;
        }, {});

        return last7Days.map(date => ({
            date,
            count: ordersMap[date] || 0,
        }));
    };

    return (
        <Container style={{ marginTop: '20px' }}>
            <Row className="mb-4">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{t('new_orders_for_today', { date: format(new Date(), 'dd-MM-yyyy') })}</Card.Title>

                            <Card.Text>
                                {todayOrders} {t('orders')}<br />
                                {t('total_amount')}: {todayTotalAmount.toFixed(3)} {t('currency')}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{t('picked_orders_for_today', { date: format(new Date(), 'yyyy-MM-dd') })}</Card.Title>
                            <Card.Text>
                                {pickedOrders} {t('orders')}<br />
                                {t('total_amount')}: {pickedTotalAmount.toFixed(3)} {t('currency')}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{t('orders_by_date_last_7_days')}</Card.Title>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>{t('date')}</th>
                                        <th>{t('order_count')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ordersByDate.length > 0 ? (
                                        ordersByDate.map((order, index) => (
                                            <tr key={index}>
                                                <td>{order.date}</td>
                                                <td>{order.count}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="text-center">{t('no_data_available')}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
