import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Analysis.css';

function Analysis() {
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [pieYearFilter, setPieYearFilter] = useState(''); // Pie chart Year filter
  const [pieQuarterFilter, setPieQuarterFilter] = useState('1'); // Pie chart Quarter filter
  const [lineYearFilter, setLineYearFilter] = useState(''); // Line chart Year filter
  const [distinctYears, setDistinctYears] = useState([]);
  const [distinctQuarters] = useState(['1', '2', '3', '4']); // Default quarters

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  useEffect(() => {
    // Fetch initial data for both expenses and revenues
    fetchAllData();
  }, []);

  useEffect(() => {
    // Automatically fetch Pie chart data when year or quarter changes
    if (pieYearFilter) {
      fetchPieChartData();
    }
  }, [pieYearFilter, pieQuarterFilter]);

  useEffect(() => {
    // Automatically fetch Line chart data when year changes
    if (lineYearFilter) {
      fetchLineChartData();
    }
  }, [lineYearFilter]);

  // Fetch all revenues and expenses
  const fetchAllData = async () => {
    // Fetch Revenues
    const revenueResponse = await fetch('http://127.0.0.1:5001/api/revenues/getAll');
    const revenueData = await revenueResponse.json();
    setRevenues(revenueData);

    // Fetch Expenses
    const expenseResponse = await fetch('http://127.0.0.1:5001/api/expenses/getAll');
    const expenseData = await expenseResponse.json();
    setExpenses(expenseData);

    // Get distinct years from revenues
    const years = [...new Set(revenueData.map(item => item.Year))]; // Extract unique years
    setDistinctYears(years.sort((a, b) => b - a)); // Sort descending

    // Find the most recent year and set it as default for both charts
    const recentYear = years[0]; // Get the latest year
    setPieYearFilter(recentYear);
    setLineYearFilter(recentYear);
  };

  // Fetch filtered data for the Pie chart (based on year and quarter)
  const fetchPieChartData = async () => {
    const filters = {
      Year: pieYearFilter,
      Quarter: pieQuarterFilter
    };

    const expenseResponse = await fetch(`http://127.0.0.1:5001/api/expenses/filter?Year=${filters.Year}&Quarter=${filters.Quarter}`);
    const filteredExpenses = await expenseResponse.json();
    setExpenses(filteredExpenses);
  };

  // Fetch filtered data for the Line chart (based on year)
  const fetchLineChartData = async () => {
    const filters = {
      Year: lineYearFilter
    };

    const revenueResponse = await fetch(`http://127.0.0.1:5001/api/revenues/filter?Year=${filters.Year}`);
    const filteredRevenues = await revenueResponse.json();
    setRevenues(filteredRevenues);
  };

  // Filtered data for the Pie chart (expenses)
  // const pieData = expenses.map(exp => ({
  //   // name: 'Expenses',
  //   EmployeeBenefit: exp['Employee Benefit Expense'],
  //   Equipment: exp['Cost of Equipment and software Licences'],
  //   Finance: exp['Finance Costs'],
  //   Depreciation: exp['Depreciation and Amortisation Costs'],
  //   Other: exp['Other Expenses']
  // }));

  // Prepare pieData with correct format: { name, value }
  const pieData = [
    { name: 'Employee Benefit', value: expenses.reduce((acc, exp) => acc + (exp['Employee Benefit Expense'] || 0), 0) },
    { name: 'Equipment', value: expenses.reduce((acc, exp) => acc + (exp['Cost of Equipment and software Licences'] || 0), 0) },
    { name: 'Finance', value: expenses.reduce((acc, exp) => acc + (exp['Finance Costs'] || 0), 0) },
    { name: 'Depreciation', value: expenses.reduce((acc, exp) => acc + (exp['Depreciation and Amortisation Costs'] || 0), 0) },
    { name: 'Other', value: expenses.reduce((acc, exp) => acc + (exp['Other Expenses'] || 0), 0) }
  ];


  // Filtered data for the Line chart (revenues by quarter)
  const lineData = revenues.map(rev => ({
    name: `Q${rev["Quarter"]}`,
    TotalRevenue: rev['Total Revenue']
  }));

  console.log('Pie Data:', pieData);

  {pieData.map((entry, index) => {
    console.log(entry); // This will log each entry
    return (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    );
  })}
  

  return (
    <div className='analysis-container'>
      <h1 className="title-1">Analysis</h1>

      {/* Filters for PieChart */}
      <div className="filters">
        {/* Pie Chart Year Filter */}
        <select value={pieYearFilter} onChange={(e) => setPieYearFilter(e.target.value)}>
          {distinctYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Pie Chart Quarter Filter */}
        <select value={pieQuarterFilter} onChange={(e) => setPieQuarterFilter(e.target.value)}>
          {distinctQuarters.map((quarter) => (
            <option key={quarter} value={quarter}>
              Q{quarter}
            </option>
          ))}
        </select>
      </div>

      {/* PieChart for Expenses */}
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>


      {/* Filters for LineChart */}
      <div className="filters">
        {/* Line Chart Year Filter */}
        <select value={lineYearFilter} onChange={(e) => setLineYearFilter(e.target.value)}>
          {distinctYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* LineChart for Revenues */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="TotalRevenue" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
      <br /><br /><br />
      <div></div>
    </div>
  );
}

export default Analysis;
