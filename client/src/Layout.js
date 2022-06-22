import { Container, Row, Col, Alert } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import StudyPlanNavbar from './StudyPlanNavbar';
import { useState } from 'react';

function Layout(props) {
    return (
        <Container fluid>
            <Row>
                <Col className="navBar">
                    <StudyPlanNavbar user={props.user} loggedIn={props.loggedIn} handleLogout={props.handleLogout} />
                </Col>
            </Row>
            <Outlet />
            {props.message!== '' && <Alert variant={props.message === "Study plan saved successfully!" ? "success" : "danger"} className='alertBottom' onClose={() => props.setMessage('')} dismissible>
                {props.message}
            </Alert>}
        </Container>
    );
}

export default Layout;