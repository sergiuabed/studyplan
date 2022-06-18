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
    }

    if(loggedIn === true)
      loadStudyPlan();
    else
      setStudyPlan([]);
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
    //setExpandIncompatible([]);
    //setExpandPreparatory([]);
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout user={user} loggedIn={ loggedIn } handleLogout={handleLogout}/>}>
          <Route path='/' element={<Content user={user} studyPlan={studyPlan} courses={courses} expandIncompatible={expandIncompatible} setExpandIncompatible={setExpandIncompatible} expandPreparatory={expandPreparatory} setExpandPreparatory={setExpandPreparatory} loggedIn={loggedIn}/>} />
          <Route path='/login' element={loggedIn===false ? <LoginForm handleLogin={handleLogin}/> : <Navigate replace to='/' />} />{/* '/login' path is not accessible while a user is logged in. It becomes accessible after logout */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
