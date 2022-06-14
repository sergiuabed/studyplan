import { Table } from "react-bootstrap";
import CourseRow from "./CourseRow";

function CoursesTable(props) {
    return (
        <Table>
            <thead>
                <tr>
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
                { props.courses.map(c => (<CourseRow key={c.code} course={c} allCourses={props.courses} expandIncompatible={props.expandIncompatible} setExpandIncompatible={props.setExpandIncompatible} expandPreparatory={props.expandPreparatory} setExpandPreparatory={props.setExpandPreparatory}/>)) }
            </tbody>
        </Table>
    );
}

export default CoursesTable;