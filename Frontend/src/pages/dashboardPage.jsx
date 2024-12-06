import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "react-circular-progressbar/dist/styles.css"; 
import "../styles/dashboardPage.css";

function Analysis() {
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [cashIn, setCashIn] = useState(0);
  const [cashOut, setCashOut] = useState(0);
  const [error, setError] = useState(null);
  const [assets, setAssets] = useState(0);
  const [liabilities, setLiabilities] = useState(0);
  const [equity, setEquity] = useState(0);
  useEffect(() => {
    setEquity(assets - liabilities);
  }, [assets, liabilities]);

  useEffect(() => {
    fetchData();
    fetchCashflowTotals("2023-24"); // Replace "2023-24" with dynamic year if needed
    fetchTotalAssets("2023-24");  // Fetch total assets
    fetchTotalLiabilities("2023-24");  // Fetch total liabilities
  }, []);
  

  const fetchData = async () => {
    try {
      const revenueResponse = await fetch("http://127.0.0.1:5001/api/revenues/getAll");
      const revenueData = await revenueResponse.json();
      setRevenues(revenueData);

      const expenseResponse = await fetch("http://127.0.0.1:5001/api/expenses/getAll");
      const expenseData = await expenseResponse.json();
      setExpenses(expenseData);

      const combined = processCombinedData(revenueData, expenseData);
      setCombinedData(combined);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCashflowTotals = async (year) => {
    try {
      const response = await fetch("http://127.0.0.1:5001/api/cashflow/total?year=2023-24");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data && data.Totals) {
        setCashIn(data.Totals.In || 0);
        setCashOut(data.Totals.Out || 0);
        console.log(data);
      } else {
        console.error("Unexpected API response:", data);
      }
    } catch (error) {
      console.error("Error fetching cashflow totals:", error);
    }
  };

 
  // Corrected fetchTotalAssets function
const fetchTotalAssets = async (year) => {
  try {
    const response = await fetch(`http://127.0.0.1:5001/api/assets/total?year=${year}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch total assets");
    }
    const data = await response.json();
    setAssets(data.TotalAssets || 0); // Update state correctly
    console.log(data);
  } catch (err) {
    setError(`Error fetching total assets: ${err.message}`);
  }
};

// Corrected fetchTotalLiabilities function
const fetchTotalLiabilities = async (year) => {
  try {
    const response = await fetch(`http://127.0.0.1:5001/api/liabilities/total?year=${year}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch total liabilities");
    }
    const data = await response.json();
    setLiabilities(data.TotalLiabilities || 0); // Update state correctly
    console.log(data);
  } catch (err) {
    setError(`Error fetching total liabilities: ${err.message}`);
  }
};  

  const processCombinedData = (revenues, expenses) => {
    const dataByYear = {};
    revenues.forEach((rev) => {
      const year = rev.Year;
      if (!dataByYear[year]) {
        dataByYear[year] = { year, TotalRevenue: 0, TotalExpense: 0 };
      }
      dataByYear[year].TotalRevenue += rev["Total Revenue"] || 0;
    });

    expenses.forEach((exp) => {
      const year = exp.Year;
      if (!dataByYear[year]) {
        dataByYear[year] = { year, TotalRevenue: 0, TotalExpense: 0 };
      }
      dataByYear[year].TotalExpense += exp["Total Expenses"] || 0;
    });

    return Object.values(dataByYear).sort((a, b) => parseInt(a.year) - parseInt(b.year));
  };

  return (
    <div className="analysis-container">
      <div className="chart-and-totals-container">
        <div className="bar-chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                interval={0}
                label={{ value: "", position: "insideBottom", offset: -5 }}
                tick={{ angle: -45, textAnchor: "end", fontSize: 12 }}
                padding={{ top: 20 }}
              />
              <YAxis
                label={{ value: "(Millions)", angle: 0, position: "insideBottom", offset: 15 }}
                width={80}
              />
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ marginBottom: -20 }}
              />
              <Bar dataKey="TotalRevenue" fill="#8884d8" name="Total Revenue" />
              <Bar dataKey="TotalExpense" fill="#82ca9d" name="Total Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="totals-container">
  <div className="total-box">
    
    <h3>Total Cash-In</h3>
    <p>{`${cashIn.toLocaleString()}`}</p>
    
  </div>
  <div className="total-box">
    
       <h3>Total Cash-Out</h3>
    <p>{`${cashOut.toLocaleString()}`}</p>
   
  </div>
</div>

      </div>

      <div className="financial-summary">
  <div className="financial-box">
    <h3>Total Assets</h3>
    <p>{`${assets.toLocaleString()}`}</p>
  </div>
  <div className="financial-box">
    <h3>Total Liabilities</h3>
   
    <p>{`${liabilities.toLocaleString()}`}</p>
  </div>
  <div className="financial-box">
    <h3>Total Equity</h3>
    <p>{`${equity.toLocaleString()}`}</p>
  </div>
</div>

    </div>
  );
}

export default Analysis;
