import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../assets/Logo.png';

const Login = () => {
  const [Email_id, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email_id, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in session storage
        sessionStorage.setItem('Role', data.role);
        sessionStorage.setItem('Name', data.name);
        sessionStorage.setItem('Email_id', data.Email_id);
        navigate('/dashboard');
        window.location.reload(); // Force a reload
        
        // Navigate to Dashboard
        // navigate('/dashboard');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="page-container">
      <div className="left-section">
        <div className='main-div'>
          <img src={logo} alt="logo" className='logo-image' />
          <h1 className="h1">WealthWise</h1>
          <h3>Financial Analysis and Prediction</h3>
          <p>This platform revolutionized how we approach financial planning!</p>
          <Link to="/" className="back-link">Back</Link>
        </div>
      </div>
      <div className="right-section">
        <div className="border-box">
          <h1>Login to WealthWise</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <input
                type="email"
                placeholder="Email"
                required
                value={Email_id}
                onChange={handleEmailChange}
              />
            </div>
            <div className="input-field">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <button type="submit" className="login-button">Login</button>
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
