import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import StudyPlanNavbar from './StudyPlanNavbar';

function Layout(props) {
    return (
        <Container fluid className='container-style'>
            <Row>
                <Col className="navBar">
                    <StudyPlanNavbar user={props.user} loggedIn={ props.loggedIn } handleLogout={props.handleLogout}/>
                </Col>
            </Row>
            <Outlet/>
        </Container>
    );
}

export default Layout;