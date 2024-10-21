import React, { useState, useEffect } from 'react';
import '../styles/Modal.css'; // Ensure you have a CSS file for styling the modal

const UpdateModal = ({ item, section, onUpdate, onCancel }) => {
  const [category, setCategory] = useState(item.Category || '');
  const [amount, setAmount] = useState(item.Amount || '');
  const [year, setYear] = useState(item.Year || '');
  const [quarter, setQuarter] = useState(item.Quarter || '');

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
    'Other equity',
  ];

  const handleSubmit = () => {
    const updatedItem = {
    //   ...item, // Retain the original item's properties
      Year: year,
      Quarter: quarter,
      Category: category,
      Amount: amount,
      Type: section, // Update the section (Current_Liabilities, NonCurrent_Liabilities, Equity)
    };

    // Call the onUpdate method passed from the parent with the updated item data
    onUpdate(updatedItem);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update {section.replace('_', ' ').toUpperCase()}</h2>

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
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter year"
          />
        </div>

        <div className="form-group">
          <label>Quarter</label>
          <input
            type="text"
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
            placeholder="Enter quarter"
          />
        </div>

        <div className="modal-actions">
          <button className="btn btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn btn-submit" onClick={handleSubmit}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
