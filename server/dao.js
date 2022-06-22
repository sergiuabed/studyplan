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
                const user = { id: row.id, email: row.email, name: row.name, surname: row.surname, tableName: row.tableName };//, type: row.type }
                try {
                    crypto.scrypt(password, Buffer.from(row.salt, 'hex'), 32, (err, hashedPassword) => {
                        if (err)
                            reject(err);

                        if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
                            resolve(false);
                        else
                            resolve(user);
                    });
                } catch (err) {
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
        //const sql = 'SELECT courses.code, name, credits, max_students, incompatible_with, preparatory_course, enrolled_students FROM ' + user + ', courses WHERE ' + user + '.code=courses.code';
        const sql = 'SELECT * FROM ' + user;
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                //const courses = rows.map(row => new Course(row.code, row.name, row.credits, row.max_students, row.incompatible_with, row.preparatory_course, row.enrolled_students));
                const courses = rows.map(r => r.code);
                resolve(courses);
            }
        });
    });
}

const getStudyPlanType = (user) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT type FROM users WHERE email=?';
        db.all(sql, [user.email], (err, rows) => {
            if (err)
                reject(err);
            else {
                const type = rows[0].type;
                console.log(`The type of user ${user.surname} is `);
                console.log(type);
                resolve(type);
            }
        });
    });
}

const emptyTable = (tableName) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM ' + tableName;
        db.run(sql, [], function (err){
            if(err)
                reject(err);
            else
                resolve(tableName + "table emptied");
        });
    });
}

const createTEMPTABLE = () => {
    return new Promise((resolve, reject) => {
        const sql = 'CREATE TABLE TEMPTABLE (code PRIMARY KEY)';
        db.run(sql, [], function (err) {
            if (err)
                reject(err);
            else
                resolve('TEMPTABLE created');
        });
    });
}

const populateTEMPTABLE = (studyPlan) => {
    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO TEMPTABLE(code) VALUES ';
        studyPlan.forEach(c => { sql = sql + '(?), ' });
        sql = sql.substring(0, sql.length - 2) + ';'; //replacing the last ',' with ';'  -2 because there is a space

        db.run(sql, studyPlan, function (err) {
            if (err)
                reject(err);
            else
                resolve('TEMPTABLE populated');
        });
    });
}

const creditsInTEMPTABLE = () => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT SUM(credits) AS totCredits FROM TEMPTABLE, courses WHERE TEMPTABLE.code=courses.code';

        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                let totCredits = rows[0].totCredits;
                resolve(parseInt(totCredits));
            }
        });
    });
}

const copyFromTEMPTABLE = (tableName) => {
    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO ' + tableName + ' SELECT code FROM TEMPTABLE';
        db.run(sql, [], function (err) {
            if(err)
                reject(err);
            else
                resolve(tableName + " populated with rows from TEMPTABLE");
        });
    });
}

const getCoursesWithMaxStudents = () => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM courses WHERE max_students IS NOT NULL';
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

const incrementEnrolledStudents = () => {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE courses SET enrolled_students = enrolled_students + 1 WHERE code IN (SELECT code FROM TEMPTABLE)';
        db.run(sql, [], (err) => {
            if(err)
                reject(err);
            else
                resolve("enrolled students incremented");
        });
    });
}

const decrementEnrolledStudents = () => {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE courses SET enrolled_students = enrolled_students - 1 WHERE code IN (SELECT code FROM TEMPTABLE)';
        db.run(sql, [], (err) => {
            if(err)
                reject(err);
            else
                resolve("enrolled students incremented");
        });
    });
}

const updateStudyPlanType = (email, type) => {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE users SET type = ? WHERE email = ?';
        db.run(sql, [type, email], (err) => {
            if(err)
                reject(err);
            else
                resolve("study plan type updated");
        });
    });
}

module.exports = { getAllCourses, getStudyPlan, getUser, getStudyPlanType, createTEMPTABLE, populateTEMPTABLE, creditsInTEMPTABLE, emptyTable, copyFromTEMPTABLE, getCoursesWithMaxStudents, incrementEnrolledStudents, decrementEnrolledStudents, updateStudyPlanType };