import React, { useState, useEffect } from 'react';
import '../styles/AddNewExpense.css';

const AddExpenseModal = ({ section, onAdd, onCancel, existingEntries }) => {
  const [employeeBenefit, setEmployeeBenefit] = useState('');
  const [costOfEquipment, setCostOfEquipment] = useState('');
  const [financeCost, setFinanceCost] = useState('');
  const [depreciation, setDepreciation] = useState('');
  const [otherExpense, setOtherExpense] = useState('');
  const [currentTax, setCurrentTax] = useState('');
  const [deferredTax, setDeferredTax] = useState('');
  const [fringeBenefit, setFringeBenefit] = useState('');
  const [matCredit, setMatCredit] = useState('');
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [year, setYear] = useState('');
  const [quarter, setQuarter] = useState('');
  const [isAddDisabled, setIsAddDisabled] = useState(false);

  // Generate year options dynamically
  const currentYear = new Date().getFullYear();
  const formattedCurrentYear = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
  
  // Set initial year and quarter based on current date
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();
    let currentQuarter = 1;

    if (currentMonth >= 4 && currentMonth <= 6) currentQuarter = 1;
    else if (currentMonth >= 7 && currentMonth <= 9) currentQuarter = 2;
    else if (currentMonth >= 10 && currentMonth <= 12) currentQuarter = 3;
    else {
      currentQuarter = 4;
      currentYear -= 1;
    }

    const nextYear = (currentYear + 1).toString().slice(-2);
    setYear(`${currentYear}-${nextYear}`);
    setQuarter(currentQuarter);
  }, []);

  // Calculate total expenses and taxes whenever fields change
  useEffect(() => {
    setTotalExpense(
      (parseFloat(employeeBenefit) || 0) +
      (parseFloat(costOfEquipment) || 0) +
      (parseFloat(financeCost) || 0) +
      (parseFloat(depreciation) || 0) +
      (parseFloat(otherExpense) || 0)
    );

    setTotalTax(
      (parseFloat(currentTax) || 0) +
      (parseFloat(deferredTax) || 0) +
      (parseFloat(fringeBenefit) || 0) +
      (parseFloat(matCredit) || 0)
    );
  }, [employeeBenefit, costOfEquipment, financeCost, depreciation, otherExpense, currentTax, deferredTax, fringeBenefit, matCredit]);

  // Validate for duplicate entries
  useEffect(() => {
    const isDuplicate = existingEntries.some(
      entry => entry.year === year && entry.quarter === quarter
    );
    setIsAddDisabled(isDuplicate);
  }, [year, quarter, existingEntries]);

  const handleSubmit = () => {
    const newItem = {
    Year: year,
    Quarter: quarter,
    "Employee Benefit Expense": employeeBenefit,
    "Cost of Equipment and software Licences": costOfEquipment,
    "Finance Costs": financeCost,
    "Depreciation and Amortisation Costs": depreciation,
    "Other Expenses": otherExpense,
    "Total Expenses": totalExpense,
    "Current Tax": currentTax,
    "Deferred Tax": deferredTax,
    "Fringe benefit tax": fringeBenefit,
    "MAT credit entitlement": matCredit,
    "Total Tax Expense": totalTax
    };

    onAdd(newItem);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New {section.replace('_', ' ')
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')} {formattedCurrentYear}
        </h2>

        <div className="form-container">
          <div className="form-column">
            {/* <div className="form-group">
              <div className="form-group">
                <label>Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  
                  <option key={index} value={currentYear}>{currentYear}</option>
                  
                {/* </select>
              </div>
            </div> */} 

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

            <div className="form-group">
              <label>Employee Benefit Expense</label>
              <input
                type="number"
                value={employeeBenefit}
                onChange={(e) => setEmployeeBenefit(e.target.value)}
                placeholder="Enter Employee Benefit Expense"
              />
            </div>

            <div className="form-group">
              <label>Cost of Equipment</label>
              <input
                type="number"
                value={costOfEquipment}
                onChange={(e) => setCostOfEquipment(e.target.value)}
                placeholder="Enter Cost of Equipment"
              />
            </div>

            <div className="form-group">
              <label>Finance Cost</label>
              <input
                type="number"
                value={financeCost}
                onChange={(e) => setFinanceCost(e.target.value)}
                placeholder="Enter Finance Cost"
              />
            </div>
          </div>

          <div className="form-column">

            <div className="form-group">
              <label>Depreciation</label>
              <input
                type="number"
                value={depreciation}
                onChange={(e) => setDepreciation(e.target.value)}
                placeholder="Enter Depreciation"
              />
            </div>

            <div className="form-group">
              <label>Other Expense</label>
              <input
                type="number"
                value={otherExpense}
                onChange={(e) => setOtherExpense(e.target.value)}
                placeholder="Enter Other Expense"
              />
            </div>

            <div className="form-group">
              <label>Current Tax</label>
              <input
                type="number"
                value={currentTax}
                onChange={(e) => setCurrentTax(e.target.value)}
                placeholder="Enter Current Tax"
              />
            </div>

            <div className="form-group">
              <label>Deferred Tax</label>
              <input
                type="number"
                value={deferredTax}
                onChange={(e) => setDeferredTax(e.target.value)}
                placeholder="Enter Deferred Tax"
              />
            </div>
          </div>

          <div className="form-column">
            <div className="form-group">
              <label>Fringe Benefit</label>
              <input
                type="number"
                value={fringeBenefit}
                onChange={(e) => setFringeBenefit(e.target.value)}
                placeholder="Enter Fringe Benefit"
              />
            </div>

            <div className="form-group">
              <label>MAT Credit</label>
              <input
                type="number"
                value={matCredit}
                onChange={(e) => setMatCredit(e.target.value)}
                placeholder="Enter MAT Credit"
              />
            </div>

            <div className="form-group">
              <label>Total Expenses: {totalExpense}</label>
            </div>

            <div className="form-group">
              <label>Total Tax Expense: {totalTax}</label>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn btn-submit" onClick={handleSubmit} disabled={isAddDisabled}>Add</button>
        </div>
      </div>
    </div>

  );
};

export default AddExpenseModal;
