import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AddNewMember.css';

function AddNewMember() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'Finance Manager', // Default role
  });
  const [showPopup, setShowPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('http://127.0.0.1:5001/api/users') // API to fetch users
      .then((response) => response.json())
      .then((data) => setUsers(data.users))
      .catch((error) => console.error('Error fetching users:', error));
  };

  // Define the password strength validation function
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
    setFormData({
      ...formData,
      [name]: value,
    });

    // Handle password strength validation
    if (name === 'password') {
      const errors = validatePassword(value);
      setValidationErrors(errors);

      // Provide a password strength rating based on the number of criteria met
      if (errors.length === 0) {
        setPasswordStrength("Strong");
      } else if (errors.length <= 2) {
        setPasswordStrength("Medium");
      } else {
        setPasswordStrength("Weak");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const confirmAddUser = () => {
    // Call API to register user
    fetch('http://127.0.0.1:5001/api/register', {
      method: 'POST',
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
          alert(data.message);
          fetchUsers(); // Refresh user list
        } else {
          alert(data.error);
        }
        setShowPopup(false);
        // Clear form after successful addition
        setFormData({
          email: '',
          name: '',
          password: '',
          role: 'Finance Manager', // Reset default role
        });
        setValidationErrors([]); // Clear validation errors
        setPasswordStrength(''); // Reset password strength
      })
      .catch((error) => {
        alert('Error adding user:', error);
        setShowPopup(false);
      });
  };

  const handleDeleteUser = (userId) => {
    fetch(`http://127.0.0.1:5001/api/delete/${userId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        fetchUsers(); // Refresh user list
      })
      .catch((error) => console.error('Error deleting user:', error));
  };

  return (
    <div className="add-member-container">
      <nav className="navbar">
        <div className="navbar-logo">Your Logo</div>
        <div className="navbar-links">
          <Link to='/add-new-member' className="navbar-link">Add User</Link>
          <Link to='/update-user' className="navbar-link">Update User</Link>
          <Link to='/delete-user' className="navbar-link">Delete User</Link>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="navbar-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </nav>

      <h1>Add New Member</h1>
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
          <label>Temporary Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`password-input ${validationErrors.length > 0 ? 'error' : passwordStrength ? passwordStrength.toLowerCase() : ''}`}
          />
          <p className="password-strength">Password Strength: <strong>{passwordStrength}</strong></p>
          {validationErrors.length > 0 && (
            <ul className="validation-errors">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
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
        <button type="submit" className="add-btn">Add Member</button>
        <Link to='/dashboard'><button type="button" className="back-btn">Back</button></Link>
      </form>

      <h2>User List</h2>
      <ul className="user-list">
        {users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button onClick={() => handleDeleteUser(user.id)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Are you sure you want to add {formData.name} with the role of {formData.role}?</p>
            <button className="confirm-btn" onClick={confirmAddUser}>OK</button>
            <button className="cancel-btn" onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddNewMember;
