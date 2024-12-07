import React, { useState, useEffect } from 'react';
import '../styles/Modal.css'; // Ensure you have a CSS file for styling the modal

const Addcashflow= ({ item, section, onUpdate, onCancel }) => {
  const [category, setCategory] = useState(item['Category'] || '');
  const [amount, setAmount] = useState(item['Amount'] || '');
  const [year, setYear] = useState(item['Year'] || '');
  const [quarter, setQuarter] = useState(item['Quarter'] || '');
  const [type,setType]= useState(item['Type'] || '') ; 
  console.log('section:', section);

  // Categories mapped based on the selected type
  const categoryOptions = {
    in: [
      'Net gain on disposal of property, plant and equipment',
      'Unrealised foreign exchange gain',
      'Net gain on disposal / fair valuation of investments',
      'Interest income',
      'Dividend Income',
      'Bank Deposits placed',
      'Purchase of investments',
      'Proceeds from bank deposits',
      'Proceeds from inter-corporate deposits',
   'Proceeds from disposal / redemption of investments',
   'Proceeds from sub-lease receivable',
   'Proceeds from disposal of property, plant and equipment',
   'Interest received',
   'Dividend received',
   
     ],
     out: [
       'Depreciation and Amortisation Cost',
      'Bad Debts and advances',
      'Tax Expense',
      'Finance Costs',
      'Payment for purchase of property , plant and equipment',
      'Payment including advances for acquiring right-of-use assets',
      'Payment for purchase of intangible assets',
    ],
  };
// const categoryOptions = categoryOptionsMap[item.Type] || [];


  // Dynamically generate year options
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = 2004; i <= currentYear; i++) {
      yearOptions.push(`${i}-${(i + 1).toString().slice(-2)}`);
    }
    return yearOptions;
  };

  // Get the current year dynamically
  const currentYear = new Date().getFullYear();

  // Generate years in "YYYY-YY" format starting from "2004-05" up to the current year
  const yearOptions = [];
  for (let i = 2004; i <= currentYear; i++) {
    yearOptions.push(`${i}-${(i + 1).toString().slice(-2)}`);
  }

  // Quarters options
  const quarterOptions = [1, 2, 3, 4];

  
  const handleSubmit = () => {
    const updatedItem = {
      _id: item._id,
      Year: year,
      Quarter: parseInt(quarter), // Ensure Quarter is an integer
      Amount: parseFloat(amount), // Ensure Amount is a number
      Type: type, // Section will be passed from the parent, e.g., "Operating"
      Category: category,
      "In/Out": section, // Use the section value directly
    };

    // Call the onUpdate method passed from the parent with the updated item data
    onUpdate(updatedItem);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
      <h2>Add {section?.replace('_', ' ').toUpperCase() || 'cashflow'}</h2>

        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            // onChange={(e) => setCategory(e.target.value)}
            placeholder="Select category"
          >
            <option value="" >Select category</option>
            {categoryOptions[section]?.map((option, index) => (
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
          >
            {generateYearOptions().map((yearOption, index) => (
              <option key={index} value={yearOption}>{yearOption}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quarter</label>
          <select
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
          >
            <option value="1">Q1</option>
            <option value="2">Q2</option>
            <option value="3">Q3</option>
            <option value="4">Q4</option>
          </select>
        </div>

        <div className="modal-actions">
          <button className="btn btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn btn-submit" onClick={handleSubmit}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default Addcashflow;
