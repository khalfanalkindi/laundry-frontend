// src/components/TokenExpiryModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const TokenExpiryModal = ({ show, onClose, onRenew }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Session Expiry</Modal.Title>
            </Modal.Header>
            <Modal.Body>Your session is about to expire. Do you want to renew it?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Sign Out
                </Button>
                <Button variant="primary" onClick={onRenew}>
                    Renew Session
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TokenExpiryModal;
