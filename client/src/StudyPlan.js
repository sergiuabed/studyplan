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
                {props.studyPlan.map(c => (<StudyPlanRow key={c.code} course={c} studyPlan={props.studyPlan} setStudyPlan={props.setStudyPlan} deletedCourses={props.deletedCourses} setDeletedCourses={props.setDeletedCourses} addedCourses={props.addedCourses} setAddedCourses={props.setAddedCourses} preparatory={props.preparatory} setPreparatory={props.setPreparatory} />))}
            </tbody>
        </Table>
    );
}


function StudyPlanRow(props) {
    return (
        <tr>
            <td><DeleteCourseButton course={props.course} studyPlan={props.studyPlan} setStudyPlan={props.setStudyPlan} deletedCourses={props.deletedCourses} setDeletedCourses={props.setDeletedCourses} addedCourses={props.addedCourses} setAddedCourses={props.setAddedCourses} preparatory={props.preparatory} setPreparatory={props.setPreparatory} /></td>
            <td>{props.course.code}</td>
            <td>{props.course.name}</td>
            <td>{props.course.credits}</td>
        </tr>
    );
}

function DeleteCourseButton(props) {
    const deleteCourse = (course) => {
        if (props.addedCourses.includes(course.code)) {
            props.setAddedCourses((addedCourses) => addedCourses.filter(c => c !== course.code));
        } else {
            props.setDeletedCourses((deletedCourses) => [...deletedCourses, course.code]);
        }

        if(props.course.preparatoryCourse)
            props.setPreparatory((preparatory) => preparatory.filter(c => c !== props.course.preparatoryCourse));

        props.setStudyPlan((studyPlan) => studyPlan.filter(c => c.code !== course.code));
    }

    return (
        props.preparatory.includes(props.course.code) ?
            <Button disabled variant="danger" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-lg" viewBox="0 0 16 16">
                    <path d="M7.005 3.1a1 1 0 1 1 1.99 0l-.388 6.35a.61.61 0 0 1-1.214 0L7.005 3.1ZM7 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
                </svg></Button>
            :
            <Button onClick={() => { deleteCourse(props.course) }} variant="danger" size="sm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z" />
            </svg></Button>


    );
}

export { StudyPlanTable };