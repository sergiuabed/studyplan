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
                </tr>
            </thead>
            <tbody>
                { props.courses.map(c => (<CourseRow key={c.code} course={c}/>)) }
            </tbody>
        </Table>
    );
}

export default CoursesTable;