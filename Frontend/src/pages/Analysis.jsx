import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Analysis.css';

function Analysis() {
  const [revenues, setRevenues] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]); // Store all expenses
  const [pieData, setPieData] = useState([]); // Pie chart data
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
    if (pieYearFilter && pieQuarterFilter) {
      const filteredExpenses = allExpenses.filter(
        (expense) =>
          expense.Year === pieYearFilter && expense.Quarter === parseInt(pieQuarterFilter)
      );

      if (filteredExpenses.length > 0) {
        const expense = filteredExpenses[0];
        const newPieData = [
          { name: 'Employee Benefit Expense', value: expense['Employee Benefit Expense'] || 0 },
          { name: 'Cost of Equipment and Software Licences', value: expense['Cost of Equipment and software Licences'] || expense['Cost of Equipment and Software Licences'] || 0 },
          { name: 'Finance Costs', value: expense['Finance Costs'] || 0 },
          { name: 'Depreciation and Amortisation Costs', value: expense['Depreciation and Amortisation Costs'] || 0 },
          { name: 'Other Expenses', value: expense['Other Expenses'] || 0 },
        ];
        setPieData(newPieData);
      } else {
        setPieData([]); // No matching data
      }
    }
  }, [pieYearFilter, pieQuarterFilter, allExpenses]);

  useEffect(() => {
    // Automatically fetch Line chart data when year changes
    if (lineYearFilter) {
      fetchLineChartData();
    }
  }, [lineYearFilter]);

  // Fetch all revenues and expenses
  const fetchAllData = async () => {
    try {
      const revenueResponse = await fetch('http://127.0.0.1:5001/api/revenues/getAll');
      const revenueData = await revenueResponse.json();
      setRevenues(revenueData);

      const expenseResponse = await fetch('http://127.0.0.1:5001/api/expenses/getAll');
      const expenseData = await expenseResponse.json();
      setAllExpenses(expenseData); // Store all expenses

      // Get distinct years from revenues
      const years = [...new Set(revenueData.map(item => item.Year))]; // Extract unique years
      setDistinctYears(years.sort((a, b) => parseInt(b.split('-')[0]) - parseInt(a.split('-')[0])));

      // Set initial filters (most recent year and first quarter)
      const recentYear = years[0]; // Get the latest year
      setPieYearFilter(recentYear);
      setLineYearFilter(recentYear);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch filtered data for the Line chart (based on year)
  const fetchLineChartData = async () => {
    const revenueResponse = await fetch(`http://127.0.0.1:5001/api/revenues/filter?Year=${lineYearFilter}`);
    const filteredRevenues = await revenueResponse.json();
    setRevenues(filteredRevenues);
  };

  // Prepare lineData with correct format: { name, TotalRevenue }
  const lineData = revenues.map(rev => ({
    name: `Q${rev["Quarter"]}`,
    TotalRevenue: rev['Total Revenue']
  })).sort((a, b) => parseInt(a.name.split('Q')[1]) - parseInt(b.name.split('Q')[1]));

  // Conditionally render PieChart
  const renderPieChart = () => {
    if (pieData.length === 0) {
      return <p>No data available for the selected filters.</p>;
    }


    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart className='color-pie'>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={180}
            // label={({ value }) => `${value}`} // Black text for labels
            labelStyle={{ fill: 'black' }} // Force black color for text
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className='analysis-container'>
      {/* Filters for PieChart */}
      <div className="filters">
        {/* Pie Chart Year Filter */}
        <h1 className="title-1">Analysis</h1>
        <label htmlFor="yearFilter">Filter by Year:</label>
        <select value={pieYearFilter} onChange={(e) => setPieYearFilter(e.target.value)}>
          {distinctYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Pie Chart Quarter Filter */}
        <label htmlFor="yearFilter">Filter by Quarter:</label>
        <select value={pieQuarterFilter} onChange={(e) => setPieQuarterFilter(e.target.value)}>
          {distinctQuarters.map((quarter) => (
            <option key={quarter} value={quarter}>
              Q{quarter}
            </option>
          ))}
        </select>
      </div>

      {/* PieChart for Expenses */}
      {renderPieChart()}
      <div className="color-description">
  <ul 
    style={{ 
      listStyleType: 'none', 
      padding: 0, 
      display: 'flex', 
      flexWrap: 'wrap',  // Allows wrapping if the items exceed the width
      justifyContent: 'center',  // Horizontally align the items
      margin: '2em 0'  // Add spacing from the pie chart
    }}
  >
    {pieData.map((entry, index) => (
      <li 
        key={index} 
        style={{ 
          display: 'flex',
          alignItems: 'center',  // Vertically align the items
          margin: '10px'  // Add spacing between rows
        }}
      >
        {/* Color box */}
        <div
          style={{
            width: '15px',
            height: '15px',
            backgroundColor: COLORS[index % COLORS.length],
            marginRight: '10px',
            borderRadius: '3px'
          }}
        ></div>

        {/* Description text with value */}
        <span style={{ color: 'black', marginRight: '5px' }}>
          {entry.name}:
        </span>
        <span style={{ color: 'black', fontWeight: 'bold' }}>
          {entry.value.toLocaleString()}
        </span>
      </li>
    ))}
  </ul>
</div>




      {/* Filters for LineChart */}
      <div className="filters">
        {/* Line Chart Year Filter */}
        <label htmlFor="yearFilter">Filter by Year:</label>
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
          <YAxis label={{ value: "(Millions)", angle:0, position: "insideBottom", offset: 15 }} width={80} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="TotalRevenue" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Analysis;
