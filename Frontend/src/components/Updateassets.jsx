import React, { useState, useEffect } from 'react';
import '../styles/Modal.css'; // Ensure you have a CSS file for styling the modal

const UpdateModal = ({ item, section, onUpdate, onCancel }) => {
  const [category, setCategory] = useState(item['Category'] || '');
  const [amount, setAmount] = useState(item['Amount'] || '');
  const [year, setYear] = useState(item['Year'] || '');
  const [quarter, setQuarter] = useState(item['Quarter'] || '');
  const [type, setType] = useState(item['Type'] || '');

  // Get the current year dynamically
const currentYear = new Date().getFullYear();

// Generate years in "YYYY-YY" format starting from "2004-05" up to the current year
const yearOptions = [];
for (let i = 2004; i <= currentYear; i++) {
  yearOptions.push(`${i}-${(i + 1).toString().slice(-2)}`);
}

  // Quarters options
  const quarterOptions = [1, 2, 3, 4];

  // Categories mapped based on the selected type
  const categoryOptionsMap = {
    current_asset: [
        'Other balances with banks',
        'Investments',
        'Billed trade receivables',
        'Other Financial Assets',
        'Other current assets',
        'Cash and cash equivalents',
        'Loans',
        'Inventories',
        'Income tax assets',
        'Unbilled trade receivables',
  
  
      ],
      noncurrent_asset: [
        'Goodwill',
        'Property,plant and equipment',
        'Unbilled trade receivables',
        'Deferred tax assets',
        'Income tax assets',
        'Right of use assets',
        'Investments',
        'Capital work in progress',
        'Other financial assets',
        'Loans',
        'Billed trade receivables',
        'Other non current assets',
        'Other intangible assets',
  
      ],
  };

  // Dynamically update category options based on the type selected
  const categoryOptions = categoryOptionsMap[item.Type] || [];
  console.log(item.Type);

  const handleSubmit = () => {
    const updatedItem = {
      _id: item._id, // Retain the original _id
      Year: year,
      Quarter: quarter,
      Category: category,
      Amount: amount,
      Type: type,
    };
  
    // Call the onUpdate method passed from the parent with the updated item data
    onUpdate(updatedItem);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update {section}</h2>

        <div className="form-group">
          <label>Type</label>
          <h3>{type.replace('_', ' ')}</h3> {/* Display the type */}
        </div>

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
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Select year"
          >
            <option value="" disabled>Select year</option>
            {yearOptions.map((yearOption, index) => (
              <option key={index} value={yearOption}>{yearOption}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quarter</label>
          <select
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
            placeholder="Select quarter"
          >
            <option value="" disabled>Select quarter</option>
            {quarterOptions.map((q, index) => (
              <option key={index} value={q}>{q}</option>
            ))}
          </select>
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
