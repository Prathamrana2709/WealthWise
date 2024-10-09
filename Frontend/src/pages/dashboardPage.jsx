import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/dashboardPage.css';

const DashboardPage = () => {
  // Dummy data for cards, graph, and projects
  const revenueData = [
    { month: 'Q1', value: 10000 },
    { month: 'Q2', value: 12000 },
    { month: 'Q3', value: 14000 },
    { month: 'Q4', value: 9000 }
  ];

  const projects = [
    { name: 'Project Alpha', date: '1 March 2023', status: 'In Progress' },
    { name: 'Project Beta', date: '15 April 2023', status: 'Completed' },
    { name: 'Project Gamma', date: '30 May 2023', status: 'In Progress' },
    { name: 'Project Delta', date: '10 June 2023', status: 'On Hold' },
  ];

  return (
    <div className="dashboard-page">
      {/* Top Section with Cards and Graph */}
      <div className="top-section">
        {/* Cards */}
        <div className="card-container">
          <div className="card">
            <div className="card-title">Income</div>
            <div className="card-amount">INR 35.9K</div>
          </div>
          <div className="card">
            <div className="card-title">Upcoming</div>
            <div className="card-amount">INR 45.7K</div>
          </div>
          <div className="card">
            <div className="card-title">Expense</div>
            <div className="card-amount">INR 38.5K</div>
          </div>
        </div>

        {/* Revenue Graph */}
        <div className="revenue-graph">
          <h3>Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#41e0ce" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section with Cash Flow and Projects */}
      <div className="bottom-section">
        {/* Cash Flow */}
        <div className="cash-flow">
          <h3 className='title-1'>Cash Flow</h3>
          <div className="cash-flow-card">
            <div className="cash-inflow">
              <h4>Inflow</h4>
              <p>INR 45,000</p>
            </div>
            <div className="cash-outflow">
              <h4>Outflow</h4>
              <p>INR 20,000</p>
            </div>
          </div>
          <div>2024-25</div>
        </div>

        {/* Projects Section */}
        <div className="projects-section">
          <h3><span className='title-1'>Project</span></h3>
          <table>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.name}>
                  <td>{project.name}</td>
                  <td>{project.date}</td>
                  <td>{project.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <br></br><br></br><br></br>
    </div>
  );
};

export default DashboardPage;
