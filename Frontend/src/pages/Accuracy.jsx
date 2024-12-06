import React, { useEffect, useState } from 'react';

function Accuracy() {
  const [testSummary, setTestSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/forecast/getaccuracy')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setTestSummary(data.test_summary || []); // Handle `test_summary` as an array
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h1 style={{ marginTop: "10rem" }}>Loading Algorithm Accuracy Data...</h1>;
  }

  if (error) {
    return <h1 style={{ marginTop: "10rem" }}>Error: {error}</h1>;
  }

  return (
    <div style={{ padding: '2em' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1em' }}>Model Accuracy Overview</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1em' }}>
        <thead>
          <tr style={{ backgroundColor: '#f9f9f9' }}>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>True Value</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Predicted Value</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Accuracy (%)</th>
          </tr>
        </thead>
        <tbody>
          {testSummary.map((item, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.date}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.category}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.true_value}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.predicted_value}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.accuracy}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Accuracy;
