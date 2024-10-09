import React, { useState, useEffect } from 'react';
import DataBox from '../components/DataBox';
import '../styles/Liabilities.css'; // CSS for styling

const Liabilities = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    // Fetching data from an API (dummy API call simulation)
    const fetchData = async () => {
      const apiData = [
        // Equity data
        { year: '2024-25', quarter: 1, amount: 1523.87, type: 'Equity', category: 'Shareholder Equity' },
        { year: '2024-25', quarter: 2, amount: 1587.42, type: 'Equity', category: 'Retained Earnings' },
        { year: '2024-25', quarter: 3, amount: 1650.55, type: 'Equity', category: 'Common Stock' },
        { year: '2023-24', quarter: 4, amount: 1450.50, type: 'Equity', category: 'Shareholder Equity' },
        { year: '2023-24', quarter: 3, amount: 1387.67, type: 'Equity', category: 'Retained Earnings' },
        { year: '2023-24', quarter: 2, amount: 1300.89, type: 'Equity', category: 'Common Stock' },
    
        // Current Liabilities data
        { year: '2024-25', quarter: 1, amount: 2500.30, type: 'Current_Liability', category: 'Short-term Loans' },
        { year: '2024-25', quarter: 2, amount: 2600.50, type: 'Current_Liability', category: 'Accounts Payable' },
        { year: '2024-25', quarter: 3, amount: 2700.75, type: 'Current_Liability', category: 'Accrued Expenses' },
        { year: '2023-24', quarter: 4, amount: 2100.10, type: 'Current_Liability', category: 'Short-term Loans' },
        { year: '2023-24', quarter: 3, amount: 2200.25, type: 'Current_Liability', category: 'Accounts Payable' },
        { year: '2023-24', quarter: 2, amount: 2300.40, type: 'Current_Liability', category: 'Accrued Expenses' },
    
        // Non-Current Liabilities data
        { year: '2024-25', quarter: 1, amount: 1200.55, type: 'Non_Current_Liability', category: 'Long-term Provisions' },
        { year: '2024-25', quarter: 2, amount: 1250.85, type: 'Non_Current_Liability', category: 'Bonds Payable' },
        { year: '2024-25', quarter: 3, amount: 1350.95, type: 'Non_Current_Liability', category: 'Deferred Tax Liabilities' },
        { year: '2023-24', quarter: 4, amount: 1150.65, type: 'Non_Current_Liability', category: 'Long-term Provisions' },
        { year: '2023-24', quarter: 3, amount: 1100.35, type: 'Non_Current_Liability', category: 'Bonds Payable' },
        { year: '2023-24', quarter: 2, amount: 1050.20, type: 'Non_Current_Liability', category: 'Deferred Tax Liabilities' },
    
        // Additional Data for other years
        { year: '2025-26', quarter: 1, amount: 1550.95, type: 'Equity', category: 'Shareholder Equity' },
        { year: '2025-26', quarter: 2, amount: 1600.45, type: 'Current_Liability', category: 'Short-term Loans' },
        { year: '2025-26', quarter: 3, amount: 1650.85, type: 'Non_Current_Liability', category: 'Bonds Payable' },
        { year: '2025-26', quarter: 4, amount: 1750.25, type: 'Equity', category: 'Common Stock' },
        { year: '2025-26', quarter: 4, amount: 1850.75, type: 'Current_Liability', category: 'Accrued Expenses' },
        { year: '2025-26', quarter: 4, amount: 1950.50, type: 'Non_Current_Liability', category: 'Deferred Tax Liabilities' }
    ];
    

      setData(apiData);

      // Get unique years and set the most recent as selectedYear
      const years = [...new Set(apiData.map(item => item.year))].sort((a, b) => b.localeCompare(a));
      setAvailableYears(years);
      setSelectedYear(years[0]);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter the data based on the selected year
    const filtered = data.reduce((acc, item) => {
      if (item.year === selectedYear) {
        acc[item.type] = acc[item.type] ? [...acc[item.type], item] : [item];
      }
      return acc;
    }, {});
    setFilteredData(filtered);
  }, [data, selectedYear]);

  return (
    <div className="liabilities-container">
      <div className="filter-section">
        <label htmlFor="yearFilter">Filter by Year:</label>
        <select
          id="yearFilter"
          className="year-filter"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {availableYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="sections-container">
        {filteredData['Equity'] && (
          <div className="section">
            <h2 className='title-1'>Equity</h2>
            <DataBox data={filteredData['Equity']} hideYear={true} />
          </div>
        )}
        {filteredData['Current_Liability'] && (
          <div className="section">
            <h2 className='title-1'>Current Liabilities</h2>
            <DataBox data={filteredData['Current_Liability']} hideYear={true} />
          </div>
        )}
        {filteredData['Non_Current_Liability'] && (
          <div className="section">
            <h2 className='title-1'>Non-Current Liabilities</h2>
            <DataBox data={filteredData['Non_Current_Liability']} hideYear={true} />
          </div>
        )}
      </div>
      <br/><br/><br/>
    </div>
  );
};

export default Liabilities;
