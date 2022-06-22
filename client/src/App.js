import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./pageLayout.css";
import { useEffect, useState } from 'react';
import API from './API';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Content from './Content';
import LoginForm from './LoginForm';

function App() {

  const [courses, setCourses] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);
  const [expandIncompatible, setExpandIncompatible] = useState([]); // will store an array of codes of the courses on which the expand state is ON for the incompatible courses info
  const [expandPreparatory, setExpandPreparatory] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({ 'type': '-' });

  const [addedCourses, setAddedCourses] = useState([]);     // stores the codes of the courses, not the references to the courses
  const [deletedCourses, setDeletedCourses] = useState([]); // stores the codes of the courses, not the references to the courses

  const [preparatory, setPreparatory] = useState([]);       // contains the codes of the preparatory courses (if present) of the courses in the SP
  // a course cannot be added to SP unless its preparatory course (if any) is present in SP
  // a preparatory course cannot be removed from the SP unless the course having this preparatory course is removed first

  const [message, setMessage] = useState('');
  const [saveAction, setSaveAction] = useState(0);
  const [deleteAction, setDeleteAction] = useState(0);

  const initPreparatory = (sp) => {
    let auxPrep = [];

    sp.forEach(c => {
      if (c.preparatoryCourse)
        auxPrep = [...auxPrep, c.preparatoryCourse];
    });

    setPreparatory(auxPrep);
  }

  useEffect(() => {
    const loadCourses = async () => {
      let c = await API.getAllCourses();
      setCourses(c);
    }

    loadCourses();
  }, [saveAction, deleteAction]);

  useEffect(() => {
    const loadStudyPlan = async () => {
      let c = await API.getStudyPlan(); // codes of the courses in the study plan
      let crs = courses.filter(e => c.includes(e.code));  // courses corresponding to the codes in 'c'
      setStudyPlan(crs);
      initPreparatory(c);
    }

    if (loggedIn === true) {
      loadStudyPlan();
    }
    else {
      setStudyPlan([]);
      setPreparatory([]);
    }
  }, [courses, loggedIn]);

  useEffect(() => {
    const sendModifications = async () => {

      try {

        if (addedCourses.length !== 0 || deletedCourses.length !== 0) {

          let sp = studyPlan.map(c => c.code);
          const msg = await API.putStudyPlan(sp, addedCourses, deletedCourses, user.type);
          setMessage(msg);

          //  reset addedCourses and deletedCourses states
          setAddedCourses([]);
          setDeletedCourses([]);

          // retrieve the updated full course list (nr of enrolled students is updated after saving)
          let c = await API.getAllCourses();
          setCourses(c);

        } else {
          setMessage("There are no courses that have been added or deleted");
        }
      } catch (err) {
        setMessage(err.message);

        let restoredStudyPlan = studyPlan.filter(c => !addedCourses.includes(c.code));
        let removed = courses.filter(c => deletedCourses.includes(c.code));

        restoredStudyPlan = [...restoredStudyPlan, ...removed];
        setStudyPlan(restoredStudyPlan);

        setAddedCourses([]);
        setDeletedCourses([]);

      }
    }

    if (saveAction !== 0)
      sendModifications();

  }, [saveAction]);

  useEffect(() => {
    const deleteStudyPlan = async () => {
      try {
        if (deletedCourses.length !== 0) {
          const msg = await API.deleteStudyPlan(deletedCourses);
          setMessage(msg);
          
          //  reset addedCourses and deletedCourses states
          setAddedCourses([]);
          setDeletedCourses([]);

          // retrieve the updated full course list (nr of enrolled students is updated after saving)
          let c = await API.getAllCourses();
          setCourses(c);

        }else{
          setMessage("No courses to delete");
        }
      }catch (err){
        setMessage(err.message);
      }
    }

    if (deleteAction !== 0)
      deleteStudyPlan();

  }, [deleteAction]);

  const handleLogin = async (username, password) => {
    try {
      const u = await API.login(username, password);
      console.log(u);
      setUser(u);
      setLoggedIn(true);
      setMessage('');
    } catch (err) {
      setMessage("Username and/or password wrong!");
      console.log(err);
    }
  }

  const handleLogout = async () => {
    await API.logout();
    setLoggedIn(false);
    setStudyPlan([]);
    setPreparatory([]);
    setAddedCourses([]);
    setDeletedCourses([]);
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout message={message} setMessage={setMessage} user={user} loggedIn={loggedIn} handleLogout={handleLogout} />}>
          <Route path='/' element={<Content saveAction={saveAction} setSaveAction={setSaveAction} deleteAction={deleteAction} setDeleteAction={setDeleteAction} message={message} setMessage={setMessage} preparatory={preparatory} setPreparatory={setPreparatory} deletedCourses={deletedCourses} setDeletedCourses={setDeletedCourses} addedCourses={addedCourses} setAddedCourses={setAddedCourses} user={user} setUser={setUser} studyPlan={studyPlan} setStudyPlan={setStudyPlan} courses={courses} setCourses={setCourses} expandIncompatible={expandIncompatible} setExpandIncompatible={setExpandIncompatible} expandPreparatory={expandPreparatory} setExpandPreparatory={setExpandPreparatory} loggedIn={loggedIn} />} />
          <Route path='/login' element={loggedIn === false ? <LoginForm handleLogin={handleLogin} /> : <Navigate replace to='/' />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
