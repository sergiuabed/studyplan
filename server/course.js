'use strict';

function Course(code, name, credits, maxStudents, incompatibleWith, preparatoryCourse) {
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.maxStudents = maxStudents;
    this.incompatibleWith = incompatibleWith === null ? null : incompatibleWith.split(' '); //array of codes of incompatible courses
    this.preparatoryCourse = preparatoryCourse;
}

exports.Course = Course;