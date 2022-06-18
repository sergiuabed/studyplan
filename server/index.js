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

app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  res.status(201).json(req.user);
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