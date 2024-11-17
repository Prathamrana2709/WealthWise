import React, { useState, useEffect } from 'react';
import '../styles/Modal.css'; // Ensure you have a CSS file for styling the modal

const Addnewassets = ({ section, onAdd, onCancel }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [year, setYear] = useState('');
  const [quarter, setQuarter] = useState('');
  const [type,setType]= useState('') ; 
 console.log('section:', section);


  // Define categories based on section type
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

  // Generate year options in "YYYY-YY" format dynamically
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = 2004; i <= currentYear; i++) {
      yearOptions.push(`${i}-${(i + 1).toString().slice(-2)}`);
    }
    return yearOptions;
  };

  // Calculate the current financial year and quarter
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JS months are 0-indexed
    let currentYear = currentDate.getFullYear();
    let currentQuarter = 1;

    // Determine the quarter based on the current month
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

    const nextYear = (currentYear + 1).toString().slice(-2); // Last two digits of the next year
    setYear(`${currentYear}-${nextYear}`);
    setQuarter(currentQuarter);

  }, []);

  const handleSubmit = () => {
   
    const newItem = {
      Year: year,
    Quarter: parseInt(quarter), // Ensure Quarter is an integer
    Amount: parseFloat(amount), // Ensure Amount is a number
    Type: type, // Section will be passed from the parent, e.g., "Operating"
    Category: category,
    "In/Out": section === '' ? 'in' : 'out',// Section passed from parent (e.g., 'Current_Liabilities', 'NonCurrent_Liabilities', 'Equity')
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

export default Addnewassets;
