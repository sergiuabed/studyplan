'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('studyplan.db', (err) => {
    if(err)
        throw err;
});

const { Course } = require('./course');

const getAllCourses = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM courses ORDER BY name';
        db.all(sql, [], (err, rows) => {
            if(err)
                reject(err);
            else{
                const courses = rows.map(row => new Course(row.code, row.name, row.credits, row.max_students, row.incompatible_with, row.preparatory_course, row.enrolled_students));
                resolve(courses);
            }
        });
    });
}

const getStudyPlan = (user) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT courses.code, name, credits, max_students, incompatible_with, preparatory_course, enrolled_students FROM '+user+', courses WHERE '+user+'.code=courses.code';
        db.all(sql, [], (err, rows) => {
            if(err)
                reject(err);
            else{
                const courses = rows.map(row => new Course(row.code, row.name, row.credits, row.max_students, row.incompatible_with, row.preparatory_course, row.enrolled_students));
                resolve(courses);
            }
        });
    });
}

module.exports = { getAllCourses, getStudyPlan };