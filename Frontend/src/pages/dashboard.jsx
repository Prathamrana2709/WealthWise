import React, { useState } from 'react';
import '../styles/dashboard.css';
import logo from '../assets/Logo.png';

function Dashboard() {
  const [selectedSection, setSelectedSection] = useState('Dashboard');

  const sections = {
    Dashboard: [],
    Analysis: [
      'Cost', 'Revenue', 'Demand', 'Economic Indicators', 'Dept. Budget', 'Customer', 'Return to Equity', 'Budgeted vs Actual', 'Sales', 'Profits/Loss'
    ],
    Predict: [
    //   'After taking the input the algorithm will run and give the prediction, conclusion, risk analysis and all the details'
    ],
    'Shareholders & Partners': [
      'Debt', 'Equity', 'Investments', 'Bonds', 'Taxes', 'Interest Rate related to it', 'Insurance'
    ],
    'Assets and Liabilities': [
      'Current Assets', 'Non-Current Assets', 'Current Liabilities', 'Non-Current Liabilities'
    ],
    'Cash Flow': [
      'Inflow', 'Outflow'
    ],
    Project: [
      'Active Projects (Analysis) -> Ongoing', 'Add Projects -> Assign Project Manager'
    ],
    Revenue: [
      'Add (Filter)', 'Region', 'Product', 'Customer Segment', 'Sales Channel', 'Total Given (Pending & Completed)'
    ],
    Expenses: [
      'Costs (Check Boxes & Add Field in Table if New)', 'Descriptions'
    ]
  };

  const handleSectionClick = (section) => {
    if (selectedSection === section) {
      setSelectedSection('Dashboard');
    } else {
      setSelectedSection(section);
    }
  };

  return (
    <div className="dashboard">

      <div className="left-navbar">
      <div className="logo">
            <img src={logo}></img>
            <span>WealthWise</span>
        </div>
        
        {Object.keys(sections).map(section => (
          <div key={section} className="section">
            <div className="section-title" onClick={() => handleSectionClick(section)}>
              {section}
            </div>
            {selectedSection === section && (
              <div className="sub-section">
                {sections[section].map(sub => (
                  <div key={sub} className="sub-item">{sub}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="main-content">
        <div className="top-navbar">
          <div className="profile">Profile</div>
        </div>
        <div className="content">
          <h1>{selectedSection}</h1>
          <p>Content for {selectedSection}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;