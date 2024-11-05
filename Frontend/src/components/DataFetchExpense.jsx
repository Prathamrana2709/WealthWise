import React, { useState } from 'react';
import '../styles/DataFetchExpense.css';

const DataFetchExpense = ({ data, hideYear, deleteMode, onCheckboxChange, onUpdate, onDelete }) => {
  const [selectedItems, setSelectedItems] = useState([]); // State to handle selected items

  const handleCheckboxChange = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((selected) => selected !== item)
        : [...prevSelected, item]
    );
    onCheckboxChange(item); // Trigger the external checkbox change handler
  };

  return (
    <div className="expense-table-container">
      <table className="expense-table">
        <thead>
          <tr>
            {deleteMode && <th>Select</th>}
            {!hideYear && <th>Year</th>}
            <th>Category</th>
            <th>Amount (In Millions)</th>
           
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <React.Fragment key={index}>
              {Object.keys(item).map((key, i) => (
                !['_id', 'Fringe benefit tax', 'MAT credit entitlement', 'Total Tax Expense', 'Quarter', 'Year','Current Tax', 'Deferred Tax', 'Total Expenses'].includes(key) && (
                  <tr key={i}>
                    {deleteMode && (
                      <td>
                        <input
                          type="checkbox"
                          onChange={() => handleCheckboxChange(item)}
                          checked={selectedItems.includes(item)} // Checkbox for item selection
                        />
                      </td>
                    )}
                    {!hideYear && <td>{item.Year}</td>}
                    <td>{key}</td>
                    <td>{item[key]}</td>
                    <td>
                     
                    </td>
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
