import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import api from './axiosConfig';

function PagesPage() {
    const [pages, setPages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newPageName, setNewPageName] = useState('');
    const [newPageUrl, setNewPageUrl] = useState('');
    const [newPageDescription, setNewPageDescription] = useState('');
    const [currentPage, setCurrentPage] = useState(null);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = () => {
        api.get('/pages/')
            .then(response => setPages(response.data))
            .catch(error => console.error('Error fetching pages:', error));
    };

    const handleShowModal = (page = null) => {
        setCurrentPage(page);
        if (page) {
            setNewPageName(page.page_name);
            setNewPageUrl(page.url);
            setNewPageDescription(page.description);
        } else {
            setNewPageName('');
            setNewPageUrl('');
            setNewPageDescription('');
        }
        setShowModal(true);
    };

    const handleSavePage = () => {
        const payload = { page_name: newPageName, url: newPageUrl, description: newPageDescription };

        if (currentPage) {
            api.put(`/pages/${currentPage.id}/`, payload)
                .then(() => fetchPages())
                .catch(error => console.error('Error updating page:', error));
        } else {
            api.post('/pages/', payload)
                .then(() => fetchPages())
                .catch(error => console.error('Error creating page:', error));
        }
        setShowModal(false);
    };

    const handleDeletePage = (pageId) => {
        api.delete(`/pages/${pageId}/`)
            .then(() => fetchPages())
            .catch(error => console.error('Error deleting page:', error));
    };

    return (
        <Container>
            <h2>Pages Management</h2>
            <Button variant="primary" onClick={() => handleShowModal()}>Add Page</Button>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Page Name</th>
                        <th>URL</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pages.map(page => (
                        <tr key={page.id}>
                            <td>{page.page_name}</td>
                            <td>{page.url}</td>
                            <td>{page.description}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleShowModal(page)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDeletePage(page.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for Add/Edit Page */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentPage ? 'Edit Page' : 'Add Page'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formPageName">
                            <Form.Label>Page Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={newPageName} 
                                onChange={(e) => setNewPageName(e.target.value)} 
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPageUrl" className="mt-3">
                            <Form.Label>URL</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={newPageUrl} 
                                onChange={(e) => setNewPageUrl(e.target.value)} 
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPageDescription" className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={newPageDescription} 
                                onChange={(e) => setNewPageDescription(e.target.value)} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSavePage}>{currentPage ? 'Update' : 'Save'}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default PagesPage;
