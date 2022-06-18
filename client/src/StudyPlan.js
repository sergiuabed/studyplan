import { Table } from "react-bootstrap";

function StudyPlanTable(props) {
    return (
        <Table>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Credits</th>
                </tr>
            </thead>
            <tbody>
                {props.courses.map(c => (<StudyPlanRow key={c.code} course={c} />))}
            </tbody>
        </Table>
    );
}


function StudyPlanRow(props) {
    return (
        <tr>
            <td>{props.course.code}</td>
            <td>{props.course.name}</td>
            <td>{props.course.credits}</td>
        </tr>
    );
}

export { StudyPlanTable };