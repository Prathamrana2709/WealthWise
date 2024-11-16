import React, { useState, useEffect } from 'react';
import '../styles/AddNewExpense.css';

const AddRevenueModal = ({ section, onAdd, onCancel, existingEntries }) => {
  const [revenueOperations, setRevenueOperations] = useState('');
  //const [otherIncome, setOtherIncome] = useState('');
  const [totalRevenue, setTotalRevenue] = useState('');
  const [costofRevenue, setCostofRevenue] = useState('');
  const [grossMargin, setGrossMargin] = useState(0);
  const [sgaExpense, setSGAExpense] = useState('');
  const [operatingIncome, setOperatingIncome] = useState('');
  
  const [expenditure, setExpenditure] = useState('');
 // const [otherExpense, setOtherExpense] = useState('');
  const [beforeTax, setBeforeTax] = useState('');
  const [incomeTaxes , setIncomeTaxes ] = useState('');
  const [afterTax, setAfterTax] = useState(0);
  const [nonInterest, setNonInterest] = useState('');
  const [netIncome, setNetIncome] = useState(0);
 // const [netCash, setNetCash] = useState('');
  const [earnings, setEarnings] = useState('');
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [totalAssets, setTotalAssets] = useState('');
  const [totalLiabilities, setTotalLiabilities] = useState('');

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

  
  useEffect(() => {
    setGrossMargin(
      (parseFloat(totalRevenue) || 0) -
      (parseFloat(costofRevenue) || 0) 
     
    );

    setTotalExpenditure(
      (parseFloat(expenditure) || 0) +
      (parseFloat(sgaExpense) || 0) 
      
    );
    
    setAfterTax(
      (parseFloat(beforeTax) || 0) +
      (parseFloat(incomeTaxes) || 0) 
      
    );
    setNetIncome(
      (parseFloat(afterTax) || 0) -
      (parseFloat(nonInterest) || 0) 
      
    );
  }, [totalRevenue, costofRevenue, expenditure, sgaExpense, beforeTax, incomeTaxes, afterTax, nonInterest]);

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
    "Revenue from operations":revenueOperations,
    "Operating Income":operatingIncome,
    "Earnings per share":earnings,
    "Total Revenue": totalRevenue,
    "Total Assets":totalAssets,
    "Total Liabilities":totalLiabilities,
    "Cost of Revenue": costofRevenue,
    "Gross Margin": grossMargin,
    "SG&A Expense":sgaExpense,
    "Expenditure":expenditure,
    "Income Before Income Tax":beforeTax,
    "Income Taxes":incomeTaxes,
    "Income After Income Tax":afterTax,
    "Non controlling Interest":nonInterest,
    "Net Income":netIncome,
    "Total Expenditure":totalExpenditure
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
          {/* Similar form structure with input fields as AddExpenseModal */}
          <div className="form-column">
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
              <label>Total Revenue</label>
              <input
                type="number"
                value={totalRevenue}
                onChange={(e) => setTotalRevenue(e.target.value)}
                placeholder="Enter Total Revenue"
              />
            </div>

            <div className="form-group">
              <label>Cost of Revenue</label>
              <input
                type="number"
                value={ costofRevenue}
                onChange={(e) => setCostofRevenue(e.target.value)}
                placeholder="Enter Cost of Revenue"
              />
            </div>
            
          
            <div className="form-group">
              <label> Expenditure</label>
              <input
                type="number"
                value={ expenditure}
                onChange={(e) => setExpenditure(e.target.value)}
                placeholder="Enter Expenditure"
              />
            </div>
         

         

            <div className="form-group">
              <label> SG&A Expense</label>
              <input
                type="number"
                value={sgaExpense}
                onChange={(e) => setSGAExpense(e.target.value)}
                placeholder="Enter SG&A Expense"
              />
            </div>
            </div>
            <div className="form-column">
            <div className="form-group">
              <label>Income Before Income Tax</label>
              <input
                type="number"
                value={beforeTax}
                onChange={(e) => setBeforeTax(e.target.value)}
                placeholder="Enter Income Before Income Tax"
              />
            </div>

            <div className="form-group">
              <label> Income Taxes</label>
              <input
                type="number"
                value={incomeTaxes}
                onChange={(e) => setIncomeTaxes(e.target.value)}
                placeholder="Enter Income Taxes"
              />
            </div>
         
         
            <div className="form-group">
              <label>Non controlling Interest</label>
              <input
                type="number"
                value={ nonInterest}
                onChange={(e) => setNonInterest(e.target.value)}
                placeholder="Enter Non controlling Interest"
              />
            </div>
          
            <div className="form-group">
              <label>Revenue from operations</label>
              <input
                type="number"
                value={revenueOperations}
                onChange={(e) => setRevenueOperations(e.target.value)}
                placeholder="Enter Revenue from operations"
              />
            </div>
         </div>
          <div className="form-column">
            <div className="form-group">
              <label>Operating Income</label>
              <input
                type="number"
                value={operatingIncome}
                onChange={(e) => setOperatingIncome(e.target.value)}
                placeholder="Enter Operating Income"
              />
            </div>

            <div className="form-group">
              <label>Earnings per share</label>
              <input
                type="number"
                value={earnings}
                onChange={(e) => setEarnings(e.target.value)}
                placeholder="Enter Earnings per share"
              />
            </div>
          
            <div className="form-group">
              <label>Total Assets</label>
              <input
                type="number"
                value={totalAssets}
                onChange={(e) => setTotalAssets(e.target.value)}
                placeholder="Enter Total Assets"
              />
            </div>
            <div className="form-group">
              <label>Total Liabilities</label>
              <input
                type="number"
                value={totalLiabilities}
                onChange={(e) => setTotalLiabilities(e.target.value)}
                placeholder="Enter Total Liabilities"
              />
            </div>
       </div>
        
         <div className="form-column">
            <div className="form-group">
              <label>Gross Margin: {grossMargin}</label>
            </div>

            <div className="form-group">
              <label>Income After Income Tax: {afterTax}</label>
            </div>

            <div className="form-group">
              <label>Total Expenditure: {totalExpenditure}</label>
            </div>

            <div className="form-group">
              <label>Net Income: {netIncome}</label>
            </div>
          </div>
        
          </div>

        <div className="modal-actions">
          <button className="btn btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn btn-submit" onClick={handleSubmit}disabled={isAddDisabled}>Add</button>
        </div>
      
      </div>
    </div>
  );
};

export default AddRevenueModal;
