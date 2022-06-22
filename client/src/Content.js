import { Row, Col, Form, Button } from 'react-bootstrap';
import CoursesTable from './CoursesTable';
import { StudyPlanTable } from './StudyPlan';
import API from './API';

function Content(props) {
    const nrCredits = props.studyPlan.map(c => c.credits).reduce((acc, c) => acc + c, 0);

    const saveStudyPlan = async () => {
        props.setSaveAction((s) => (s+1));
    }

    const deleteStudyPlan = async () => {
        let auxDeleted = [];
        props.studyPlan.forEach(c => {auxDeleted.push(c.code)});

        //props.setAddedCourses([]);
        //props.setDeletedCourses([]);

        props.setDeletedCourses(auxDeleted);
        props.setDeleteAction((d) => (d+1));
    }

    const cancelModifications = () => {
        let restoredStudyPlan = props.studyPlan.filter(c => !props.addedCourses.includes(c.code));
        let removed = props.courses.filter(c => props.deletedCourses.includes(c.code));

        restoredStudyPlan = [...restoredStudyPlan, ...removed];
        props.setStudyPlan(restoredStudyPlan);

        props.setAddedCourses([]);
        props.setDeletedCourses([]);
    }

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
                                <Col sm={"3"}><div className='topButtons'><Button onClick={saveStudyPlan} size="sm" variant="outline-success" className={"topButton"}>Save Modifications</Button></div></Col>
                                <Col sm={"3"}><div className='topButtons'><Button onClick={cancelModifications} size="sm" variant="outline-warning" className={"topButton"}>Cancel Modifications</Button></div></Col>
                                <Col sm={"3"}><div className='topButtons'><Button onClick={deleteStudyPlan} size="sm" variant="outline-danger" className={"topButton"}>Delete Study Plan</Button></div></Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>}
            <Row className="main-row justify-content-around">
                <Col sm={"7"}>
                    {<div className='tableDiv'>
                        <CoursesTable user={props.user} preparatory={props.preparatory} setPreparatory={props.setPreparatory} deletedCourses={props.deletedCourses} setDeletedCourses={props.setDeletedCourses} addedCourses={props.addedCourses} setAddedCourses={props.setAddedCourses} loggedIn={props.loggedIn} courses={props.courses} studyPlan={props.studyPlan} setStudyPlan={props.setStudyPlan} expandIncompatible={props.expandIncompatible} setExpandIncompatible={props.setExpandIncompatible} expandPreparatory={props.expandPreparatory} setExpandPreparatory={props.setExpandPreparatory} />
                    </div>}
                    {/*<CoursesTable courses={props.courses} expandIncompatible={props.expandIncompatible} setExpandIncompatible={props.setExpandIncompatible} expandPreparatory={props.expandPreparatory} setExpandPreparatory={props.setExpandPreparatory} />*/}
                    <Row>
                        {props.loggedIn === true && <Legend />}
                    </Row>
                </Col>
                {props.loggedIn === true &&
                    <Col sm={"5"}>
                        {<div>
                            <div className='tableDiv'>{
                                props.user.type !== "-" ?
                                    <StudyPlanTable user={props.user} preparatory={props.preparatory} setPreparatory={props.setPreparatory} deletedCourses={props.deletedCourses} setDeletedCourses={props.setDeletedCourses} addedCourses={props.addedCourses} setAddedCourses={props.setAddedCourses} courses={props.courses} setCourses={props.setCourses} studyPlan={props.studyPlan} setStudyPlan={props.setStudyPlan} />
                                    :
                                    <StudyPlanTypeForm user={props.user} setUser={props.setUser} />
                            }
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

function Legend() {
    return (
        <>
            <p>Legend:</p>
            <Col>
                <Button variant="success" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                    </svg></Button> add course
            </Col>
            <Col>
                <Button disabled variant="danger" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z" />
                    </svg></Button> delete course from study plan
            </Col>
            <Col>
                <Button disabled size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                    </svg></Button> course added successfully
            </Col>
            <Col>
                <Button variant="secondary" size="sm" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                    </svg></Button> this course is incompatible
            </Col>
            <Col>
                <Button disabled variant="warning" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-lg" viewBox="0 0 16 16">
                        <path d="M7.005 3.1a1 1 0 1 1 1.99 0l-.388 6.35a.61.61 0 0 1-1.214 0L7.005 3.1ZM7 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
                    </svg></Button> preparatory course not present in the study plan
            </Col>
            <Col>
                <Button disabled variant="danger" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-lg" viewBox="0 0 16 16">
                        <path d="M7.005 3.1a1 1 0 1 1 1.99 0l-.388 6.35a.61.61 0 0 1-1.214 0L7.005 3.1ZM7 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
                    </svg></Button> this is a preparatory course; delete the course that needs it first
            </Col>
            <Col>
                <Button variant="light" size="sm" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                    </svg></Button> this course is full
            </Col>
        </>
    );
}

function StudyPlanTypeForm(props) {
    return (
        <>
            <h3>Study plan not defined. Choose a type:</h3>

            <Button className='studyplanChoiceButton' onClick={() => {
                let usr = { ...props.user };
                usr.type = "full-time";
                props.setUser(usr);
            }}>Full-time</Button>

            <Button className='studyplanChoiceButton' variant="success" onClick={() => {
                let usr = { ...props.user };
                usr.type = "part-time";
                props.setUser(usr);
            }}>Part-time</Button>
        </>
    );
}

export default Content;