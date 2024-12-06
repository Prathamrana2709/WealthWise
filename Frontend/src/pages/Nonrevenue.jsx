import React, { useState, useEffect } from 'react';
import DataFetchRevenue from '../components/DataFetchRevenue'; // Component for rendering revenue data
import '../styles/Expense.css'; // CSS file for styling


const Expense = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/revenues/getAll', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
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
        const quarter = `${item.Quarter}`;
        acc[quarter] = acc[quarter] ? [...acc[quarter], item] : [item];
      }
      return acc;
    }, {});
    setFilteredData(filtered);
  }, [data, selectedYear]);

  const handleAdd = (section) => {
    setSelectedSection(section);
    setShowAddModal(true);
  };

  const addNewItem = async (newItem) => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/revenues/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
      await fetchData();
      setSelectedYear(newItem.Year);
    } catch (error) {
      console.error('Error adding item:', error);
    }
    setShowAddModal(false);
  };

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
              <DataFetchRevenue 
                data={filteredData[quarter]}
                hideYear={true}
              />
            </div>
          )
        ))}
      </div>
      {showAddModal && (
        <AddNewModal
          section={selectedSection}
          onAdd={addNewItem}
          onCancel={() => setShowAddModal(false)}
        />
      )}
      <br /><br /><br />
    </div>
  );
};

export default Expense;
