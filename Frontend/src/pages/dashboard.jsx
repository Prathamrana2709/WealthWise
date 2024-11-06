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
import DashboardPage from './DashboardPage';
import Cost from './Cost';
import Revenue from './Revenue';
import Nonrevenue from './Nonrevenue';

function Dashboard() {
  const [selectedSection, setSelectedSection] = useState('Dashboard');
  const [selectedSubItem, setSelectedSubItem] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const role = sessionStorage.getItem('Role');
  const name = sessionStorage.getItem('Name');

  useEffect(() => {
    console.log("Role in Dashboard:", role);
  }, [role]);
  

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
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
          return ['Compliance Officer','Financial Analyst/Advisor', 'Chief Financial Officer (CFO)','Customer Support Lead','Compliance Auditor'].includes(role) ? <Nonliabilities /> : ['Finance Manager', 'Financial Controller','Treasury Manager'].includes(role) ? <Liabilities /> : <p>No access</p>;
          case 'Assets':
            return ['Compliance Officer', 'Financial Analyst/Advisor', 'Chief Financial Officer (CFO)','Customer Support Lead','Compliance Auditor'].includes(role)? <Nonassets />
              : ['Finance Manager', 'Chief Financial Officer (CFO)', 'Financial Controller', 'Treasury Manager'].includes(role)? <Assets />: <p>No access</p>;
        case 'Cost':
          return role === 'Finance Manager' || role === 'Chief Financial Officer (CFO)' || role ==='Financial Controller' || role ==='Data Analyst/Scientist' || role ==='Compliance Officer' || role ==='Financial Analyst/Advisor'||role==='Budget Analyst'|| role==='Compliance Auditor' ? <Cost /> : <p>No access</p>;
        case 'Revenue':
          return ['Data Analyst/Scientist', 'Compliance Officer', 'Chief Financial Officer (CFO)','Compliance Auditor'].includes(role) ? <Nonrevenue /> : ['Finance Manager', 'Chief Financial Officer (CFO)', 'Financial Controller','Financial Analyst/Advisor','Budget Analyst'].includes(role) ? <Revenue /> : <p>No access</p>;
        default:
          return <p>No component available for this sub-item</p>;
      }
    } else {
      switch (selectedSection) {
        case 'Dashboard':
          return <DashboardPage />;
        case 'AssetsAndLiabilities':  
          return role === 'Finance Manager' || role === 'Chief Financial Officer (CFO)' || role ==='Compliance Officer'|| role ==='Financial Controller'|| role==='Treasury Manager'||role==='Customer Support Lead'|| role==='Compliance Auditor' ? <AssetsAndLiabilitiesPage /> : <p>No access</p>;
        case 'Analysis':
          return role === 'Finance Manager' || role === 'Chief Financial Officer (CFO)' || role ==='Financial Controller' || role ==='Data Analyst/Scientist' || role ==='Compliance Officer' || role ==='Financial Analyst/Advisor'|| role ==='Budget Analyst' || role==='Compliance Auditor' ?  <AnalysisPage /> : <p>No access</p>;
        case 'Predict':
          return role === 'Finance Manager' || role === 'Chief Financial Officer (CFO)' || role ==='Data Analyst/Scientist' || role ==='Financial Analyst/Advisor' ? <PredictPage /> : <p>No access</p>;
        case 'Expenses':
          return ['Data Analyst/Scientist', 'Compliance Officer','Financial Analyst/Advisor', 'Chief Financial Officer (CFO)','Compliance Auditor'].includes(role) ? <Nonexpense /> : ['Finance Manager', 'Financial Controller','Budget Analyst'].includes(role) ? <Expenses /> : <p>No access</p>;
        case 'Cash Flow':
          return ['Data Analyst/Scientist', 'Compliance Officer','Financial Analyst/Advisor', 'Chief Financial Officer (CFO)','Customer Support Lead','Compliance Auditor'].includes(role) ? <Noncashflow /> : ['Finance Manager', 'Financial Controller','Treasury Manager'].includes(role) ? <CashFlow /> : <p>No access</p>;
        default:
          return <p>No component available for this section</p>;
      }
    }
  };

  const sections = {
    Dashboard: { allowedRoles: ['HR', 'Finance Manager','Data Analyst/Scientist','Financial Analyst/Advisor','Chief Financial Officer (CFO)','Customer Support Lead','Compliance Auditor'], subItems: [] },
    Analysis: { allowedRoles: ['HR','Financial Controller','Finance Manager','Chief Financial Officer (CFO)' ,'Data Analyst/Scientist','Compliance Officer','Financial Analyst/Advisor','Budget Analyst','Compliance Auditor'], subItems: ['Cost', 'Revenue'] },
    Predict: { allowedRoles: ['HR','Finance Manager','Chief Financial Officer (CFO)','Data Analyst/Scientist','Financial Analyst/Advisor'], subItems: [] },
    AssetsAndLiabilities: { allowedRoles: ['Finance Manager', 'HR','Financial Controller','Chief Financial Officer (CFO)','Compliance Officer','Financial Analyst/Advisor','Treasury Manager','Customer Support Lead','Compliance Auditor'], subItems: ['Assets', 'Liabilities'] },
    'Cash Flow': { allowedRoles: ['Finance Manager', 'HR','Financial Controller','Chief Financial Officer (CFO)','Data Analyst/Scientist','Compliance Officer','Financial Analyst/Advisor','Treasury Manager','Customer Support Lead','Compliance Auditor'], subItems: [] },
    Expenses: { allowedRoles: ['Finance Manager', 'HR','Financial Controller','Chief Financial Officer (CFO)','Data Analyst/Scientist','Compliance Officer','Financial Analyst/Advisor','Budget Analyst','Compliance Auditor'], subItems: [] },
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
          {[ 'HR', 'Chief Financial Officer (CFO)'].includes(role) && (
            <Link to='/AddNewMember'><button className='new-btn'>Users</button></Link>
          )}
          <button onClick={handleLogout} className="logout-btn">Logout</button>
          <div className="profile">
            <strong>{name}</strong>
            <span className="user-role">{role}</span>
          </div>
        </div>
        <div className="content">
          <Suspense fallback={<div>Loading...</div>}>
            {renderContent()}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
