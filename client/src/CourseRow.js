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

    const highlightRow = () => {
        if (props.incompatible.includes(props.course.code))
            return "incompatibleCourse";
        
        let studyPlanCodes = props.studyPlan.map(c => c.code);
        if(props.course.preparatoryCourse !== null && !studyPlanCodes.includes(props.course.preparatoryCourse))
            return "needsPreparatoryCourse"

        return "";
    }

    const added = () => {
        let studyPlanCodes = props.studyPlan.map(c => c.code);
        if (studyPlanCodes.includes(props.course.code))
            return true;
        else
            return false;
    }

    return (
        <tr className={ props.loggedIn ===true ? highlightRow() : ""}>
            {props.loggedIn === true && <td><AddCourseButton added={added()} highlightRow={highlightRow} disabled={highlightRow() === "incompatibleCourse"} course={props.course} deletedCourses={props.deletedCourses} setDeletedCourses={props.setDeletedCourses} addedCourses={props.addedCourses} setAddedCourses={props.setAddedCourses} studyPlan={props.studyPlan} setStudyPlan={props.setStudyPlan} /></td>}
            <td>{props.course.code}</td>
            <td>{props.course.name}</td>
            <td>{props.course.credits}</td>
            <td>{props.course.maxStudents}</td>
            <td>{props.course.incompatibleWith === null ? ' ' : <NestedTableCell courseCode={props.course.code} courses={searchCourses(props.allCourses, props.course.incompatibleWith)} expandState={props.expandIncompatible} setExpandState={props.setExpandIncompatible} />}</td>
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

function AddCourseButton(props) {
    const addCourse = (course) => {
        if (props.deletedCourses.includes(course.code))
            props.setDeletedCourses(() => props.deletedCourses.filter(c => c !== course.code));
        else
            props.setAddedCourses(() => [...props.addedCourses, course.code]);

        if(props.course.preparatoryCourse)
        {
            let aux = [...props.preparatory, props.course.preparatoryCourse];
            props.setPreparatory(aux);
        }

        // NOT SURE IF I SHOULD CHECK IF THE COURSE IS ALREADY PRESENT IN THE STUDY PLAN, SINCE IF IT IS, ITS ROW IN THE COURSES TABLE WOULD HAVE THE 'ADD' BUTTON REPLACED BY A DISABLED 'CHECK'BUTTON
        props.setStudyPlan(() => [...props.studyPlan, course]);
    }

    return (
        props.added === false ?
            <Button disabled={props.disabled} variant={props.disabled ? "secondary" : "success"} size="sm" onClick={() => { addCourse(props.course) }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                </svg></Button>
            :
            <Button disabled size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                </svg></Button>
    );
}

export default CourseRow;