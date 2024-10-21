import React, { useState } from 'react';

const DataBox = ({ data, hideYear, deleteMode, onCheckboxChange, onUpdate }) => {
  const [showOptions, setShowOptions] = useState(null);

  return (
    <table className="data-table">
      <thead>
        <tr>
          {deleteMode && <th>Select</th>}
          <th>Quarter</th>
          <th>Category</th>
          <th>Amount (In Millions)</th>
          <th>Actions</th>
          <th style={{ width: '10%' }}></th> {/* Empty header for three-dot options */}
        </tr>
      </thead>
      <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.Category}</td>
              <td>{item.Amount}</td>
              <td>{item.Year}</td>
              <td>{item.Quarter}</td>
              <td>
                <button onClick={() => onUpdate(item)}>Update</button> {/* Pass item to handle update */}
                <button onClick={() => onDelete(item)}>Delete</button> {/* Pass item to handle delete */}
              </td>
            </tr>
          ))}
        

{data.map((item, index) => (
  <tr key={item.id || index}
  onMouseEnter={() => setShowOptions(index)}
            onMouseLeave={() => setShowOptions(null)}>
               {deleteMode && (
              <td>
                <input
                  type="checkbox"
                  onChange={() => onCheckboxChange(item)}
                  checked={selectedItems.includes(item)}
                />
              </td>
            )}
     <td>{item.Quarter}</td>
            <td>{item.Category}</td>
            <td>{item.Amount}</td>
 
  </tr>
))}

      </tbody>
    </table>
  );
};

export default DataBox;
