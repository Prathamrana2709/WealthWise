import React, { useState } from 'react';
import '../styles/DataBox.css';

const DataBox = ({ data, hideYear, deleteMode, onCheckboxChange, onUpdate, onDelete }) => {
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
    <table className="data-table">
      <thead>
        <tr>
          {deleteMode && <th>Select</th>}
          {!hideYear && <th>Year</th>}
          <th>Quarter</th>
          <th>Category</th>
          <th>Amount ₹ (In Millions)</th>
          <th className='action'>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
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
            <td>{item['Quarter']}</td>
            <td>{item['Category']}</td>
            <td>{item['Amount']}</td>
            <td>
              <div className="options">
                <button onClick={() => onUpdate(item)} className="databox-update">Update</button>
                <button onClick={() => onDelete(item)} className='databox-delete'>Delete</button> {/* Call onDelete for deletion */}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataBox;
// added ₹ symbol 