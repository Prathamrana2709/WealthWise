import React from 'react';
import '../styles/DataFetchExpense.css';  // Import the CSS file

const DataFetchRevenue = ({ expenseData }) => {
  return (
    <div className="expense-table-container">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount (In Millions)</th>
          </tr>
        </thead>
        <tbody>
          {expenseData.map((item, index) => (
            <React.Fragment key={index}>
              {Object.keys(item).map((key, i) => (
                !['_id', 'Year', 'Revenue from operations', 'Other Income', 'Operating Income', 'Other Expense', 'Quarter', 'Non controlling Interest', 'Earnings per share', 'Total Assets','Total Liabilities','Budget','Net Cash'].includes(key) && (
                  <tr key={i}>
                    <td>{key}</td>
                    <td>{item[key]}</td>
                  </tr>
                )
              ))}
             
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataFetchRevenue;