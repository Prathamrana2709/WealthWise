import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AddNewMember.css';
import logo from '../assets/Logo.png';
import FluidCanvas from '../canvas/FluidCanvas'; // Import the fluid canvas component

function AddNewMember() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'Finance Manager',
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('http://127.0.0.1:5001/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data.users))
      .catch((error) => console.error('Error fetching users:', error));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Email_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Must be at least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("Must contain at least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("Must contain at least one lowercase letter");
    if (!/\d/.test(password)) errors.push("Must contain at least one number");
    if (!/[!@_]/.test(password)) errors.push("Must contain either '@' or '_' as a special character");
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      const errors = validatePassword(value);
      setValidationErrors(errors);
      setPasswordStrength(errors.length === 0 ? "Strong" : errors.length <= 2 ? "Medium" : "Weak");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const url = editingUserId
      ? `http://127.0.0.1:5001/api/update/${editingUserId}`
      : 'http://127.0.0.1:5001/api/register';
  
    fetch(url, {
      method: editingUserId ? 'PUT' : 'POST',  // Use PUT for updates
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Email_id: formData.email,
        Name: formData.name,
        password: formData.password,
        role: formData.role,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setNotification({ type: 'success', message: data.message });
          fetchUsers();
        } else {
          setNotification({ type: 'error', message: data.error });
        }
        resetForm();
      })
      .catch((error) => {
        setNotification({ type: 'error', message: 'Error updating user: ' + error });
      });
  };
  
  const handleEdit = (user) => {
    setFormData({
      email: user.Email_id,
      name: user.Name,
      password: '',
      role: user.role,
    });
    setEditingUserId(user.Email_id);
    setShowForm(true);
  };

  const handleDelete = (userId) => {
    fetch(`http://127.0.0.1:5001/api/delete/${userId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        setNotification({ type: 'success', message: data.message });
        fetchUsers();
      })
      .catch((error) => {
        setNotification({ type: 'error', message: 'Error deleting user: ' + error });
      });
  };

  const resetForm = () => {
    setFormData({ email: '', name: '', password: '', role: 'Finance Manager' });
    setEditingUserId(null);
    setShowForm(false);
    setValidationErrors([]);
    setPasswordStrength('');
  };

  return (
    <div className="wrapper">
      <FluidCanvas />
      <div className="add-member-container">
    <nav className="navbar">
      <div className="logo-sec">
        <img src={logo} alt="logo" />
        <div className="logo-text"><h1>WealthWise</h1></div>
      </div>
      {!showForm && (
        <input
          type="text"
          placeholder="Search..."
          className="navbar-search small-search-bar"
          value={searchTerm}
          onChange={handleSearch}
        />
      )}
      <div className="navbar-links">
        <Link to='/dashboard' className="navbar-link">Back</Link>
      </div>
    </nav>

    <div className='main-title'>
      <h1>{showForm ? (editingUserId ? 'Edit Member' : 'Add New Member') : 'Users List'}</h1>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="add-btn">Add New Member</button>
      )}
    </div>

    {showForm ? (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          <p className={`password-strength ${passwordStrength.toLowerCase()}`}>Strength: {passwordStrength}</p>
          {validationErrors.length > 0 && (
            <ul className="validation-errors">
              {validationErrors.map((error, index) => <li key={index}>{error}</li>)}
            </ul>
          )}
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
          <option value="Finance Manager">Finance Manager</option>
              <option value="Chief Financial Officer (CFO)">Chief Financial Officer (CFO)</option>
              <option value="Financial Controller">Financial Controller</option>
              <option value="Data Analyst/Scientist">Data Analyst/Scientist</option>
              <option value="Compliance Officer">Compliance Officer</option>
              <option value="Financial Analyst/Advisor">Financial Analyst/Advisor</option>
              <option value="Budget Analyst">Budget Analyst</option>
              <option value="Treasury Manager">Treasury Manager</option>
              <option value="Customer Support Lead">Customer Support Lead</option>
              <option value="Compliance Auditor">Compliance Auditor</option>
          </select>
        </div>

        <button type="submit" className="form-submit-btn">{editingUserId ? 'Update Member' : 'Add Member'}</button>
        <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
      </form>
    ) : (
      <div className="user-list">
        {filteredUsers.length > 0 ? (
          <ul className="user-list">
          {filteredUsers.map(user => (
            <li key={user.Email_id}>
              <div>
                <strong>{user.Name} </strong>
                ({user.Email_id})<br />
                <span className="user-role">{user.role}</span>
              </div>
              <div>
                <button onClick={() => handleEdit(user)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(user.Email_id)} className="delete-btn">Delete</button>
              </div>
            </li>
          ))}
        </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    )}
  </div>
</div>
  );
}

export default AddNewMember;
