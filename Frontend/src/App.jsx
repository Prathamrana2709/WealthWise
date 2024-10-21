import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import AddNewMember from './pages/AddNewMember';
import Fmdashboard from './pages/fmdashboard';
import Badashboard from './pages/badashboard';
import Dasdashboard from './pages/dasdashboard';
import Fdashboard from './pages/fdashboard';
import Tmdashboard from './pages/tmdashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/AddNewMember" element={<AddNewMember />} />
        <Route path="/fmdashboard" element={<Fmdashboard />}/>
        <Route path="/dasdashboard" element={<Dasdashboard />}/>
        <Route path="/fdashboard" element={<Fdashboard />}/>
        <Route path="/badashboard" element={<Badashboard />}/>
        <Route path="/tmdashboard" element={<Tmdashboard />}/>
        {/* <Route path="/badashboard" element={<Badashboard />}/>
        <Route path="/dasdashboard" element={<Dasdashboard />}/>
        <Route path="/faadashboard" element={<FAADashboard />}/>
        <Route path="/tmdashboard" element={<Tmdashboard />}/> */}
      </Routes>
    </Router>
  );
}

export default App;
