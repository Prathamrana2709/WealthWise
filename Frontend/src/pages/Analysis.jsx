import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import '../styles/analysis.css';

function Analysis() {
  // Dummy data for demonstration purposes
  const budgetData = [
    { month: 'Jan', budget: 20000, actual: 18000 },
    { month: 'Feb', budget: 22000, actual: 24000 },
    { month: 'Mar', budget: 25000, actual: 23000 },
    { month: 'Apr', budget: 27000, actual: 26000 },
    { month: 'May', budget: 30000, actual: 28000 },
  ];

  const profitLossData = [
    { category: 'Revenue', amount: 120000 },
    { category: 'Expenses', amount: 90000 },
    { category: 'Net Profit', amount: 30000 },
  ];

  const salesFunnelData = [
    { stage: 'Leads', count: 1000 },
    { stage: 'Opportunities', count: 400 },
    { stage: 'Proposals', count: 200 },
    { stage: 'Closed Won', count: 100 },
  ];

  const financialRatios = [
    { ratio: 'Current Ratio', value: '2.5' },
    { ratio: 'Quick Ratio', value: '1.8' },
    { ratio: 'Debt to Equity', value: '0.5' },
  ];

  const customerSegments = [
    { segment: 'Retail', contribution: '50%' },
    { segment: 'Wholesale', contribution: '30%' },
    { segment: 'Online', contribution: '20%' },
  ];

  // Dummy data for sales by region
  const salesByRegionData = [
    { region: '2024', sales: 30000 },
    { region: '2023', sales: 25000 },
    { region: '2022', sales: 40000 },
    { region: '2021', sales: 35000 },
  ];

  return (
    <div className="analysis-page">
      <h1>Analysis Dashboard</h1>

      {/* Top Section: Budget vs Actual */}
      <div className="top-section">
        <div className="chart-container">
          <h2 className='title-1'>Budget vs Actual</h2>
          <div className="line-chart">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="budget" stroke="#8884d8" name="Budget" />
                <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="kpis">
            <div className="kpi">
              <h3 className='title-1'>Total Budget</h3>
              <p>${budgetData.reduce((total, data) => total + data.budget, 0).toLocaleString()}</p>
            </div>
            <div className="kpi">
              <h3 className='title-1'>Total Actual</h3>
              <p>${budgetData.reduce((total, data) => total + data.actual, 0).toLocaleString()}</p>
            </div>
            <div className="kpi">
              <h3 className='title-1'>Variance</h3>
              <p>
                ${budgetData.reduce((total, data) => total + (data.budget - data.actual), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Profit & Loss and Sales Analysis */}
      <div className="middle-section">
        <div className="profit-loss">
          <h2 className='title-1'>Profit and Loss Statement</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {profitLossData.map((item) => (
                <tr key={item.category}>
                  <td>{item.category}</td>
                  <td>${item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sales-analysis">
          <h2 className='title-1'>Sales by Region/Product</h2>
          <div className="sales-region">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByRegionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Financial Ratios and Customer Segmentation */}
      <div className="bottom-section">
        <div className="financial-ratios">
          <h2 className='title-1'>Financial Ratios</h2>
          <table>
            <thead>
              <tr>
                <th>Ratio</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {financialRatios.map((item) => (
                <tr key={item.ratio}>
                  <td>{item.ratio}</td>
                  <td>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <br></br><br></br><br></br>
    </div>
  );
}

export default Analysis;
