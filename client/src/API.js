import { Course } from "./course";

const serverURL = 'http://localhost:3001/api';

const getAllCourses = async () => {
    try {
        const response = await fetch(serverURL + '/courses');
        if (response.ok) {
            const courses = await response.json();
            //let coursesArr = courses.map( (e) => new Course(e.code, e.name, e.credits, e.maxStudents, e.incompatibleWith, ) )
            return courses;
        }
        else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (err) {
        throw err;
    }
}

const API = { getAllCourses };
export default API;