import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import api from './axiosConfig';

function RolesPage() {
    const [roles, setRoles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleDescription, setNewRoleDescription] = useState('');
    const [currentRole, setCurrentRole] = useState(null);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = () => {
        api.get('/roles/')
            .then(response => setRoles(response.data))
            .catch(error => console.error('Error fetching roles:', error));
    };

    const handleShowModal = (role = null) => {
        setCurrentRole(role);
        if (role) {
            setNewRoleName(role.role_name);
            setNewRoleDescription(role.description);
        } else {
            setNewRoleName('');
            setNewRoleDescription('');
        }
        setShowModal(true);
    };

    const handleSaveRole = () => {
        const payload = { role_name: newRoleName, description: newRoleDescription };

        if (currentRole) {
            api.put(`/roles/${currentRole.id}/`, payload)
                .then(() => fetchRoles())
                .catch(error => console.error('Error updating role:', error));
        } else {
            api.post('/roles/', payload)
                .then(() => fetchRoles())
                .catch(error => console.error('Error creating role:', error));
        }
        setShowModal(false);
    };

    const handleDeleteRole = (roleId) => {
        api.delete(`/roles/${roleId}/`)
            .then(() => fetchRoles())
            .catch(error => console.error('Error deleting role:', error));
    };

    return (
        <Container>
            <h2>Roles Management</h2>
            <Button variant="primary" onClick={() => handleShowModal()}>Add Role</Button>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Role Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map(role => (
                        <tr key={role.id}>
                            <td>{role.role_name}</td>
                            <td>{role.description}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleShowModal(role)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDeleteRole(role.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for Add/Edit Role */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentRole ? 'Edit Role' : 'Add Role'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formRoleName">
                            <Form.Label>Role Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={newRoleName} 
                                onChange={(e) => setNewRoleName(e.target.value)} 
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formRoleDescription" className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={newRoleDescription} 
                                onChange={(e) => setNewRoleDescription(e.target.value)} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSaveRole}>{currentRole ? 'Update' : 'Save'}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default RolesPage;
