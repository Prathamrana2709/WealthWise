import React from 'react';
import '../styles/DataBox.css';

const Databoxsimple = ({ data, hideYear, deleteMode, onCheckboxChange }) => {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {deleteMode && <th>Select</th>}
          {!hideYear && <th>Year</th>}
          <th>Quarter</th>
          <th>Category</th>
          <th>Amount (In Millions)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {deleteMode && (
              <td>
                <input
                  type="checkbox"
                  onChange={() => onCheckboxChange(item)}
                />
              </td>
            )}
            {!hideYear && <td>{item.Year}</td>}
            <td>{item['Quarter']}</td>
            <td>{item['Category']}</td>
            <td>{item['Amount']}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Databoxsimple;
