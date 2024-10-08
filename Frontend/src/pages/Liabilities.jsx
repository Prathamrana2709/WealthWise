import React, { useState } from 'react';
import DataBox from '../components/DataBox'; // Ensure the DataBox is imported
import '../styles/DataBox.css'; // Import CSS for DataBox

// Liabilities Component to filter and organize data
function Liabilities() {
  const [selectedYear, setSelectedYear] = useState('2024-25');

  // Sample API data
  const apiData = [
    { year: '2024-25', Quarter: 1, Amount: 1523.87, type: 'Equity', category: 'Share Capital' },
    { year: '2024-25', Quarter: 1, Amount: 1020.53, type: 'Current_Liability', category: 'Short-term Borrowings' },
    { year: '2024-25', Quarter: 2, Amount: 873.90, type: 'Non_Current_Liability', category: 'Long-term Provisions' },
    { year: '2023-24', Quarter: 4, Amount: 1090.00, type: 'Equity', category: 'Reserves and Surplus' },
    { year: '2023-24', Quarter: 4, Amount: 1450.32, type: 'Current_Liability', category: 'Trade Payables' },
    { year: '2022-23', Quarter: 3, Amount: 930.40, type: 'Non_Current_Liability', category: 'Deferred Tax Liabilities' }
    // Add more data as necessary
  ];

  // Filter the data based on the selected year
  const filteredData = apiData.filter(item => item.year === selectedYear);

  // Divide data into sections based on type
  const equityData = filteredData.filter(item => item.type === 'Equity');
  const currentLiabilitiesData = filteredData.filter(item => item.type === 'Current_Liability');
  const nonCurrentLiabilitiesData = filteredData.filter(item => item.type === 'Non_Current_Liability');

  return (
    <div className="liabilities-container">
      {/* Year Filter Dropdown */}
      <div className="year-filter">
        <label htmlFor="year">Select Year:</label>
        <select id="year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="2024-25">2024-25</option>
          <option value="2023-24">2023-24</option>
          <option value="2022-23">2022-23</option>
          {/* Add more years as needed */}
        </select>
      </div>

      {/* Main Sections for Liabilities */}
      <div className="sections">
        <section className="section">
          <h2 className="section-heading">Equity</h2>
          <DataBox data={equityData} />
        </section>

        <section className="section">
          <h2 className="section-heading">Current Liabilities</h2>
          <DataBox data={currentLiabilitiesData} />
        </section>

        <section className="section">
          <h2 className="section-heading">Non-Current Liabilities</h2>
          <DataBox data={nonCurrentLiabilitiesData} />
        </section>
      </div>
    </div>
  );
}

export default Liabilities;
