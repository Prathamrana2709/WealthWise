import React, { useState, useEffect } from 'react';
import DataBox from '../components/DataBox';
import '../styles/Liabilities.css'; // CSS for styling

const Liabilities = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/api/liabilities/getAll', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const apiData = await response.json();
        setData(apiData);
    
        // Get unique years and set the most recent as selectedYear
        const years = [...new Set(apiData.map(item => item.Year))].sort((a, b) => b.localeCompare(a));
        setAvailableYears(years);
        setSelectedYear(years[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    // Normalize the `Type` to handle case sensitivity
    const filtered = data.reduce((acc, item) => {
      if (item.Year === selectedYear) {
        const normalizedType = item.Type.toLowerCase(); // Convert type to lowercase
        acc[normalizedType] = acc[normalizedType] ? [...acc[normalizedType], item] : [item];
      }
      return acc;
    }, {});
    console.log('Filtered Data:', filtered); // Check if this contains expected sections
    setFilteredData(filtered);
  }, [data, selectedYear]);

  return (
    <div className="liabilities-container">
      <div className="filter-section">
        <div>
          
        <h1 className='title-1'>Equity & Liabilities</h1>
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
      </div>

      <div className="sections-container">
        {filteredData['equity'] && (  // Lowercase the types to match the filtered keys
          <div className="section">
            <h2 className='title-1'>Equity</h2>
            <DataBox data={filteredData['equity']} hideYear={true} />
          </div>
        )}
        {filteredData['current_liability'] && (
          <div className="section">
            <h2 className='title-1'>Current Liabilities</h2>
            <DataBox data={filteredData['current_liability']} hideYear={true} />
          </div>
        )}
        {filteredData['non_current_liability'] && (
          <div className="section">
            <h2 className='title-1'>Non-Current Liabilities</h2>
            <DataBox data={filteredData['non_current_liability']} hideYear={true} />
          </div>
        )}
      </div>
      <br /><br /><br />
    </div>
  );
};

export default Liabilities;
