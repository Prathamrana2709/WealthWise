import React, { useState, useEffect } from 'react';
import '../styles/Modal.css'; // Ensure you have a CSS file for styling the modal

const AddNewModal = ({ section, onAdd, onCancel }) => {
  const [category, setCategory] = useState('');
  const [employeeBenefit, setEmployeeBenefit] = useState(0);
  const [costOfEquipment, setCostOfEquipment] = useState(0);
  const [financeCost, setFinanceCost] = useState(0);
  const [depreciation, setDepreciation] = useState(0);
  const [otherExpense, setOtherExpense] = useState(0);
  const [currentTax, setCurrentTax] = useState(0);
  const [deferredTax, setDeferredTax] = useState(0);
  const [fringeBenefit, setFringeBenefit] = useState(0);
  const [matCredit, setMatCredit] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [year, setYear] = useState('');
  const [quarter, setQuarter] = useState('');

  console.log('section:', section);

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
  // Calculate the current financial year and quarter
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

  // Update total expense and tax whenever a relevant field changes
  useEffect(() => {
    setTotalExpense(
      parseFloat(employeeBenefit) + 
      parseFloat(costOfEquipment) + 
      parseFloat(financeCost) + 
      parseFloat(depreciation) + 
      parseFloat(otherExpense)
    );

    setTotalTax(
      parseFloat(currentTax) + 
      parseFloat(deferredTax) + 
      parseFloat(fringeBenefit) + 
      parseFloat(matCredit)
    );
  }, [employeeBenefit, costOfEquipment, financeCost, depreciation, otherExpense, currentTax, deferredTax, fringeBenefit, matCredit]);

  const handleSubmit = () => {
    const newItem = {
      Year: year,
      Quarter: quarter,
      Category: category,
      EmployeeBenefitExpense: employeeBenefit,
      CostOfEquipment: costOfEquipment,
      FinanceCost: financeCost,
      Depreciation: depreciation,
      OtherExpense: otherExpense,
      TotalExpense: totalExpense,
      CurrentTax: currentTax,
      DeferredTax: deferredTax,
      FringeBenefitTax: fringeBenefit,
      MATCreditEntitlement: matCredit,
      TotalTax: totalTax,
    };

    onAdd(newItem);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New {section.replace('_', ' ').toUpperCase()}</h2>

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
          <label>Cost of Equipment and Software Licenses</label>
          <input
            type="number"
            value={costOfEquipment}
            onChange={(e) => setCostOfEquipment(e.target.value)}
            placeholder="Enter Cost of Equipment"
          />
        </div>

        <div className="form-group">
          <label>Finance Costs</label>
          <input
            type="number"
            value={financeCost}
            onChange={(e) => setFinanceCost(e.target.value)}
            placeholder="Enter Finance Costs"
          />
        </div>

        <div className="form-group">
          <label>Depreciation and Amortisation Costs</label>
          <input
            type="number"
            value={depreciation}
            onChange={(e) => setDepreciation(e.target.value)}
            placeholder="Enter Depreciation"
          />
        </div>

        <div className="form-group">
          <label>Other Expenses</label>
          <input
            type="number"
            value={otherExpense}
            onChange={(e) => setOtherExpense(e.target.value)}
            placeholder="Enter Other Expenses"
          />
        </div>

        <div className="form-group">
          <label>Total Expenses: {totalExpense}</label>
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

        <div className="form-group">
          <label>Fringe Benefit Tax</label>
          <input
            type="number"
            value={fringeBenefit}
            onChange={(e) => setFringeBenefit(e.target.value)}
            placeholder="Enter Fringe Benefit Tax"
          />
        </div>

        <div className="form-group">
          <label>MAT Credit Entitlement</label>
          <input
            type="number"
            value={matCredit}
            onChange={(e) => setMatCredit(e.target.value)}
            placeholder="Enter MAT Credit"
          />
        </div>

        <div className="form-group">
          <label>Total Tax Expense: {totalTax}</label>
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

export default AddNewModal;