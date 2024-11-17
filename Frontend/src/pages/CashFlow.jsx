import React, { useState, useEffect } from 'react';
import DataBox from '../components/DataBox';
import ConfirmationDialog from '../components/ConfirmationDialog';
import AddNewAssets from '../components/Addcashflow'; // Match casing exactly
 // Updated Add modal for Assets
import UpdateAssets from '../components/Updatecashflow'; // Updated Update modal for Assets
import '../styles/liabilities.css';

const cashflow = () => {
  const [data, setData] = useState([]);
  
  const [filteredData, setFilteredData] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/cashflow/getAll', {
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
        const normalizedType = item.Type === 'Operating' ? 'in' : 'out'; 
        acc[normalizedType] = acc[normalizedType] ? [...acc[normalizedType], item] : [item];
      }
      return acc;
    }, {});
    console.log("Filtered Data:", filtered);
    setFilteredData(filtered);
  }, [data, selectedYear]);

  const handleCheckboxChange = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((selected) => selected !== item)
        : [...prevSelected, item]
    );
  };


  const handleAdd = (section) => {
    setSelectedSection(section);
    setShowAddModal(true);
  };

  const handleUpdate = (item) => {
    setCurrentItem(item);
    setShowUpdateModal(true);
  };
  const handleDelete = (item) => {
    setCurrentItem(item); // Set the item to be deleted
    setConfirmationType('delete');
    setShowConfirmation(true); // Show the confirmation dialog
  };
  const confirmAction = async () => {
    setShowConfirmation(false);
    if (confirmationType === 'delete') {
      await deleteItem();
    }
  };

  const deleteItem = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/cashflow/delete/${currentItem._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      setData(data.filter(item => item._id !== currentItem._id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const addNewItem = async (newItem) => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/cashflow/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      await fetchData();
      setSelectedYear(newItem.Year);
    } catch (error) {
      console.error('Error adding item:', error);
    }
    setShowAddModal(false);
  };

  const updateItem = async (updatedItem) => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/cashflow/update/${updatedItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      await fetchData();
      setSelectedYear(updatedItem.Year);
    } catch (error) {
      console.error('Error updating item:', error);
    }
    setShowUpdateModal(false);
  };

  return (
    <div className="liabilities-container">
    <div className="filter-section">
      <h1 className="title-1">CashFlow</h1>
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
        {['in', 'out'].map((section) => (
          <div key={section} className="section">
            <div className="section-header">
              <h2 className="title-1">{section.replace('_', ' ').toUpperCase()}</h2>
              <button onClick={() => handleAdd(section)}>Add New {section.replace('_', ' ')}</button>
            </div>
            
            {filteredData[section] && (
             
             <DataBox
             data={filteredData[section]} // Make sure filteredData is properly structured
                hideYear={true}
                deleteMode={false}
                onCheckboxChange={handleCheckboxChange}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
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

      {showUpdateModal && (
        <UpdateAssets
          item={currentItem}
          onUpdate={updateItem}
          onCancel={() => setShowUpdateModal(false)}
        />
      )}

      {showConfirmation && (
        <ConfirmationDialog
          message={`Are you sure you want to ${confirmationType}?`}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default cashflow;
