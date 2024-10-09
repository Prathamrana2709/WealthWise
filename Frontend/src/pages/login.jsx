import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../assets/Logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="page-container">
      <div className="left-section">
        <div className='main-div'>
          <div>
            <div>
              <img src={logo} alt="logo" className='logo-image' />
            </div>
            <h1 className="h1">WealthWise</h1>
          </div>
          <h3>Financial Analysis and Prediction</h3>  
          <div>
            <p className='main-div'>
              This platform revolutionized how we approach financial planning!
            </p>
          </div>
          <div>
            {/* Use Link component for navigation */}
            <Link to="/" className="back-link">Back</Link>
          </div>
        </div>
      </div>
      <div className="right-section">
        <div className="border-box">
          <h1 className="ww-font">WealthWise</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <input
                type="email"
                id="email"
                placeholder="Email"
                required
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="input-field">
              <input
                type="password"
                id="password"
                placeholder="Password"
                required
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <button type="submit" className="login-button">Login</button>
            <div className="forget">
              <a href="#" className="forgot-password">Forget Password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;