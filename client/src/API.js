
const serverURL = 'http://localhost:3001/api';

const login = async (username, password) => {
    const response = await fetch(serverURL + '/sessions', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const err = await response.text();
        throw err;
    }
};

const logout = async () => {
    const response = await fetch(serverURL + '/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        const err = await response.text();
        console.log(err);
        throw err;
    }
}

const getAllCourses = async () => {
    try {
        const response = await fetch(serverURL + '/courses', { credentials: 'include' });
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

const getStudyPlan = async () => {  //"user" WILL BE UNNECESSARY WHEN IMPLEMENTING THE USER SESSION
    try {
        const response = await fetch(serverURL + '/studyplan', { credentials: 'include' });
        if (response.ok) {
            const courses = await response.json();
            console.log(courses);
            return courses;
        } else {
            const text = await response.text();
            console.log(text);
            throw new TypeError(text);
        }
    } catch (err) {
        throw err;
    }
}

const putStudyPlan = async (studyPlan, addedCourses, deletedCourses, type) => {
    try {
        const response = await fetch(serverURL + '/studyplan',
            {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ studyPlan, addedCourses, deletedCourses, type })
            });

        if (response.ok) {
            return "Study plan saved successfully!";
        } else {
            const text = await response.text();
            throw new TypeError(text);
        }

    } catch (err) {
        console.log(err);
        throw err; // to be catched
    }
}

const deleteStudyPlan = async (deletedCourses) => {
    try {
        const response = await fetch(serverURL + '/studyplan',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ deletedCourses })
            });

        if (response.ok) {
            return "Study plan deleted!";
        } else {
            const text = await response.text();
            throw new TypeError(text);
        }

    } catch (err) {
        console.log(err);
        throw err;
    }
}

const API = { getAllCourses, getStudyPlan, login, logout, putStudyPlan, deleteStudyPlan };
export default API;