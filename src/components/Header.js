import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Row, Col } from 'react-bootstrap';
import './Header.css';

function Header({ username }) {
    return (
        <header className="header-container">
            <Container fluid className="px-4 py-2 header-top">
                <Row className="align-items-center">
                    <Col md={8} className="d-flex align-items-center">
                        <img
                            src="/logo.png"
                            width="50"
                            height="50"
                            className="d-inline-block align-top mr-2"
                            alt="Logo"
                        />
                        <span className="h4 ml-2">Laundry Management</span>
                    </Col>
                    <Col md={4} className="text-right">
                        <NavDropdown title={username} id="user-dropdown" alignRight>
                            <NavDropdown.Item href="#user-details">User Details</NavDropdown.Item>
                            <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Col>
                </Row>
            </Container>
            <Navbar bg="dark" variant="dark" expand="lg" className="header-navbar">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#new-order">Create New Order</Nav.Link>
                        <Nav.Link href="#pick-orders">Pick Order</Nav.Link>
                        <NavDropdown title="Units Definitions" id="units-dropdown">
                            <NavDropdown.Item href="#entities">Entities</NavDropdown.Item>
                            <NavDropdown.Item href="#services">Services</NavDropdown.Item>
                            <NavDropdown.Item href="#entities-services-mapping">Entities Services Mapping</NavDropdown.Item>
                            <NavDropdown.Item href="#customer-report">Customer Report</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Reports" id="reports-dropdown">
                            <NavDropdown.Item href="#income-summary">Income Summary</NavDropdown.Item>
                            <NavDropdown.Item href="#bill-report">Bill Report</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#admin">Administration</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </header>
    );
}

export default Header;
