import React, { useState, useEffect } from 'react';
import '../styles/Modal.css'; // Ensure you have a CSS file for styling the modal

const AddNewModal = ({ section, onAdd, onCancel }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [year, setYear] = useState('');
  const [quarter, setQuarter] = useState('');

  // Categories options
  const categoryOptions = [
    'Provisions',
    'Other liabilities',
    'Trade payables',
    'Other financial liabilities',
    'Income tax liabilities',
    'Lease Liabilities',
    'Unearned and deferred revenue',
    'Employee benefit obligations',
    'Deferred tax liabilities',
    'Share Capital',
    'Other equity'
  ];

  // Calculate the current financial year and quarter
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JS months are 0-indexed
    let currentYear = currentDate.getFullYear();
    let currentQuarter = 'Q1';

    // Start year in April, Q1 starts in April
    if (currentMonth >= 4 && currentMonth <= 6) {
      currentQuarter = 1;
    } else if (currentMonth >= 7 && currentMonth <= 9) {
      currentQuarter = 2;
    } else if (currentMonth >= 10 && currentMonth <= 12) {
      currentQuarter = 3;
    } else {
      currentQuarter = 4;
      currentYear -= 1; // The financial year ends in March
    }
    const nextYear = (currentYear + 1).toString().slice(-2); // get only last two digits, e.g., "25"
    setYear(`${currentYear}-${nextYear}`); // sets year to "2024-25"
    setQuarter(currentQuarter); // sets the quarter as usual
  }, []);

  const handleSubmit = () => {
    const newItem = {
      Year: year,
      Quarter: quarter,
      Category: category,
      Amount: amount,
      Type: section, // Section passed from parent (e.g., 'Current_Liabilities', 'NonCurrent_Liabilities', 'Equity')
    };
  
    // Call the onAdd method passed from the parent with the newItem data
    onAdd(newItem);
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New {section.replace('_', ' ').toUpperCase()}</h2>

        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Select category"
          >
            <option value="" disabled>Select category</option>
            {categoryOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Amount (in Millions)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>

        <div className="form-group">
          <label>Year</label>
          <input type="text" value={year} 
           onChange={(e) => setAmount(e.target.value)}
           placeholder="Enter year" /> {/* Dynamic year */}
        </div>

        <div className="form-group">
          <label>Quarter</label>
          <input type="text" value={quarter}
           onChange={(e) => setAmount(e.target.value)}
           placeholder="Enter Quarter" /> {/* Dynamic quarter */}
        </div>

        <div className="modal-actions">
          <button className="btn btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn btn-submit" onClick={handleSubmit}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddNewModal;
