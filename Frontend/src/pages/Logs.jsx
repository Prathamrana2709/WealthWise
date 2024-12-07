import React, { useEffect, useState } from 'react';
import '../styles/Logs.css';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/get-logs')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setLogs(data.logs || []);
        setFilteredLogs(data.logs || []);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = logs.filter(
      (log) =>
        log.username.toLowerCase().includes(query) ||
        log.role.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query)
    );

    setFilteredLogs(filtered);
  };

  if (loading) {
    return <h1 className="loading">Loading...</h1>;
  }

  if (error) {
    return <h1 className="error">Error: {error}</h1>;
  }

  if (!logs.length) {
    return <h1 className="no-logs">No logs available.</h1>;
  }

  return (
    <div className="logs-container">
      <h1 className="title">User Activity Logs</h1>
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by username, role, or action..."
        />
      </div>
      <table className="logs-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Username</th>
            <th>Role</th>
            <th>Action</th>
            <th>User Agent</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log, index) => (
            <tr key={index}>
              <td>{new Date(log.timestamp).toLocaleDateString('en-GB')}</td>
              <td>{new Date(log.timestamp).toLocaleTimeString('en-GB', { hour12: true })}</td>
              <td>{log.username}</td>
              <td>{log.role}</td>
              <td>{log.action}</td>
              <td className="user-agent">{log.user_agent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Logs;
