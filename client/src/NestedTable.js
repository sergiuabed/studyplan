import { Table } from "react-bootstrap";

function NestedTable(props) {
    return (
        <Table className="nestedTable" hover>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                { props.courses.map(c => (<NestedTableRow key={c.code} course={c}/>)) }
            </tbody>
        </Table>
    );
}

function NestedTableRow(props){
    return (
        <tr>
            <td>{props.course.code}</td>
            <td>{props.course.name}</td>
        </tr>
    );
}

export default NestedTable;