import React from 'react';

const DataBox = ({ data, hideYear }) => {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Quarter</th>
          <th>Category</th>
          <th>Amount(In Millions)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
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
