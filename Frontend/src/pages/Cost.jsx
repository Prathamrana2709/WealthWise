import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Analysis.css';

function Analysis() {
  const [expenses, setExpenses] = useState([]);
  const [lineYearFilter, setLineYearFilter] = useState(''); // Line chart Year filter
  const [distinctYears, setDistinctYears] = useState([]);
  const [distinctQuarters] = useState(['1', '2', '3', '4']); // Default quarters

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (lineYearFilter) {
      fetchLineChartData();
    }
  }, [lineYearFilter]);

  // Custom sort function for "YYYY-YY" year format
  const sortYears = (years) => {
    return years.sort((a, b) => {
      const yearA = parseInt(a.split('-')[0], 10);
      const yearB = parseInt(b.split('-')[0], 10);
      return yearB - yearA; // Sort in descending order
    });
  };

  const fetchAllData = async () => {
    // Fetch Expenses
    const expenseResponse = await fetch('http://127.0.0.1:5001/api/expenses/getAll');
    const expenseData = await expenseResponse.json();
    setExpenses(expenseData);

    // Get distinct years from expenses
    const years = [...new Set(expenseData.map(item => item.Year))]; // Extract unique years
    setDistinctYears(sortYears(years)); // Sort years in "YYYY-YY" format descending

    // Set the most recent year as the default
    const recentYear = sortYears(years)[0];
    setLineYearFilter(recentYear); // Set default year for line charts
  };

  const fetchLineChartData = async () => {
    const filters = { Year: lineYearFilter };
    const expenseResponse = await fetch(`http://127.0.0.1:5001/api/expenses/filter?Year=${filters.Year}`);
    const filteredExpenses = await expenseResponse.json();
    setExpenses(filteredExpenses);
  };

  // Filter expenses based on the selected year and prepare lineData for each expense category
  const filteredExpenses = expenses
    .filter(exp => exp.Year === lineYearFilter)
    .sort((a, b) => a.Quarter - b.Quarter); // Sort quarters numerically

  const lineData = filteredExpenses.map(exp => ({
    name: `Q${exp["Quarter"]}`,
    EmployeeBenefit: exp['Employee Benefit Expense'],
    Equipment: exp['Cost of Equipment and software Licences'] || exp['Cost of Equipment and Software Licences'],
    Finance: exp['Finance Costs'],
    Depreciation: exp['Depreciation and Amortisation Costs'],
    Other: exp['Other Expenses'],
    Total: exp['Total Expenses']
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '5px',
            color: 'black',
          }}
        >
          {payload.map((item, index) => (
            <div key={index}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{item.name}</p>
              <p style={{ margin: 0 }}>Value: ₹{item.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className='analysis-container'>
      <div><h2>Individual Expense Category Analysis over the Quarters</h2></div>
      {/* Line Chart Year Filter */}
      <div className="filters">
      <h1 className="title-1">Cost</h1>
        <label htmlFor="yearFilter">Filter by Year:</label>
        <select className="year-filter" id="yearFilter" value={lineYearFilter} onChange={(e) => setLineYearFilter(e.target.value)}>
          {distinctYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* LineCharts for Each Expense Category */}

      <div style={{marginTop:'15px'}}><h4>Employee Benefit Expenses</h4></div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip/>}/>
          <Legend />
          <Line type="monotone" dataKey="EmployeeBenefit" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      <div style={{marginTop:'15px'}}><h4>Cost of Equipment and Software Licences</h4></div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip/>}/>
          <Legend />
          <Line type="monotone" dataKey="Equipment" stroke="#82ca9d" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      <div style={{marginTop:'15px'}}><h4>Finance Costs</h4></div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip/>}/>
          <Legend />
          <Line type="monotone" dataKey="Finance" stroke="#ffc658" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      <div style={{marginTop:'15px'}}><h4>Depreciation and Amortisation Expense</h4></div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip/>}/>
          <Legend />
          <Line type="monotone" dataKey="Depreciation" stroke="#FF8042" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      <div style={{marginTop:'15px'}}><h4>Other Expenses</h4></div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip/>}/>
          <Legend />
          <Line type="monotone" dataKey="Other" stroke="#AF19FF" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      <div style={{marginTop:'15px'}}><h4>Total Expenses</h4></div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip/>}/>
          <Legend />
          <Line type="monotone" dataKey="Total" stroke="#AF19FF" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Analysis;
// Sakshi made changes to graph and tooltip , also added total expense , headings