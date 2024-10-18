import React, { useState, useEffect } from 'react';
import DataFetchRevenue from '../components/DataFetchRevenue'; // Component for rendering expense data
import '../styles/Expense.css'; // CSS file for styling

const Revenue= () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/api/revenues/getAll', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Error');
        }
        
        const apiData = await response.json();
        setData(apiData);

        // Extract available years from the data and sort in descending order
        const years = [...new Set(apiData.map(item => item.Year))].sort((a, b) => b.localeCompare(a));
        setAvailableYears(years);
        setSelectedYear(years[0]); // Set the most recent year as default
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter data by selected year and group by quarter
    const filtered = data.reduce((acc, item) => {
      if (item.Year === selectedYear) {
        const quarter = item['Quarter']; // Group by quarter (Q1, Q2, Q3, Q4)

        if (!acc[quarter]) {
          acc[quarter] = [];
        }
        acc[quarter].push(item);
      }
      return acc;
    }, {});

    setFilteredData(filtered);
  }, [data, selectedYear]);

  return (
    <div className="expense-container">
      <h1>Revenue by Year and Quarter</h1>

      {/* Year Filter Dropdown */}
      <div className="filter-section">
        <label htmlFor="yearFilter">Filter by Year:</label>
        <select
          id="yearFilter"
          className="year-filter"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {availableYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Display Expenses by Quarter */}
      <div className="sections-container">
        {['1', '2', '3', '4'].map(quarter => (
          filteredData[quarter] && (
            <div key={quarter} className="section">
              <h2>Quarter {quarter}</h2>
              <br />
              <DataFetchRevenue expenseData={filteredData[quarter]} />
            </div>
          )
        ))}
      </div>
      <br /><br /><br />
    </div>
  );
};
export default Revenue