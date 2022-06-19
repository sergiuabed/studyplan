import { Table, Button } from "react-bootstrap";

function StudyPlanTable(props) {
    return (
        <Table>
            <thead>
                <tr>
                    <th></th>
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
            <td><DeleteCourseButton/></td>
            <td>{props.course.code}</td>
            <td>{props.course.name}</td>
            <td>{props.course.credits}</td>
        </tr>
    );
}

function DeleteCourseButton(props) {
    return (
        <Button variant="danger" size="sm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z" />
        </svg></Button>
    );
}

export { StudyPlanTable };