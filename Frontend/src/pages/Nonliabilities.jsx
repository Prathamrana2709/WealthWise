import React, { useState, useEffect } from 'react';
import DataBox from '../components/Databoxsimple'; // Assuming DataBox displays the items
 // Modal for Adding New Liabilities
import '../styles/Liabilities.css';

const Liabilities = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false); // State for Add Modal
  const [selectedSection, setSelectedSection] = useState(''); // Section for Adding New Item

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/liabilities/getAll', {
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
    setFilteredData(filtered);
  }, [data, selectedYear]);

  const handleAdd = (section) => {
    setSelectedSection(section);
    setShowAddModal(true); // Show modal for adding new item
  };

  const addNewItem = async (newItem) => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/liabilities/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      await fetchData(); // Ensure fetchData is awaited to complete before moving on
      setSelectedYear(newItem.Year); // Update selectedYear if the new item has a different year
    } catch (error) {
      console.error('Error adding item:', error);
    }
    setShowAddModal(false); // Close the modal after adding
  };

  return (
    <div className="liabilities-container">
      <div className="filter-section">
        <h1 className="title-1">Equity & Liabilities</h1>
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
        {['equity', 'current_liability', 'non_current_liability'].map((section) => (
          <div key={section} className="section">
            <div className="section-header">
              <h2 className="title-1">{section.replace('_', ' ').toUpperCase()}</h2>
             
            </div>
            {filteredData[section] && (
              <DataBox
                data={filteredData[section]} // Display the filtered data
                hideYear={true}
              />
            )}
          </div>
        ))}
      </div>

      {/* Modal for adding a new item */}
      {showAddModal && (
        <AddNewModal
          section={selectedSection}
          onAdd={addNewItem}
          onCancel={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default Liabilities;
