import React, { useState } from 'react';
import '../styles/DataFetchExpense.css';

const DataFetchRevenue = ({ data, hideYear, deleteMode, onCheckboxChange, onUpdate, onDelete }) => {
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
               !['_id', 'Year', 'Revenue from operations', 'Other Income', 'Operating Income', 'Other Expense', 'Quarter', 'Non controlling Interest', 'Earnings per share', 'Total Assets','Total Liabilities','Budget','Net Cash','Total Revenue'].includes(key) && (
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
                <td><strong>Total Revenues:</strong></td>
                <td><strong>{item['Total Revenue']}</strong></td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataFetchRevenue;
