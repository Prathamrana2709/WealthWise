import React, { useState, useEffect } from 'react';
import DataBox from '../components/DataBox';
import ConfirmationDialog from '../components/AddNewModal';
import AddNewModal from '../components/AddNewModal'; // Modal for Adding New Liabilities
import '../styles/Liabilities.css';

const Liabilities = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // Add state for Add Modal
  const [selectedSection, setSelectedSection] = useState(''); // Section for Adding New Item

  useEffect(() => {
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

  const handleCheckboxChange = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((selected) => selected !== item)
        : [...prevSelected, item]
    );
  };

  const handleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedItems([]);
  };

  const handleDelete = () => {
    if (selectedItems.length > 0) {
      setConfirmationType('delete');
      setShowConfirmation(true);
    }
  };

  const handleUpdate = (item) => {
    setCurrentItem(item);
    setConfirmationType('update');
    setShowConfirmation(true);
  };

  const handleAdd = (section) => {
    setSelectedSection(section); // Pass the selected section (e.g., equity)
    setShowAddModal(true); // Show modal for adding new item
  };

  const confirmAction = async () => {
    setShowConfirmation(false);
    try {
      if (confirmationType === 'delete') {
        await deleteItems();
      } else if (confirmationType === 'update') {
        await updateItem(currentItem);
      }
    } catch (error) {
      console.error('Error during action:', error); // Log the error
    }
  };

  const deleteItems = async () => {
    try {
      for (const item of selectedItems) {
        const response = await fetch(`http://127.0.0.1:5001/api/liabilities/delete/${item.Year}/${item.Quarter}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
      }
      setSelectedItems([]);
      setDeleteMode(false);
      fetchData();
    } catch (error) {
      console.error('Error deleting items:', error);
    }
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
      fetchData(); // Refresh data after adding
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
              <div className="section-buttons">
                <button onClick={() => handleAdd(section)}>Add New {section.replace('_', ' ')}</button>
                <button onClick={handleDeleteMode}>
                  {deleteMode ? 'Cancel Delete' : 'Delete'}
                </button>
                {deleteMode && selectedItems.length > 0 && (
                  <button onClick={handleDelete}>Delete Selected ({selectedItems.length})</button>
                )}
              </div>
            </div>
            {filteredData[section] && (
              <DataBox
                data={filteredData[section]}
                hideYear={true}
                deleteMode={deleteMode}
                onCheckboxChange={handleCheckboxChange}
                onUpdate={handleUpdate}
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

export default Liabilities;
