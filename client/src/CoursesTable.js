import { Table } from "react-bootstrap";
import CourseRow from "./CourseRow";

function CoursesTable(props) {
    return (
        <Table>
            <thead>
                <tr>
                    {props.loggedIn === true && <th></th>}
                    <th>Code</th>
                    <th>Name</th>
                    <th>Credits</th>
                    <th>Max Students</th>
                    <th>Incompatible With</th>
                    <th>Preparatory course</th>
                    <th>Enrolled Students</th>
                </tr>
            </thead>
            <tbody>
                { props.courses.map(c => (<CourseRow incompatible={props.incompatible} preparatory={props.preparatory} loggedIn={props.loggedIn} key={c.code} course={c} allCourses={props.courses} studyPlan={props.studyPlan} setStudyPlan={props.setStudyPlan} expandIncompatible={props.expandIncompatible} setExpandIncompatible={props.setExpandIncompatible} expandPreparatory={props.expandPreparatory} setExpandPreparatory={props.setExpandPreparatory} deletedCourses={props.deletedCourses} setDeletedCourses={props.setDeletedCourses} addedCourses={props.addedCourses} setAddedCourses={props.setAddedCourses}/>)) }
            </tbody>
        </Table>
    );
}

export default CoursesTable;