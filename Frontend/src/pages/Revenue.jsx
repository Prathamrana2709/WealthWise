import React, { useState, useEffect } from 'react';
import DataFetchRevenue from '../components/DataFetchRevenueCRUD';
import '../styles/Expense.css';

import ConfirmationDialog from '../components/ConfirmationDialog';
import AddNewRevenue from '../components/Addnewrevenue';
import UpdateRevenue from '../components/Updaterevenue';


const Revenue = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedSection, setSelectedSection] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/revenues/getAll', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
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

  const handleUpdate = (item) => {
    setCurrentItem(item);
    setShowUpdateModal(true);
  };

  //popupmessage for 
  const popupMessage = (message) => {
    alert(message);
  };

  const addNewItem = async (newItem) => {
    // Check for duplicate entries before making the fetch request
    const duplicate = data.find(
      (item) => item['Year'] === newItem['Year'] && item['Quarter'] === newItem['Quarter']
    );

    if (duplicate) {
      // Show popup message for duplicate entry
      popupMessage('Expense already exists for the selected year and quarter. Please update the existing entry.');
      return; // Exit the function if duplicate found
    }

    try {
      console.log("Payload for new revenue:", newItem);
      const response = await fetch('http://127.0.0.1:5001/api/revenues/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`)
      setShowAddModal(false);

      await fetchData(); // Refresh the data after adding the new item
      setSelectedYear(newItem.Year); // Set the selected year to the new item's year

    } catch (error) {
      console.error('Error adding item:', error);
    }

    setShowAddModal(false); // Close the add modal after processing
  };


  const updateItem = async (updatedItem) => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/revenues/update/${updatedItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });
      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
      await fetchData();
      setSelectedYear(updatedItem.Year);
    } catch (error) {
      console.error('Error updating item:', error);
    }
    setShowUpdateModal(false);
  };

  const confirmAction = () => {
    if (confirmationType === 'delete') deleteItem();
  };

  return (
    <div className="expense-container">
            <div><h1>Revenue Data over the quarters </h1></div>

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
        <button onClick={() => handleAdd('revenue')}>Add New Revenue</button>
        {['1', '2', '3', '4'].map(quarter => (
          filteredData[quarter] && (
            <div key={quarter} className="section">
              <h2>Quarter {quarter}</h2>
              <DataFetchRevenue
                data={filteredData[quarter]}
                hideYear={true}
                onUpdate={handleUpdate}
              />
            </div>
          )
        ))}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <AddNewRevenue
          section={selectedSection}
          onAdd={addNewItem}
          onCancel={() => setShowAddModal(false)}
          existingEntries={data} // Pass the existing data to check for duplicates
        />
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <ConfirmationDialog
          message={`Are you sure you want to ${confirmationType}?`}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {/* Update Expense Modal */}
      {showUpdateModal && (
        <UpdateRevenue
          item={currentItem}
          section={selectedSection}
          onUpdate={updateItem}
          onCancel={() => setShowUpdateModal(false)}
        />
      )}

    </div>
  );
};

export default Revenue;
