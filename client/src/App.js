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
  const [user, setUser] = useState(undefined);

  const [addedCourses, setAddedCourses] = useState([]);     // stores the codes of the courses, not the references to the courses
  const [deletedCourses, setDeletedCourses] = useState([]); // stores the codes of the courses, not the references to the courses

  const [incompatible, setIncompatible] = useState([]);     // when adding a new course to the SP(study plan), the codes of all its incompatible courses are added to this state
                                                            // when a course is removed from the SP, the codes of its incompatible courses are removed from 'incompatible'
  
  const [preparatory, setPreparatory] = useState([]);       // contains the codes of the preparatory courses (if present) of the courses in the SP
                                                            // a course cannot be added to SP unless its preparatory course (if any) is present in SP
                                                            // a preparatory course cannot be removed from the SP unless the course having this preparatory course is removed first

  const initPreparatoryIncompatible = (sp) => {
    let auxIncomp = [];
    let auxPrep = [];

    sp.forEach(c => {
      if(c.incompatibleWith)
        auxIncomp = [...auxIncomp, ...c.incompatibleWith];
    });
    
    sp.forEach(c => {
      if(c.preparatoryCourse)
        auxPrep = [...auxPrep, c.preparatoryCourse];
    });

    setIncompatible(auxIncomp);
    setPreparatory(auxPrep);
  }

  useEffect(() => {
    const loadCourses = async () => {
      let c = await API.getAllCourses();
      setCourses(c);
    }

    loadCourses();
  }, []);

  useEffect(() => { // MODIFY THIS ACCORDINGLY WHEN IMPLEMENTING THE USER SESSIONS
    const loadStudyPlan = async () => {
      let c = await API.getStudyPlan();
      setStudyPlan(c);
      initPreparatoryIncompatible(c);
    }

    if(loggedIn === true){
      loadStudyPlan();
    }
    else{
      setStudyPlan([]);
      setIncompatible([]);
      setPreparatory([]);
    }
  }, [loggedIn]);

  const handleLogin = async (username, password) => {
    try{
      const u = await API.login(username, password);
      console.log(u);
      setUser(u);
      setLoggedIn(true);
    }catch(err){
      console.log(err);
    }
  }

  const handleLogout = async () => {
    await API.logout();
    setLoggedIn(false);
    setStudyPlan([]);
    setIncompatible([]);
    setPreparatory([]);
    //setExpandIncompatible([]);
    //setExpandPreparatory([]);
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout user={user} loggedIn={ loggedIn } handleLogout={handleLogout}/>}>
          <Route path='/' element={<Content incompatible={incompatible} preparatory={preparatory} deletedCourses={deletedCourses} setDeletedCourses={setDeletedCourses} addedCourses={addedCourses} setAddedCourses={setAddedCourses } user={user} studyPlan={studyPlan} setStudyPlan={setStudyPlan} courses={courses} expandIncompatible={expandIncompatible} setExpandIncompatible={setExpandIncompatible} expandPreparatory={expandPreparatory} setExpandPreparatory={setExpandPreparatory} loggedIn={loggedIn}/>} />
          <Route path='/login' element={loggedIn===false ? <LoginForm handleLogin={handleLogin}/> : <Navigate replace to='/' />} />{/* '/login' path is not accessible while a user is logged in. It becomes accessible after logout */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
