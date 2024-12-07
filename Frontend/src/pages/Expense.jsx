import React, { useState, useEffect } from 'react';
import DataFetchExpense from '../components/DataFetchExpenseCRUD';
import '../styles/Expense.css';

import ConfirmationDialog from '../components/ConfirmationDialog';
import AddNewExpense from '../components/Addnewexpense';
import UpdateExpense from '../components/Updateexpense';

const Expense = () => {
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
      const response = await fetch('http://127.0.0.1:5001/api/expenses/getAll', {
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

  // Popup message for duplicate entry
  const popupMessage = (message) => {
    alert(message);
  };

  const logAction = async (action) => {
    const role = sessionStorage.getItem('Role');
    const name = sessionStorage.getItem('Name');
    const logData = {
      username: name,
      role: role,
      action: action,
    };

    try {
      const response = await fetch('http://127.0.0.1:5001/api/add-log', {  // Changed port to 5000
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Log success:', data);
      } else {
        console.error('Log error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Log error:', error);
    }
  };

  const addNewItem = async (newItem) => {
    const duplicate = data.find(
      (item) => item['Year'] === newItem['Year'] && item['Quarter'] === newItem['Quarter']
    );

    if (duplicate) {
      popupMessage('Expense already exists for the selected year and quarter. Please update the existing entry.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5001/api/expenses/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
      setShowAddModal(false);
      await fetchData();
      setSelectedYear(newItem.Year); // Set the selected year to the new item's year

      // Log the action
      logAction('Added Expense');
    } catch (error) {
      console.error('Error adding item:', error);
    }
    setShowAddModal(false);
  };

  const updateItem = async (updatedItem) => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/expenses/update/${updatedItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });
      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
      await fetchData();
      setSelectedYear(updatedItem.Year);

      // Log the action
      logAction('Updated Expense');
    } catch (error) {
      console.error('Error updating item:', error);
    }
    setShowUpdateModal(false);
  };

  const deleteItem = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/expenses/delete/${currentItem._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
      setData(data.filter(item => item._id !== currentItem._id));

      // Log the action
      logAction('Deleted Expense');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setShowConfirmation(false);
  };

  const confirmAction = () => {
    if (confirmationType === 'delete') deleteItem();
  };

  const addLogs = async (data) => {
    try {
      await fetch('http://127.0.0.1:5001/api/add-log', {  // Update the URL here
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.name,
          role: data.role,
          action: 'Added/Updated Expense',
        }),
      });
    } catch (error) {
      console.error('Error adding logs:', error);
    }
  };

  return (
    <div>
      <h3 className='title-1'>Expenses by Year and Quarter</h3>
      <div className="expense-container">
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
          <div>
          <button
            style={{ width: '200px' }}
            onClick={() => handleAdd('expense')}
          >
            Add New Expense
          </button>
          </div>
          {['1', '2', '3', '4'].map(quarter => (
            filteredData[quarter] && (
              <div key={quarter} className="section">
                <h2>Quarter {quarter}</h2>
                <DataFetchExpense
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
          <AddNewExpense
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
          <UpdateExpense
            item={currentItem}
            section={selectedSection}
            onUpdate={updateItem}
            onCancel={() => setShowUpdateModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Expense;
