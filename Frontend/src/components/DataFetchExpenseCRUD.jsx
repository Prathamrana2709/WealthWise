import React, { useState } from 'react';
import '../styles/DataFetchExpense.css';

const DataFetchExpenseCRUD = ({ data, hideYear, onUpdate, onDelete }) => {
  const [selectedItems, setSelectedItems] = useState([]); // State to handle selected items

  return (
    <div className="expense-table-container">
      <table className="expense-table">
        <thead>
          <tr>
            {!hideYear && <th>Year</th>}
            <th>Category</th>
            <th>Amount (In Millions)</th>
            {/* <th className='action'>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <React.Fragment key={index}>
              <td>
                <div className="options">
                  <button onClick={() => onUpdate(item)} className="databox-update">Update</button>
                </div>
              </td>
              {Object.keys(item).map((key, i) => (
                !['_id', 'Fringe benefit tax', 'MAT credit entitlement', 'Total Tax Expense', 'Quarter', 'Year', 'Current Tax', 'Deferred Tax', 'Total Expenses'].includes(key) && (
                  <tr key={i}>
                    {!hideYear && <td>{item.Year}</td>}
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

export default DataFetchExpenseCRUD;
