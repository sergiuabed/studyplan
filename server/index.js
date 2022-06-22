'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const dao = require('./dao');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

// init express
const app = new express();
const port = 3001;
app.use(morgan('common'));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await dao.getUser(username, password);
  console.log(user);
  if (!user)
    return cb(null, false, 'Incorrect username or password.');

  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ error: 'Not authorized' });
}

app.use(session({
  secret: 'shady secret',
  resave: false,
  saveUninitialized: false
}));
//app.use(passport.authenticate('session'));
app.use(passport.session());
//IMPLEMENT APIs HERE

app.get('/api/courses', async (req, res) => {
  try {
    let courses = await dao.getAllCourses();
    res.status(200).json(courses);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
    throw err;
  }

});

app.get('/api/studyplan', isLoggedIn, async (req, res) => { //MODIFY THIS API ACCORDINGLY WHEN IMPLEMENTING USER SESSIONS
  try {
    console.log(req.user);
    let courses = await dao.getStudyPlan(req.user.tableName);
    res.status(200).json(courses);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
    throw err;
  }
});

app.put('/api/studyplan', isLoggedIn, async (req, res) => {
  try {
    let studyPlan = req.body.studyPlan;           // contains the codes of the courses
    let addedCourses = req.body.addedCourses;     // contains the codes of the courses
    let deletedCourses = req.body.deletedCourses; // contains the codes of the courses
    let type = req.body.type;

    //  check max nr of students constraint
    let coursesWithMax = await dao.getCoursesWithMaxStudents();
    let fullCourses = coursesWithMax.filter(c => c.maxStudents === c.enrolledStudents);
    let codesFullCourses = fullCourses.map(c => c.code);
    let courseOverflow = addedCourses.reduce((acc, curr) => codesFullCourses.includes(curr) || acc, false);

    if (courseOverflow === true) {
      res.status(422).send("One or more courses in the study plan are full. Modify again your study plan.");
      return;
    } else {
      console.log('Max students constraint is respected');
    }

    // check credits boundaries
    await dao.createTEMPTABLE();
    await dao.populateTEMPTABLE(studyPlan);
    let totCredits = await dao.creditsInTEMPTABLE();

    let min = 0;
    let max = 0;

    if (type === 'part-time') {
      min = 20;
      max = 40;
    } else {
      if (type === 'full-time') {
        min = 60;
        max = 80;
      } else {
        throw new TypeError("Type is not part-time or full-time!");
      }
    }

    if (totCredits < min || totCredits > max) {
      res.status(422).send("The defined study plan does not respect the number of credits boundaries!");
      await dao.emptyTable("TEMPTABLE");
      return;
    }else{
      console.log("Min-max constraints for nr of credits respected!");
    }

    await dao.emptyTable("TEMPTABLE");

    // increment enrolled students for added courses
    await dao.populateTEMPTABLE(addedCourses);
    await dao.incrementEnrolledStudents();  // looks in TEMPTABLE for courses to be updated
    await dao.emptyTable("TEMPTABLE");

    // decrement enrolled students for deleted courses
    await dao.populateTEMPTABLE(deletedCourses);
    await dao.decrementEnrolledStudents();  // looks in TEMPTABLE for courses to be updated
    await dao.emptyTable("TEMPTABLE");
    
    // insert new studyplan
    await dao.populateTEMPTABLE(studyPlan);
    await dao.emptyTable(req.user.tableName);
    await dao.copyFromTEMPTABLE(req.user.tableName);
    await dao.emptyTable("TEMPTABLE");

    console.log("Study plan should have been inserted");

    // update type of study plan in 'users' table
    await dao.updateStudyPlanType(req.user.email, type);

    res.status(201).end();
    console.log("Study plan type should have been updated");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.post('/api/sessions', passport.authenticate('local'), async (req, res) => {
  let type = await dao.getStudyPlanType(req.user);
  let usr = { ...req.user, type: type };
  res.status(201).json(usr);
});

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated())
    res.json(req.user);
  else
    res.status(401).json({ error: 'Not authenticated' });
});

app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});