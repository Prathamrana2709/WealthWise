import React, { useState, useEffect } from 'react';
import DataFetchExpense from '../components/DataFetchExpense'; // Component for rendering expense data
import '../styles/Expense.css'; // CSS file for styling

import ConfirmationDialog from '../components/ConfirmationDialog';
import AddNewModal from '../components/Addnewexpense'; // Modal for Adding New Liabilities
import UpdateModal from '../components/Updateexpense';
// import DataBox from '../components/DataBox2';

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

  const handleDelete = (item) => {
    setCurrentItem(item);
    setConfirmationType('delete');
    setShowConfirmation(true);
  };

  const addNewItem = async (newItem) => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/expenses/add', {
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
    console.log('newitem',newItem);
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
      await fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setShowConfirmation(false);
  };

  const confirmAction = () => {
    if (confirmationType === 'delete') deleteItem();
  };


  return (
    <div className="expense-container">
      <h1>Expenses by Year and Quarter</h1>

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
              <button onClick={() => handleAdd(quarter)}>Add New Expense</button>
              <br />
              {/* <DataFetchExpense expenseData={filteredData[quarter]} /> */}
              <DataFetchExpense 
                data={filteredData[quarter]}
                hideYear={true}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
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

      {showConfirmation && (
        <ConfirmationDialog
          message={`Are you sure you want to ${confirmationType}?`}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {showUpdateModal && (
        <UpdateModal
          item={currentItem}
          section={selectedSection}
          onUpdate={updateItem}
          onCancel={() => setShowUpdateModal(false)}
        />
      )}
      <br /><br /><br />
    </div>
  );
};

export default Expense;
