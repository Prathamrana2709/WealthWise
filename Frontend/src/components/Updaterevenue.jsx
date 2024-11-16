import React, { useState, useEffect } from 'react';
import '../styles/AddNewExpense.css';

const Updaterevenue = ({ section, item, onUpdate, onCancel }) => {
  const [totalRevenue, setTotalRevenue] = useState(item["Total Revenue"] || '');
  const [costofRevenue, setCostofRevenue] = useState(item["Cost of Revenue"] || '');
  const [grossMargin, setGrossMargin] = useState(item["Gross Margin"] || 0);
  const [sgaExpense, setSGAExpense] = useState(item["SG&A Expense"] || '');
  const [expenditure, setExpenditure] = useState(item["Expenditure"] || '');
  const [beforeTax, setBeforeTax] = useState(item["Income Before Income Tax"] || '');
  const [incomeTaxes , setIncomeTaxes ] = useState(item["Income Taxes"] || '');
  const [afterTax, setAfterTax] = useState(item["Income After Income Tax"] || 0);
 const [nonInterest, setNonInterest] = useState(item["Non controlling Interest"] || '');
  const [netIncome, setNetIncome] = useState(item["Net Income"] || 0);
  const [totalExpenditure, setTotalExpenditure] = useState(item["Total Expenditure"] || 0);
  const [revenueOperations, setRevenueOperations] = useState(item["Revenue from operations"] || '');
  const [totalAssets, setTotalAssets] = useState(item["Total Assets"] || '');
  const [totalLiabilities, setTotalLiabilities] = useState(item["Total Liabilities"] || '');
  const [earnings, setEarnings] = useState(item["Earnings per share"] || '');
  const [operatingIncome, setOperatingIncome] = useState(item["Operating Income"] || '');
 

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


  const handleSubmit = () => {
    const updatedItem = {
      ...item,
      "Revenue from operations":revenueOperations,
      "Operating Income":operatingIncome,
      "Earnings per share":earnings,
      "Total Revenue": totalRevenue,
      "Total Assets":totalAssets,
      "Total Liabilities":totalLiabilities,
      " Cost of Revenue": costofRevenue,
      "Gross Margin": grossMargin,
      " SG&A Expense":sgaExpense,
      " Expenditure":expenditure,
      "Income Before Income Tax":beforeTax,
      " Income Taxes":incomeTaxes,
      "Income After Income Tax":afterTax,
      " Non controlling Interest":nonInterest,
      " Net Income":netIncome,
      " Total Expenditure":totalExpenditure
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
          <button className="btn btn-submit" onClick={handleSubmit}>Update</button>
        </div>
      
      </div>
    </div>
  );
};

export default Updaterevenue;
