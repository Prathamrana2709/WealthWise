import React from 'react';
import '../styles/DataBox.css'; // CSS for the table

// DataBox Component to show fetched data in a table format
function DataBox({ data }) {
  return (
    <div className="data-box">
      {data.length === 0 ? (
        <p>No data available for the selected year.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Quarter</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.year}</td>
                <td>{item.Quarter}</td>
                <td>{item.category}</td>
                <td>{item.Amount.toFixed(2)}</td> {/* Formatting amount to 2 decimal places */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DataBox;
