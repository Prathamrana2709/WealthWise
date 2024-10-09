import React from 'react';

const DataBox = ({ data, hideYear }) => {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Quarter</th>
          <th>Category</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.quarter}</td>
            <td>{item.category}</td>
            <td>{item.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataBox;
