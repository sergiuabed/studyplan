import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import "./pageLayout.css";
import CoursesTable from './CoursesTable';
import StudyPlanNavbar from './StudyPlanNavbar';
import { useEffect, useState } from 'react';
import API from './API';

function App() {
  /*let c1 = {
    code: '02GOLOV',
    name: 'Architetture dei sistemi di elaborazione',
    credits: 12,
    maxStudents: null,
    incompatibleWith: ['02LSEOV'],
    preparatoryCourse: null
  };

  let c2 = {
    code: '01SQJOV',
    name: 'Data Science and Database Technology',
    credits: 8,
    maxStudents: null,
    incompatibleWith: ['01SQMOV', '01SQLOV'],
    preparatoryCourse: null
  };

  let coursesArr=[c1, c2];*/

  const [courses, setCourses] = useState([]);
  const [expandIncompatible, setExpandIncompatible] = useState([]); // will store an array of codes of the courses on which the expand state is ON for the incompatible courses info
  const [expandPreparatory, setExpandPreparatory] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      let c = await API.getAllCourses();
      setCourses(c);
    }

    loadCourses();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col className="navBar">
          <StudyPlanNavbar />
        </Col>
      </Row>
      <Row className="main-row">
        <Col sm={"1"} className="side-column">Ciao</Col>
        <Col sm={"10"}>
          <div className='tableDiv'>
            <CoursesTable courses={courses} expandIncompatible={expandIncompatible} setExpandIncompatible={setExpandIncompatible} expandPreparatory={expandPreparatory} setExpandPreparatory={setExpandPreparatory} />
          </div>
        </Col>
        <Col sm={"1"} className="side-column">Ciao</Col>
      </Row>
    </Container>
  );
}

export default App;
