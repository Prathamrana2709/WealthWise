import React, { useState, useEffect } from 'react';
import '../styles/AddNewExpense.css';

const UpdateExpense = ({ section, item, onUpdate, onCancel }) => {
  const [employeeBenefit, setEmployeeBenefit] = useState(item["Employee Benefit Expense"] || '');
  const [costOfEquipment, setCostOfEquipment] = useState(item["Cost of Equipment and software Licences"] || '');
  const [financeCost, setFinanceCost] = useState(item["Finance Costs"] || '');
  const [depreciation, setDepreciation] = useState(item["Depreciation and Amortisation Costs"] || '');
  const [otherExpense, setOtherExpense] = useState(item["Other Expenses"] || '');
  const [currentTax, setCurrentTax] = useState(item["Current Tax"] || '');
  const [deferredTax, setDeferredTax] = useState(item["Deferred Tax"] || '');
  const [fringeBenefit, setFringeBenefit] = useState(item["Fringe benefit tax"] || '');
  const [matCredit, setMatCredit] = useState(item["MAT credit entitlement"] || '');
  const [totalExpense, setTotalExpense] = useState(item["Total Expenses"] || 0);
  const [totalTax, setTotalTax] = useState(item["Total Tax Expense"] || 0);

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

  const handleSubmit = () => {
    const updatedItem = {
      ...item,
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

    onUpdate(updatedItem);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update {section.replace('_', ' ')
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}
        </h2>

        <div className="form-container">
          {/* Similar form structure with input fields as AddExpenseModal */}
          <div className="form-column">
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
          </div>

          <div className="form-column">
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
          </div>

          <div className="form-column">
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
          <button className="btn btn-submit" onClick={handleSubmit}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateExpense;
