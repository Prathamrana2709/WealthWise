import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import AddNewMember from './pages/AddNewMember';
import Dashboard1 from './pages/dashboard1';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/AddNewMember" element={<AddNewMember />} />
        <Route path="/dashboard1" element={<Dashboard1 />}/>
      </Routes>
    </Router>
  );
}

export default App;
