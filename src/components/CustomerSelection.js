import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import api from './axiosConfig';
import CustomerModal from './CustomerModal'; 

function CustomerSelection({ onCustomerSelect }) {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);

    useEffect(() => {
        api.get('/customers/')
            .then(response => {
                setCustomers(response.data);
            })
            .catch(error => console.error('Error fetching customers:', error));
    }, []);

    const handleSelectCustomer = (event) => {
        const selectedId = event.target.value;
        const selectedCustomerData = customers.find(customer => customer.id === parseInt(selectedId));
        setSelectedCustomer(selectedCustomerData);
        onCustomerSelect(selectedCustomerData);
    };

    const handleAddCustomer = (customer) => {
        setCustomers([...customers, customer]);
        setSelectedCustomer(customer);
        onCustomerSelect(customer);
        setShowCustomerModal(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
                <label htmlFor="customerSelect" className="mr-2">Select Customer:</label>
                <select
                    id="customerSelect"
                    value={selectedCustomer ? selectedCustomer.id : ''}
                    onChange={handleSelectCustomer}
                    className="form-control"
                    style={{ display: 'inline-block', width: 'auto' }}
                >
                    <option value="" disabled>Select a customer</option>
                    {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                            {customer.name} ({customer.phone})
                        </option>
                    ))}
                </select>
            </div>
            <Button variant="primary" onClick={() => setShowCustomerModal(true)} className="ml-2">
                Add New Customer
            </Button>

            {/* Customer Modal */}
            <CustomerModal
                show={showCustomerModal}
                onHide={() => setShowCustomerModal(false)}
                onAddCustomer={handleAddCustomer}
            />
        </div>
    );
}

export default CustomerSelection;
