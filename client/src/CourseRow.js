function CourseRow(props){
    return (
        <tr>
            <td>{props.course.code}</td>
            <td>{props.course.name}</td>
            <td>{props.course.credits}</td>
            <td>{props.course.maxStudents}</td>
            <td>{props.course.incompatibleWith}</td> {/*NEED TO IMPLEMENT EXPANDED/CONTRACTED STATES FOR incompatibleWith and preparatoryCourse */}    
            <td>{props.course.preparatoryCourse}</td>
        </tr>
    );
}

export default CourseRow;