import React, { useState, useEffect } from 'react';
import DataBox from '../components/DataBox';
import ConfirmationDialog from '../components/ConfirmationDialog';
import AddNewModal from '../components/AddNewModal'; // Modal for Adding New Liabilities
import UpdateModal from '../components/UpdateModel';
import '../styles/Liabilities.css';

const Liabilities = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [availableQuarters, setAvailableQuarters] = useState(['Q1', 'Q2', 'Q3', 'Q4']);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // Add state for Add Modal
  const [selectedSection, setSelectedSection] = useState(''); // Section for Adding New Item
  const [showUpdateModal, setShowUpdateModal] = useState(false); // State for Update Modal

  const role = sessionStorage.getItem('Role');
  const name = sessionStorage.getItem('Name');

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
      // Filter by Year and Quarter
      if (item.Year === selectedYear && item.Quarter === selectedQuarter) {
        const normalizedType = item.Type.toLowerCase();
        acc[normalizedType] = acc[normalizedType] ? [...acc[normalizedType], item] : [item];
      }
      return acc;
    }, {});
    setFilteredData(filtered);
  }, [data, selectedYear, selectedQuarter]);

  const handleCheckboxChange = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((selected) => selected !== item)
        : [...prevSelected, item]
    );
  };

  const handleAdd = (section) => {
    setSelectedSection(section);
    setShowAddModal(true); // Show modal for adding new item
  };

  const confirmAction = async () => {
    setShowConfirmation(false);
    try {
      if (confirmationType === 'delete') {
        await deleteItems();
        fetchData(); // Refresh data after deletion
      } else if (confirmationType === 'update') {
        await updateItem(currentItem);
      }
    } catch (error) {
      console.error('Error during action:', error);
    }
  };

  const handleDelete = (item) => {
    setCurrentItem(item); // Set the item to be deleted
    setConfirmationType('delete');
    setShowConfirmation(true); // Show the confirmation dialog
  };

  const deleteItems = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/liabilities/delete/${currentItem._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      setSelectedItems([]);
      setDeleteMode(false);
      fetchData(); // Refresh data after deletion

      // Add log for deletion
      addLogs({
        name: name,
        role: role,
        action: `Deleted Liabilities`,
      });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdate = (item) => {
    setCurrentItem(item);
    setShowUpdateModal(true); // Show modal when updating
  };

  const updateItem = async (updatedItem) => {
    try {
      console.log('Updating item:', updatedItem); // Debug the item being updated
      const response = await fetch(`http://127.0.0.1:5001/api/liabilities/update/${updatedItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      await fetchData(); // Reload data after update
      setSelectedYear(updatedItem['Year']); // Update selected year if necessary

      // Add log for update
      addLogs({
        name: name,
        role: role,
        action: `Updated Liabilities`,
      });
    } catch (error) {
      console.error('Error updating item:', error);
    }
    setShowUpdateModal(false); // Close the modal after updating
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

      // Add log for adding new item
      addLogs({
        name: name,
        role: role,
        action: `Added New Liabilities`,
      });
    } catch (error) {
      console.error('Error adding item:', error);
    }
    setShowAddModal(false); // Close the modal after adding
  };

  const addLogs = async (data) => {
    try {
      await fetch('http://127.0.0.1:5001/api/add-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: data.user_id,
          username: data.name,
          role: data.role,
          action: data.action,
        }),
      });
    } catch (error) {
      console.error('Error adding logs:', error);
    }
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

        <label htmlFor="quarterFilter">Filter by Quarter:</label>
        <select
          id="quarterFilter"
          className="quarter-filter"
          value={selectedQuarter}
          onChange={(e) => setSelectedQuarter(e.target.value)}
        >
          {availableQuarters.map((quarter) => (
            <option key={quarter} value={quarter}>
              {quarter}
            </option>
          ))}
        </select>
      </div>

      <div className="sections-container">
        {['equity', 'current_liability', 'non_current_liability'].map((section) => (
          <div key={section} className="section">
            <div className="section-header">
              <h2 className="title-1">{section.replace('_', ' ').toUpperCase()}</h2>
              <div className="section-buttons">
                {role === 'admin' && (
                  <button onClick={() => handleAdd(section)}>+ Add</button>
                )}
              </div>
            </div>
            <div className="data-boxes">
              {filteredData[section]
                ? filteredData[section].map((item) => (
                    <DataBox
                      key={item._id}
                      item={item}
                      onDelete={handleDelete}
                      onUpdate={handleUpdate}
                      onCheckboxChange={handleCheckboxChange}
                    />
                  ))
                : null}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && <AddNewModal section={selectedSection} onSubmit={addNewItem} onClose={() => setShowAddModal(false)} />}
      {showUpdateModal && (
        <UpdateModal item={currentItem} onSubmit={updateItem} onClose={() => setShowUpdateModal(false)} />
      )}
      {showConfirmation && (
        <ConfirmationDialog
          onConfirm={confirmAction}
          onCancel={() => setShowConfirmation(false)}
          type={confirmationType}
          currentItem={currentItem}
        />
      )}
    </div>
  );
};

export default Liabilities;
