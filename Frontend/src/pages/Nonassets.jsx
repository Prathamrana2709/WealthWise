import React, { useState, useEffect } from 'react';
import DataBox from '../components/Databoxsimple';
// Match casing exactly
import '../styles/liabilities.css';

const Assets = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/assets/getAll', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const apiData = await response.json();
      setData(apiData);
      const years = [...new Set(apiData.map((item) => item.Year))].sort((a, b) => b.localeCompare(a));
      setAvailableYears(years);
      setSelectedYear(years[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.reduce((acc, item) => {
      if (item.Year === selectedYear) {
        const normalizedType = item.Type.toLowerCase();
        acc[normalizedType] = acc[normalizedType] ? [...acc[normalizedType], item] : [item];
      }
      return acc;
    }, {});
    console.log("Filtered Data:", filtered);
    setFilteredData(filtered);
  }, [data, selectedYear]);

 

  
  return (
    <div className="liabilities-container">
      <div className="filter-section">
        <h1 className="title-1">Assets</h1>
        <label htmlFor="yearFilter">Filter by Year:</label>
        <select
          id="yearFilter"
          className="year-filter"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="sections-container">
        {['current_asset', 'noncurrent_asset'].map((section) => (
          <div key={section} className="section">
            <div className="section-header">
              <h2 className="title-1">{section.replace('_', ' ').toUpperCase()}</h2>
              
            </div>

            {filteredData[section] && (
              <DataBox
                data={filteredData[section]} // Make sure filteredData is properly structured
                hideYear={true}
                deleteMode={false} // Keep this if DataBox uses it to hide delete options
              />
            )}
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddNewAssets
          section={selectedSection}
          onAdd={addNewItem}
          onCancel={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default Assets;
