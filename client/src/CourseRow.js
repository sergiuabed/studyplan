import NestedTable from "./NestedTable";
import { Button } from "react-bootstrap";

function CourseRow(props) {
    const searchCourses = (courses, codes) => { //"codes" may store either the codes of incompatible courses or of preparatory courses
        let resCourses = [];
        for (let code of codes) {
            for (let course of courses) {
                if (course.code === code)
                    resCourses.push(course);
            }
        }

        return resCourses;
    }
    return (
        <tr>
            <td>{props.course.code}</td>
            <td>{props.course.name}</td>
            <td>{props.course.credits}</td>
            <td>{props.course.maxStudents}</td>
            <td>{props.course.incompatibleWith === null ? ' ' : <NestedTableCell courseCode={props.course.code} courses={searchCourses(props.allCourses, props.course.incompatibleWith)} expandState={props.expandIncompatible} setExpandState={props.setExpandIncompatible} />}</td> {/*NEED TO IMPLEMENT EXPANDED/CONTRACTED STATES FOR incompatibleWith and preparatoryCourse */}
            <td>{props.course.preparatoryCourse === null ? ' ' : <NestedTableCell courseCode={props.course.code} courses={searchCourses(props.allCourses, [props.course.preparatoryCourse])} expandState={props.expandPreparatory} setExpandState={props.setExpandPreparatory} />}</td>
            <td>{props.course.enrolledStudents}</td>
        </tr>
    );
}

function NestedTableCell(props) {


    return (
        <>
            <Button
                className="addBorder"
                type="checkbox"
                variant="outline-warning"
                checked={props.expandState.includes(props.courseCode)}
                onClick={() => {
                    let arr = [];
                    if (props.expandState.includes(props.courseCode)) {
                        props.setExpandState(a => {
                            return a.filter((e) => e !== props.courseCode);
                        });
                    } else {
                        props.setExpandState(a => ([...a, props.courseCode]));
                    }

                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                </svg>
            </Button>
            <br />
            {props.expandState.includes(props.courseCode) === true && <NestedTable courses={props.courses} />}
        </>
    );
}

export default CourseRow;