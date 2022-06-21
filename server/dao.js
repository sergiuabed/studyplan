'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('studyplan.db', (err) => {
    if (err)
        throw err;
});

const crypto = require('crypto');

const { Course } = require('./course');

const getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email=?';
        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            }
            else if (row === undefined) {
                resolve(false);
            }
            else {
                const user = { id: row.id, email: row.email, name: row.name, surname: row.surname, tableName: row.tableName};//, type: row.type }
                try {
                    crypto.scrypt(password, Buffer.from(row.salt, 'hex'), 32, (err, hashedPassword) => {
                        if (err)
                            reject(err);

                        if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
                            resolve(false);
                        else
                            resolve(user);
                    });
                } catch(err){
                    console.log(err);
                    throw err;
                }
            }
        });
    });
}

const getAllCourses = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM courses ORDER BY name';
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                const courses = rows.map(row => new Course(row.code, row.name, row.credits, row.max_students, row.incompatible_with, row.preparatory_course, row.enrolled_students));
                resolve(courses);
            }
        });
    });
}

const getStudyPlan = (user) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT courses.code, name, credits, max_students, incompatible_with, preparatory_course, enrolled_students FROM ' + user + ', courses WHERE ' + user + '.code=courses.code';
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                const courses = rows.map(row => new Course(row.code, row.name, row.credits, row.max_students, row.incompatible_with, row.preparatory_course, row.enrolled_students));
                resolve(courses);
            }
        });
    });
}

const getStudyPlanType = (user) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT type FROM users WHERE email=?';
        db.all(sql, [user.email], (err, rows) => {
            if(err)
                reject(err);
            else{
                const type = rows[0].type;
                console.log(`The type of user ${user.surname} is `);
                console.log(type);
                resolve(type);
            }
        });
    });
}

module.exports = { getAllCourses, getStudyPlan, getUser, getStudyPlanType };