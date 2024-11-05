

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import AddNewMember from './pages/AddNewMember'; // Assuming this component exists for adding new users

function App() {
  // Check if the user is logged in by checking for a stored role in session storage
  const isAuthenticated = () => {
    return sessionStorage.getItem('Role') !== null;
  };

  return (
    <Router>
    <Routes>
      {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Route for Dashboard */}
      <Route
        path="/dashboard"
        element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />}
      />

      {/* Protected Route for AddNewMember (only accessible by certain roles) */}
      <Route
        path="/AddNewMember"
        element={isAuthenticated() ? <AddNewMember /> : <Navigate to="/login" replace />}
      />

      {/* Redirect any other routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
  );
}

export default App;
