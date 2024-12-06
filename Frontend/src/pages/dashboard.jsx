import React, { useState, Suspense, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import logo from '../assets/Logo.png';
import Liabilities from './Liabilities';
import Nonliabilities from './Nonliabilities';
import Assets from './Assets';
import Nonassets from './Nonassets';
import CashFlow from './CashFlow';
import Noncashflow from './Noncashflow';
import Expenses from './Expense';
import Nonexpense from './Nonexpense';
import AnalysisPage from './Analysis';
import AssetsAndLiabilitiesPage from './AssetsAndLiabilities';
import PredictPage from './Predict';
import DashboardPage from './dashboardPage';
import Cost from './Cost';
import Revenue from './Revenue';
import Nonrevenue from './Nonrevenue';

function Dashboard() {
  const [selectedSection, setSelectedSection] = useState('Dashboard');
  const [selectedSubItem, setSelectedSubItem] = useState('');
  const navigate = useNavigate();

  const role = sessionStorage.getItem('Role');
  const name = sessionStorage.getItem('Name');

  useEffect(() => {}, [role]);

  // Logging utility
  const logAction = async (action) => {
    const logData = {
      username: name,
      role: role,
      action: action,
    };
    await fetch('http://127.0.0.1:5001/api/add-log', {  // Changed port to 5000
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData),
    })
    .then(response => response.json())
    .then(data => console.log('Log success:', data))
    .catch(error => console.error('Log error:', error));
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      sessionStorage.clear();
      logAction('Logged out');
      navigate('/login');
    }
  };

  const handleSectionClick = (section) => {
    setSelectedSubItem('');
    setSelectedSection(section);
  };

  const handleSubItemClick = (subItem) => {
    setSelectedSubItem(subItem);
  };

  const renderContent = () => {
    if (selectedSubItem) {
      switch (selectedSubItem) {
        case 'Liabilities':
          return ['HR', 'Compliance Officer', 'Financial Analyst/Advisor', 'Chief Financial Officer (CFO)', 'Customer Support Lead', 'Compliance Auditor'].includes(role)
            ? <Nonliabilities />
            : <Liabilities />;
        case 'Assets':
          return ['HR', 'Compliance Officer', 'Financial Analyst/Advisor', 'Chief Financial Officer (CFO)', 'Customer Support Lead', 'Compliance Auditor'].includes(role)
            ? <Nonassets />
            : <Assets />;
        case 'Cost':
          return <Cost />;
        case 'Revenue':
          return ['HR', 'Compliance Officer', 'Chief Financial Officer (CFO)', 'Compliance Auditor', 'Customer Support Lead'].includes(role)
            ? <Nonrevenue />
            : <Revenue />;
        default:
          return <p>No component available for this sub-item</p>;
      }
    } else {
      switch (selectedSection) {
        case 'Dashboard':
          return <DashboardPage />;
        case 'Assets And Liabilities':
          return <AssetsAndLiabilitiesPage />;
        case 'Analysis':
          return <AnalysisPage />;
        case 'Predict':
          return <PredictPage />;
        case 'Expenses':
          return ['HR', 'Compliance Officer', 'Financial Analyst/Advisor', 'Chief Financial Officer (CFO)', 'Compliance Auditor'].includes(role)
            ? <Nonexpense />
            : <Expenses />;
        case 'Cash Flow':
          return ['HR', 'Compliance Officer', 'Financial Analyst/Advisor', 'Chief Financial Officer (CFO)', 'Customer Support Lead', 'Compliance Auditor'].includes(role)
            ? <Noncashflow />
            : <CashFlow />;
        default:
          return <p>No component available for this section</p>;
      }
    }
  };

  const sections = {
    Dashboard: { allowedRoles: ['HR', 'Finance Manager', 'Data Analyst/Scientist', 'Financial Analyst/Advisor', 'Chief Financial Officer (CFO)', 'Customer Support Lead', 'Compliance Auditor'], subItems: [] },
    Analysis: { allowedRoles: ['HR', 'Financial Controller', 'Finance Manager', 'Chief Financial Officer (CFO)', 'Data Analyst/Scientist', 'Compliance Officer', 'Financial Analyst/Advisor', 'Budget Analyst', 'Compliance Auditor', 'Customer Support Lead'], subItems: ['Cost', 'Revenue'] },
    Predict: { allowedRoles: ['HR', 'Finance Manager', 'Chief Financial Officer (CFO)', 'Data Analyst/Scientist', 'Financial Analyst/Advisor'], subItems: [] },
    'Assets And Liabilities': { allowedRoles: ['HR', 'Finance Manager', 'Financial Controller', 'Chief Financial Officer (CFO)', 'Compliance Officer', 'Financial Analyst/Advisor', 'Treasury Manager', 'Customer Support Lead', 'Compliance Auditor'], subItems: ['Assets', 'Liabilities'] },
    'Cash Flow': { allowedRoles: ['HR', 'Finance Manager', 'Financial Controller', 'Chief Financial Officer (CFO)', 'Data Analyst/Scientist', 'Compliance Officer', 'Financial Analyst/Advisor', 'Treasury Manager', 'Customer Support Lead', 'Compliance Auditor'], subItems: [] },
    Expenses: { allowedRoles: ['HR', 'Finance Manager', 'Financial Controller', 'Chief Financial Officer (CFO)', 'Data Analyst/Scientist', 'Compliance Officer', 'Financial Analyst/Advisor', 'Budget Analyst', 'Compliance Auditor'], subItems: [] },
  };

  return (
    <div className="dashboard">
      <div className="left-navbar">
        <div className="logo">
          <img src={logo} alt="logo" />
          <span>WealthWise</span>
        </div>
        <div className="section-margin">
          {Object.keys(sections).map((section) => (
            sections[section].allowedRoles.includes(role) && (
              <div key={section} className="section">
                <div className="section-title" onClick={() => handleSectionClick(section)}>
                  {section}
                </div>
                {selectedSection === section && (
                  <div className="sub-section">
                    {sections[section].subItems.map((sub) => (
                      <div
                        key={sub}
                        className="sub-item"
                        onClick={() => handleSubItemClick(sub)}
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      </div>
      <div className="main-content">
        <div className="top-navbar">
          {role === 'HR' && (
            <Link to="/AddNewMember">
              <button className="new-btn">Users</button>
            </Link>
          )}
          <button onClick={handleLogout} className="logout-btn">Logout</button>
          <div className="profile">
            <strong>{name}</strong>
            <span className="user-role">{role}</span>
          </div>
        </div>
        <div className="content">
          <Suspense fallback={<div>Loading...</div>}>{renderContent()}</Suspense>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
