import { Container, Navbar, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function StudyPlanNavbar(props) {
    return (
        <Navbar fluid="true" bg="dark" expand="lg" variant="dark">
            <Container fluid>
                <Link to='/'><Navbar.Brand className="me-auto">Study Plan</Navbar.Brand></Link>

                <Navbar.Text>{props.loggedIn === true ? props.user.name + ' ' + props.user.surname : ''}</Navbar.Text>

                {props.loggedIn === false ? <Link to='/login'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                </svg></Link> :
                    /*<svg onClick={props.logout} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z" />
                        <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
                    </svg></Link>*/
                <Button onClick={props.handleLogout}>Log out</Button>}
            </Container>
        </Navbar>
    );
}

export default StudyPlanNavbar;