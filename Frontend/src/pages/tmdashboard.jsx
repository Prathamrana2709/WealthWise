import React, { useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';
import logo from '../assets/Logo.png';
import Liabilities from './Liabilities';
import Assets from './Assets';
import CashFlow from './CashFlow';


// Dynamically import subcategory and main category components
const DashboardPage = React.lazy(() => import('./dashboardPage'));
const AnalysisPage = React.lazy(() => import('./Analysis'));
const PredictPage = React.lazy(() => import('./Predict'));
const AssetsLiabilitiesPage = React.lazy(() => import('./AssetsAndLiabilities'));
const CashFlowPage = React.lazy(() => import('./CashFlow'));
// const ProjectPage = React.lazy(() => import('./Project'));
const RevenuePage = React.lazy(() => import('./Revenue'));
const ExpensesPage = React.lazy(() => import('./Expense'));

// Sub-Components for subcategories
// const CostAnalysis = React.lazy(() => import('../components/CostAnalysis'));
// const RevenueAnalysis = lazy(() => import('../components/RevenueAnalysis'));
// const RiskPrediction = lazy(() => import('../components/RiskPrediction'));
// const OutcomeAnalysis = lazy(() => import('../components/OutcomeAnalysis'));

function Dashboard() {
  const [selectedSection, setSelectedSection] = useState('Dashboard'); // should be a string

  const [selectedSubItem, setSelectedSubItem] = useState('');

  const sections = {
    Dashboard: [],
   
    'Assets and Liabilities': [
      'Assets', 'Liabilities'
    ],
    'Cash Flow': [],
    
   
  };

  const handleSectionClick = (section) => {
    setSelectedSubItem(''); // Reset sub-item when a new section is clicked
    setSelectedSection(section);
  };

  const handleSubItemClick = (subItem) => {
    setSelectedSubItem(subItem); // Update the state with the selected sub-item
  };

  // Function to dynamically load the correct component based on selected item
  const renderContent = () => {
    if (selectedSubItem) {
      switch (selectedSubItem) {
        case 'Liabilities':
          return <Liabilities />;
        case 'Assets':
          return <Assets />;
       
        case 'Cashflow':
          return <CashFlow />;
        
       
        default:
          return <p>No component available for this sub-item</p>;
      }
    } else {
      switch (selectedSection) {
       
        case 'Assets and Liabilities':
          return <AssetsLiabilitiesPage />;
        case 'Cash Flow':
          return <CashFlowPage />;
       

        default:
          return <p>No component available for this section</p>;
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="left-navbar">
        <div className="logo">
          <img src={logo} alt="logo" />
          <span>WealthWise</span>
        </div>

        <div className='section-margin'>
          {Object.keys(sections).map((section) => (
            <div key={section} className="section">
              <div className="section-title" onClick={() => handleSectionClick(section)}>
                {section}
              </div>
              {selectedSection === section && (
                <div className="sub-section">
                  {sections[section].map((sub) => (
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
          ))}

        </div>
      </div>

      <div className="main-content">
        <div className="top-navbar">
         
          <Link to='/login'><button className='logout-btn'>Logout</button></Link>
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
