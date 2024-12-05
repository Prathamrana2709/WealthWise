import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
// import '../styles/AssetsAndLiabilities.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

function AssetsAndLiabilities() {
  const [assetsData, setAssetsData] = useState([]);
  const [liabilitiesData, setLiabilitiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('1');
  const [filteredAssetsData, setFilteredAssetsData] = useState([]);
  const [filteredLiabilitiesData, setFilteredLiabilitiesData] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const responseAssets = await fetch('http://127.0.0.1:5001/api/assets/getAll', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        const responseLiabilities = await fetch('http://127.0.0.1:5001/api/liabilities/getAll', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        if (!responseAssets.ok) {
          throw new Error(`Error: ${responseAssets.status} ${responseAssets.statusText}`);
        }
        if (!responseLiabilities.ok) {
          throw new Error(`Error: ${responseLiabilities.status} ${responseLiabilities.statusText}`);
        }
        const assetsData = await responseAssets.json();
        const liabilitiesData = await responseLiabilities.json();
        setAssetsData(assetsData);
        setLiabilitiesData(liabilitiesData);
        const years = [...new Set([...assetsData, ...liabilitiesData].map((item) => item.Year))].sort((a, b) => b.localeCompare(a));
        setAvailableYears(years);
        setSelectedYear(years[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const filteredAssets = assetsData.filter(item => item.Year === selectedYear && item.Quarter === parseInt(selectedQuarter));
    const filteredLiabilities = liabilitiesData.filter(item => item.Year === selectedYear && item.Quarter === parseInt(selectedQuarter));
    setFilteredAssetsData(filteredAssets);
    setFilteredLiabilitiesData(filteredLiabilities);
  }, [assetsData, liabilitiesData, selectedYear, selectedQuarter]);

  const preparePieData = (data) => {
    return data.reduce((acc, item) => {
      const normalizedType = item.Type.toLowerCase();
      acc[normalizedType] = acc[normalizedType] ? acc[normalizedType] + item.Amount : item.Amount;
      return acc;
    }, {});
  };

  const assetsPieData = Object.keys(preparePieData(filteredAssetsData)).map(key => ({
    name: key.replace('_', ' ').toUpperCase(),
    value: preparePieData(filteredAssetsData)[key],
  }));

  const liabilitiesPieData = Object.keys(preparePieData(filteredLiabilitiesData)).map(key => ({
    name: key.replace('_', ' ').toUpperCase(),
    value: preparePieData(filteredLiabilitiesData)[key],
  }));

  return (
    <div className="assets-liabilities-container">
      <div className="filter-section">
        <h1 className="title-1">Assets and Liabilities</h1>
        <label htmlFor="yearFilter">Filter by Year:</label>
        <select
          id="yearFilter"
          className="year-filter"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <label htmlFor="quarterFilter">Filter by Quarter:</label>
        <select
          id="quarterFilter"
          className="quarter-filter"
          value={selectedQuarter}
          onChange={(e) => setSelectedQuarter(e.target.value)}
        >
          {['1', '2', '3', '4'].map((quarter) => (
            <option key={quarter} value={quarter}>
              Q{quarter}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>Assets</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={assetsPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={180}
                label
              >
                {assetsPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ color: 'black' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="color-description">
            <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '2em 0' }}>
              {assetsPieData.map((entry, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
                  <div style={{ width: '15px', height: '15px', backgroundColor: COLORS[index % COLORS.length], marginRight: '10px', borderRadius: '3px' }}></div>
                  <span style={{ color: 'black', marginRight: '5px' }}>{entry.name}:</span>
                  <span style={{ color: 'black', fontWeight: 'bold' }}>{entry.value.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>

          <h2>Liabilities</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={liabilitiesPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={180}
                label
              >
                {liabilitiesPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ color: 'black' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="color-description">
            <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '2em 0' }}>
              {liabilitiesPieData.map((entry, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
                  <div style={{ width: '15px', height: '15px', backgroundColor: COLORS[index % COLORS.length], marginRight: '10px', borderRadius: '3px' }}></div>
                  <span style={{ color: 'black', marginRight: '5px' }}>{entry.name}:</span>
                  <span style={{ color: 'black', fontWeight: 'bold' }}>{entry.value.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default AssetsAndLiabilities;
