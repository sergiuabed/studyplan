'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const dao = require('./dao');

// init express
const app = new express();
const port = 3001;
app.use(morgan('common'));
app.use(express.json());
app.use(cors());  //REMEMBER TO PASS corsOptions TO cors() WHEN IMPLEMENTING THE USER SESSIONS

//IMPLEMENT APIs HERE

app.get('/api/courses', async (req, res) => {
  try{
    let courses = await dao.getAllCourses();
    res.status(200).json(courses);
  }catch(err){
    console.log(err);
    res.status(500).json(err);
    throw err;
  }
  
});

app.get('/api/:user', async (req, res) => { //MODIFY THIS API ACCORDINGLY WHEN IMPLEMENTING USER SESSIONS
  if(!req.params.user)
    res.status(422).end();

  try{
    let courses = await dao.getStudyPlan(req.params.user);
    res.status(200).json(courses);
  }catch(err){
    console.log(err);
    res.status(500).json(err);
    throw err;
  }
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});