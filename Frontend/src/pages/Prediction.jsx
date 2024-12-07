import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import "../styles/Predict.css";

function Prediction() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#6BAED6', '#74C476', '#FD8D3C', '#9E9AC8', '#FDD49E'];
  const role = sessionStorage.getItem('Role');
  const name = sessionStorage.getItem('Name');

  useEffect(() => {
    fetch('http://localhost:5001/api/forecast/getprediction')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleLog = () => {
    if (!data) {
      alert('No data available to log.');
      return;
    }

    fetch('http://localhost:5001/api/forecast/flog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user : name,
        role : role,
        forecast_dates : data.forecast_dates,
        forecasts: data.forecasts,
        total_expense_forecast: data.total_expense_forecast,
      }),
    })
      .then((response) => {
        console.log(data)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((response) => {
        alert('Predictions logged successfully!');
        console.log('Log response:', response);
      })
      .catch((error) => {
        console.error('Error logging data:', error);
        alert('Failed to log predictions.');
      });
  };

  const CustomTooltipPer = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((payload[0].value / total) * 100).toFixed(2);

      return (
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '5px',
            color: '#333',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].name}</p>
          <p style={{ margin: 0 }}>Value: ₹{payload[0].value.toLocaleString()}</p>
          {/* <p style={{ margin: 0 }}>Percentage: {percentage}%</p> */}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <h1 style={{ marginTop: "10rem" }}>Loading Prediction Results...</h1>;
  }

  if (error) {
    return <h1 style={{ marginTop: "10rem" }}>Error: {error}</h1>;
  }

  if (!data || !data.forecast_dates || !data.forecasts || !data.total_expense_forecast) {
    return <h1 style={{ marginTop: "10rem" }}>No data available</h1>;
  }

  const renderPieChart = (index) => {
    const pieData = Object.entries(data.forecasts).map(([category, values]) => ({
      name: category,
      value: values[index],
    }));

    const totalExpense = data.total_expense_forecast[index];

    return (
      <div
        key={index}
        style={{
          marginBottom: '2em',
          padding: '1em',
          border: '1px solid #ccc',
          borderRadius: '10px',
          backgroundColor: '#f9f9f9',
        }}
      >
        {/* Heading and Total Expense */}
        <div style={{ textAlign: 'center', marginBottom: '1em' }}>
          <h2 style={{ color: '#333' }}>For the quarter ending at {data.forecast_dates[index]}</h2>
          <h3 style={{ color: '#FF8042' }}>Total Expense: ₹ {totalExpense.toLocaleString()}</h3>
        </div>

        {/* Flexbox for Chart and Breakdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '2rem',
          }}
        >
          {/* Pie Chart */}
          <ResponsiveContainer width="50%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
              >
                {pieData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltipPer />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Expense Breakdown */}
          <div style={{ marginTop: '5rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#333' }}>Expense Breakdown:</h4>
            <ul style={{ padding: '0', listStyle: 'none', color: '#333' }}>
              {pieData.map((entry, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                    color: '#555',
                    fontWeight: 'bold',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '15px',
                        height: '15px',
                        backgroundColor: COLORS[i % COLORS.length],
                        marginRight: '10px',
                      }}
                    ></div>
                    {entry.name}: ₹ {entry.value.toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '2em' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1em' }}>Prediction Overview</h1>
      <p style={{ textAlign: 'center', marginBottom: '2em', fontStyle: 'italic' }}>
        (All values are in crores)
      </p>
      {data.forecast_dates.map((_, index) => renderPieChart(index))}

      {/* Log Button */}
      <div style={{ textAlign: 'center', marginTop: '2em' }}>
        <button
          onClick={handleLog}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Log Predictions
        </button>
      </div>
    </div>
  );
}

export default Prediction;
