import React, { useEffect, useState } from 'react';

function ForecastLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/forecast/getlogs')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setLogs(data || []);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h1 style={{ marginTop: "10rem" }}>Loading...</h1>;
  }

  if (error) {
    return <h1 style={{ marginTop: "10rem" }}>Error: {error}</h1>;
  }

  if (!logs.length) {
    return <h1 style={{ marginTop: "10rem" }}>No logs available.</h1>;
  }

  return (
    <div style={{ padding: '2em' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1em' }}>Forecast Logs</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1em', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date of Logging</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Time of Logging</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>User</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Role</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Forecast Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Value (₹ in crores)</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, logIndex) => (
            <>
              {/* Render common fields only once for each log entry */}
              <tr>
                <td
                  rowSpan={log.forecast_date.length * (Object.keys(log.forecasts).length + 1)}
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    verticalAlign: 'top',
                    textAlign: 'center',
                  }}
                >
                  {new Date(log.timestamp).toLocaleDateString('en-GB')}
                </td>
                <td
                  rowSpan={log.forecast_date.length * (Object.keys(log.forecasts).length + 1)}
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    verticalAlign: 'top',
                    textAlign: 'center',
                  }}
                >
                  {new Date(log.timestamp).toLocaleTimeString('en-GB', { hour12: true })}
                </td>
                <td
                  rowSpan={log.forecast_date.length * (Object.keys(log.forecasts).length + 1)}
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    verticalAlign: 'top',
                    textAlign: 'center',
                  }}
                >
                  {log.user}
                </td>
                <td
                  rowSpan={log.forecast_date.length * (Object.keys(log.forecasts).length + 1)}
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    verticalAlign: 'top',
                    textAlign: 'center',
                  }}
                >
                  {log.role}
                </td>
              </tr>
              {log.forecast_date.map((forecastDate, forecastIndex) => {
                const categories = Object.entries(log.forecasts);

                return (
                  <>
                    {categories.map(([category, values], categoryIndex) => (
                      <tr key={`${logIndex}-${forecastIndex}-${categoryIndex}`}>
                        {/* Forecast Date */}
                        {categoryIndex === 0 && (
                          <td
                            rowSpan={categories.length + 1}
                            style={{
                              border: '1px solid #ddd',
                              padding: '8px',
                              verticalAlign: 'top',
                            }}
                          >
                            {forecastDate}
                          </td>
                        )}

                        {/* Category and Value */}
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{category}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                          {values[forecastIndex].toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {/* Total Expense */}
                    <tr>
                      <td
                        //colSpan={2}
                        style={{
                          border: '1px solid #ddd',
                          padding: '8px',
                          fontWeight: 'bold',
                          textAlign: 'right',
                        }}
                      >
                        Total Expense:
                      </td>
                      <td
                        style={{
                          border: '1px solid #ddd',
                          padding: '8px',
                          fontWeight: 'bold',
                        }}
                      >
                        {log.total_expense_forecast[forecastIndex].toFixed(2)}
                      </td>
                    </tr>
                  </>
                );
              })}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ForecastLogs;
