'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('studyplan.db', (err) => {
    if(err)
        throw err;
});

const { Course } = require('./course');

const getAllCourses = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM courses';
        db.all(sql, [], (err, rows) => {
            if(err)
                reject(err);
            else{
                const courses = rows.map(row => new Course(row.code, row.name, row.credits, row.max_students, row.incompatible_with, row.preparatory_course));
                resolve(courses);
            }
        });
    });
}

module.exports = { getAllCourses };