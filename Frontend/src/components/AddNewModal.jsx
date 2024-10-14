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
      currentQuarter = 'Q1';
    } else if (currentMonth >= 7 && currentMonth <= 9) {
      currentQuarter = 'Q2';
    } else if (currentMonth >= 10 && currentMonth <= 12) {
      currentQuarter = 'Q3';
    } else {
      currentQuarter = 'Q4';
      currentYear -= 1; // The financial year ends in March
    }

    setYear(`${currentYear}-${currentYear + 1}`);
    setQuarter(currentQuarter);
  }, []);

  const handleSubmit = () => {
    const newItem = {
      Year: year,
      Quarter: quarter,
      Category: category,
      Amount: amount,
      Type: section, // Section passed from parent (e.g., 'Current_Liabilities', 'NonCurrent_Liabilities', 'Equity')
    };

    onAdd(newItem); // Pass the new item to parent
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
          <input type="text" value={year} readOnly /> {/* Dynamic year */}
        </div>

        <div className="form-group">
          <label>Quarter</label>
          <input type="text" value={quarter} readOnly /> {/* Dynamic quarter */}
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
