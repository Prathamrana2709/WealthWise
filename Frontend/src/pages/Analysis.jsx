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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
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
        setPieData([]);
      }
    }
  }, [pieYearFilter, pieQuarterFilter, allExpenses]);

  useEffect(() => {
    if (lineYearFilter) {
      fetchLineChartData();
    }
  }, [lineYearFilter]);

  const fetchAllData = async () => {
    try {
      const revenueResponse = await fetch('http://127.0.0.1:5001/api/revenues/getAll');
      const revenueData = await revenueResponse.json();
      setRevenues(revenueData);

      const expenseResponse = await fetch('http://127.0.0.1:5001/api/expenses/getAll');
      const expenseData = await expenseResponse.json();
      setAllExpenses(expenseData);

      const years = [...new Set(revenueData.map(item => item.Year))];
      setDistinctYears(years.sort((a, b) => parseInt(b.split('-')[0]) - parseInt(a.split('-')[0])));
      setPieYearFilter(years[0]);
      setLineYearFilter(years[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchLineChartData = async () => {
    const revenueResponse = await fetch(`http://127.0.0.1:5001/api/revenues/filter?Year=${lineYearFilter}`);
    const filteredRevenues = await revenueResponse.json();
    setRevenues(filteredRevenues);
  };

  const CustomTooltipPer = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = pieData.reduce((acc, cur) => acc + cur.value, 0);
      const percentage = ((payload[0].value / total) * 100).toFixed(2);
      return (
        <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', color: 'black' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].name}</p>
          <p style={{ margin: 0 }}>Value: ₹{payload[0].value.toLocaleString()}</p>
          <p style={{ margin: 0 }}>Percentage: {percentage}%</p>
        </div>
      );
    }
    return null;
  };
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ResponsiveContainer width="60%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltipPer />} />
          </PieChart>
        </ResponsiveContainer>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, color: 'black' }}>
          {pieData.map((entry, index) => (
            <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{
                width: '15px',
                height: '15px',
                backgroundColor: COLORS[index % COLORS.length],
                marginRight: '10px',
              }}></div>
              <span style={{color:'black'}}>{entry.name}: ₹{entry.value.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // const lineData = revenues.map(rev => ({
  //   name: `Q${rev["Quarter"]}`,
  //   TotalRevenue: rev['Total Revenue']
  // }));

  return (
    <div className="analysis-container">
          
<div><h1>Expense and Revenue Analysis over the Quarters</h1></div>
      <div className="filters">
        {/* <h1 className="title-1">Analysis</h1> */}
        <label htmlFor="yearFilter">Filter by Year:</label>
        <select value={pieYearFilter} onChange={(e) => setPieYearFilter(e.target.value)}>
          {distinctYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select value={pieQuarterFilter} onChange={(e) => setPieQuarterFilter(e.target.value)}>
          {distinctQuarters.map(quarter => (
            <option key={quarter} value={quarter}>
              Q{quarter}
            </option>
          ))}
        </select>
      </div>
      <p style={{ textAlign: 'center', marginTop: '5px' , fontStyle:'italic'}}>(All values are in millions)</p>

      {renderPieChart()}

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
      {/* <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
\          <Legend />
          <Line type="monotone" dataKey="TotalRevenue" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer> */}
      <ResponsiveContainer width="100%" height={300}>
  <LineChart data={lineData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis 
      domain={[
        (dataMin) => Math.floor(dataMin - 50), 
        (dataMax) => Math.ceil(dataMax + 50),
      ]}
    />
    <Tooltip content={<CustomTooltip />} />
    <Legend />
    <Line type="monotone" dataKey="TotalRevenue" stroke="#8884d8" activeDot={{ r: 8 }} />
  </LineChart>
</ResponsiveContainer>
{/* Sakshi made a change in line graph to make a dynamic y axis , so that it doesnt seem a straight line , also added custom tooltip to make it visible */}
    </div>
  );
}

export default Analysis;
