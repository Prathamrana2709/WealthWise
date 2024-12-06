import React, { useState, useEffect } from 'react';
import DataBox from '../components/DataBox';
import ConfirmationDialog from '../components/ConfirmationDialog';
import AddNewAssets from '../components/Addnewassets';
import UpdateAssets from '../components/Updateassets';
import '../styles/liabilities.css';

const Assets = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [availableQuarters, setAvailableQuarters] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Assuming these values come from user context or props
  const role = sessionStorage.getItem('Role');
  const name = sessionStorage.getItem('Name');

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
    if (selectedYear) {
      // Get available quarters for the selected year
      const quarters = [1, 2, 3, 4];
      setAvailableQuarters(quarters);
      setSelectedQuarter(quarters[quarters.length - 1]); // Default to the last quarter
    }
  }, [selectedYear]);

  useEffect(() => {
    const filtered = data.reduce((acc, item) => {
      if (item.Year === selectedYear && item.Quarter === selectedQuarter) {
        const normalizedType = item.Type.toLowerCase();
        acc[normalizedType] = acc[normalizedType] ? [...acc[normalizedType], item] : [item];
      }
      return acc;
    }, {});
    console.log("Filtered Data:", filtered);
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

  const confirmAction = async () => {
    setShowConfirmation(false);
    try {
      if (confirmationType === 'delete') {
        await deleteItems();
        fetchData();
      } else if (confirmationType === 'update') {
        await updateItem(currentItem);
      }
    } catch (error) {
      console.error('Error during action:', error);
    }
  };

  const deleteItems = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/assets/delete/${currentItem._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      await logAction('delete');  // Log delete action
      setSelectedItems([]);
      setDeleteMode(false);
      fetchData();  // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const addNewItem = async (newItem) => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/assets/add', {
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
      setSelectedQuarter(newItem.Quarter);
      await logAction('add');  // Log add action
    } catch (error) {
      console.error('Error adding item:', error);
    }
    setShowAddModal(false);
  };

  const updateItem = async (updatedItem) => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/assets/update/${updatedItem._id}`, {
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
      setSelectedYear(updatedItem['Year']);
      setSelectedQuarter(updatedItem['Quarter']);
      await logAction('update');  // Log update action
    } catch (error) {
      console.error('Error updating item:', error);
    }
    setShowUpdateModal(false);
  };

  // Function to log actions (add, delete, update)
  const logAction = async (action) => {
    const logData = {
      username: name,
      role: role,
      action: action,
    };

    try {
      const response = await fetch('http://127.0.0.1:5001/api/add-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Log success:', data);
      } else {
        console.error('Log failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Log error:', error);
    }
  };

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

        {selectedYear && (
          <>
            <label htmlFor="quarterFilter">Filter by Quarter:</label>
            <select
              id="quarterFilter"
              className="quarter-filter"
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
            >
              {availableQuarters.map((quarter) => (
                <option key={quarter} value={quarter}>
                  Q{quarter}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <div className="sections-container">
        {['current_asset', 'noncurrent_asset'].map((section) => (
          <div key={section} className="section">
            <div className="section-header">
              <h2 className="title-1">{section.replace('_', ' ').toUpperCase()}</h2>
              <button onClick={() => handleAdd(section)}>Add New {section.replace('_', ' ')}</button>
            </div>
            {filteredData[section] && (
              <DataBox
                data={filteredData[section]}
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

      {showAddModal && <AddNewAssets onClose={() => setShowAddModal(false)} onSave={addNewItem} />}
      {showUpdateModal && <UpdateAssets item={currentItem} onClose={() => setShowUpdateModal(false)} onSave={updateItem} />}
      {showConfirmation && (
        <ConfirmationDialog
          onClose={() => setShowConfirmation(false)}
          onConfirm={confirmAction}
          type={confirmationType}
        />
      )}
    </div>
  );
};

export default Assets;
