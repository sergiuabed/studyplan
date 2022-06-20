import { Row, Col, Form, Button } from 'react-bootstrap';
import CoursesTable from './CoursesTable';
import { StudyPlanTable } from './StudyPlan';

function Content(props) {
    const nrCredits = props.studyPlan.map(c => c.credits).reduce((acc, c) => acc + c, 0);

    return (
        <>
            {props.loggedIn === true && <Row className="buttons-row">
                <Col sm={"12"}>
                    <Row className="align-content-lg-end">
                        <Col sm={"4"}></Col>
                        <Col sm={"4"}></Col>
                        <Col sm={"4"}>
                            {/*<div className={"topButtons"}><Button>Save Modifications</Button></div>
                            <div className={"topButtons"}><Button>Cancel Modifications</Button></div>
                            <div className={"topButton"}><Button>Delete Study Plan</Button></div>*/}
                            <Row>
                                <Col sm={"3"}><div className='topButtons'><Button size="sm" variant="outline-success" className={"topButton"}>Save Modifications</Button></div></Col>
                                <Col sm={"3"}><div className='topButtons'><Button size="sm" variant="outline-warning" className={"topButton"}>Cancel Modifications</Button></div></Col>
                                <Col sm={"3"}><div className='topButtons'><Button size="sm" variant="outline-danger" className={"topButton"}>Delete Study Plan</Button></div></Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>}
            <Row className="main-row justify-content-around">
                <Col sm={"7"}>
                    {<div className='tableDiv'>
                        <CoursesTable incompatible={props.incompatible} setIncompatible={props.setIncompatible} preparatory={props.preparatory} setPreparatory={props.setPreparatory} deletedCourses={props.deletedCourses} setDeletedCourses={props.setDeletedCourses} addedCourses={props.addedCourses} setAddedCourses={props.setAddedCourses} loggedIn={props.loggedIn} courses={props.courses} studyPlan={props.studyPlan} setStudyPlan={props.setStudyPlan} expandIncompatible={props.expandIncompatible} setExpandIncompatible={props.setExpandIncompatible} expandPreparatory={props.expandPreparatory} setExpandPreparatory={props.setExpandPreparatory} />
                    </div>}
                    {/*<CoursesTable courses={props.courses} expandIncompatible={props.expandIncompatible} setExpandIncompatible={props.setExpandIncompatible} expandPreparatory={props.expandPreparatory} setExpandPreparatory={props.setExpandPreparatory} />*/}
                </Col>
                {props.loggedIn === true &&
                    <Col sm={"5"}>
                        {<div>
                            <div className='tableDiv'>
                                <StudyPlanTable incompatible={props.incompatible} setIncompatible={props.setIncompatible} preparatory={props.preparatory} setPreparatory={props.setPreparatory} deletedCourses={props.deletedCourses} setDeletedCourses={props.setDeletedCourses} addedCourses={props.addedCourses} setAddedCourses={props.setAddedCourses} courses={props.courses} studyPlan={props.studyPlan} />
                            </div>
                        </div>}

                        <Row>
                            <Col sm={"4"}>
                                <div className='disabledInput'>
                                    <p>Number of credits inserted:
                                        <Form.Control placeholder={nrCredits.toString()} disabled />
                                    </p>
                                </div>
                            </Col>
                            <Col sm={"4"}>
                                <div className='disabledInput'>
                                    <p>Minimum number of credits allowed:
                                        <Form.Control placeholder={props.user.type === 'full-time' ? 60 : 20} disabled />
                                    </p>
                                </div>
                            </Col>
                            <Col sm={"4"}>
                                <div className='disabledInput'>
                                    <p>Maximum number of credits allowed:
                                        <Form.Control placeholder={props.user.type === 'full-time' ? 80 : 40} disabled />
                                    </p>
                                </div>
                            </Col>
                        </Row>
                        {/*<StudyPlanTable courses={props.studyPlan} />*/}
                    </Col>}
            </Row>
        </>
    );
}

export default Content;