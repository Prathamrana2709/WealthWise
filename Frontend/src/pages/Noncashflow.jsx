// import React, { useState, useEffect } from 'react';
// import DataBox from '../components/Databoxsimple';
// import '../styles/Assets.css'; // CSS for styling

// const Noncashflow = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState({});
//   const [selectedYear, setSelectedYear] = useState('');
//   const [availableYears, setAvailableYears] = useState([]);

//   useEffect(() => {
//     // Fetch data from the API
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:5001/api/cashflow/getAll', {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
//         }
        
//         const apiData = await response.json();
//         setData(apiData);
        
//         const years = [...new Set(apiData.map(item => item.Year))].sort((a, b) => b.localeCompare(a));
//         setAvailableYears(years);
//         setSelectedYear(years[0]);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     // Normalize the `Type` to handle case sensitivity
//     const filtered = data.reduce((acc, item) => {
//       if (item.Year === selectedYear) {
//         const normalizedType = item['In/Out'].toLowerCase().replace(/_/g, ' '); // Convert type to lowercase and replace underscores with spaces
//         acc[normalizedType] = acc[normalizedType] ? [...acc[normalizedType], item] : [item];
//       }
//       return acc;
//     }, {});

//     console.log('Filtered Data:', filtered); // Check if this contains expected sections
//     setFilteredData(filtered);
//   }, [data, selectedYear]);

//   console.log(filteredData);

//   return (
//     <div className="Assets-container">
//       <h1>Cashflow</h1>
//       <div className="filter-section">
//         <label htmlFor="yearFilter">Filter by Year:</label>
//         <select
//           id="yearFilter"
//           className="year-filter"
//           value={selectedYear}
//           onChange={(e) => setSelectedYear(e.target.value)}
//         >
//           {availableYears.map(year => (
//             <option key={year} value={year}>
//               {year}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="sections-container">
//         {filteredData['in'] && ( // Match the normalized type
//           <div className="section">
//             <h2 className='title-1'>Cash-In</h2>
//             <DataBox data={filteredData['in']} hideYear={true} />
//           </div>
//         )}
//         {filteredData['out'] && ( // Match the normalized type
//           <div className="section">
//             <h2 className='title-1'>Cash-Out</h2>
//             <DataBox data={filteredData['out']} hideYear={true} />
//           </div>
//         )}
//       </div>
//       <br /><br /><br />
//     </div>
//   );
// };

// export default Noncashflow;

import React, { useState, useEffect } from 'react';
import DataBox from '../components/Databoxsimple';
// Match casing exactly
import '../styles/Liabilities.css';

const CashFlow = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/cashflow/getAll', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const apiData = await response.json();
      setData(apiData);
      const years = [...new Set(apiData.map((item) => item.Year))].sort((a, b) => b.localeCompare(a));
      setAvailableYears(years);
      setSelectedYear(years[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.reduce((acc, item) => {
      if (item.Year === selectedYear) {
        const normalizedType = item.Type === 'Operating' ? 'in' : 'out'; 

        acc[normalizedType] = acc[normalizedType] ? [...acc[normalizedType], item] : [item];
      }
      return acc;
    }, {});
    console.log("Filtered Data:", filtered);
    setFilteredData(filtered);
  }, [data, selectedYear]);

 

  
  return (
    <div className="liabilities-container">
      <div className="filter-section">
        <h1 className="title-1">CashFlow</h1>
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
      </div>

      <div className="sections-container">
        {['in', 'out'].map((section) => (
          <div key={section} className="section">
            <div className="section-header">
              <h2 className="title-1">{section.replace('_', ' ').toUpperCase()}</h2>
              
            </div>

            {filteredData[section] && (
              <DataBox
                data={filteredData[section]} // Make sure filteredData is properly structured
                hideYear={true}
                deleteMode={false} // Keep this if DataBox uses it to hide delete options
              />
            )}
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddNewAssets
          section={selectedSection}
          onAdd={addNewItem}
          onCancel={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default CashFlow;
