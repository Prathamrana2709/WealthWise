import React, { useState, useEffect } from 'react';
import DataBox from '../components/DataBox';
import '../styles/Assets.css'; // CSS for styling

const Assets = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/api/assets/getAll', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }
        
        const apiData = await response.json();
        setData(apiData);
        
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
        const normalizedType = item.Type.toLowerCase().replace(/_/g, ' '); // Convert type to lowercase and replace underscores with spaces
        acc[normalizedType] = acc[normalizedType] ? [...acc[normalizedType], item] : [item];
      }
      return acc;
    }, {});

    console.log('Filtered Data:', filtered); // Check if this contains expected sections
    setFilteredData(filtered);
  }, [data, selectedYear]);

  return (
    <div className="Assets-container">
      <h1>Assets</h1>
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

      <div className="sections-container">
        {filteredData['current asset'] && ( // Match the normalized type
          <div className="section">
            <h2 className='title-1'>Current Assets</h2>
            <DataBox data={filteredData['current asset']} hideYear={true} />
          </div>
        )}
        {filteredData['noncurrent asset'] && ( // Match the normalized type
          <div className="section">
            <h2 className='title-1'>Non-Current Assets</h2>
            <DataBox data={filteredData['noncurrent asset']} hideYear={true} />
          </div>
        )}
      </div>
      <br /><br /><br />
    </div>
  );
};

export default Assets;
