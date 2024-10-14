import React from 'react';
import '../styles/DataFetchExpense.css';  // Import the CSS file

const DataFetchExpense = ({ expenseData }) => {
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
                !['_id', 'Year', 'Other Expenses', 'Fringe benefit tax', 'MAT credit entitlement', 'Total Tax Expense', 'Quarter', 'Current Tax', 'Deferred Tax', 'Total Expenses'].includes(key) && (
                  <tr key={i}>
                    <td>{key}</td>
                    <td>{item[key]}</td>
                  </tr>
                )
              ))}
              <tr>
                <td><strong>Total Expenses:</strong></td>
                <td><strong>{item['Total Expenses']}</strong></td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataFetchExpense;
