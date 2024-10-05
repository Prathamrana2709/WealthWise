"use client"
import React from 'react';
import '../styles/home.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import image from '../assets/bg.png';

function home() {

  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to the login page when login button is clicked
  };

  return (
    <div className="container">
      <div className="content">
        <div className="logo">
          <img src={logo} className='img-logo'></img>
          <span color='black'>WealthWise</span>
        </div>
        <h1 className='home'>Transforming Data into Smart Financial Decisions</h1>
        <p className='home'>Our platform provides real-time financial analysis and accurate predictions to help you make smarter decisions.</p>
        <button className="login-btn" onClick={handleLoginClick}>Login</button>
      </div>
      <div>
        <img src={image} />
      </div>
    </div>
  );
}

export default home;
