"use client"
import React from 'react';
import '../styles/home.css'
import logo from '../assets/Logo.png'
import bg from '../assets/bg.png'

function home() {
  return (
    <div className="container">
      <div className="content">
      <div class="logo-container">
        <img src={logo} alt="Company Logo" class="logo"/>
        <span class="company-name">WealthWise</span>
      </div>

        <h1>Transforming Data into Smart Financial Decisions</h1>
        <p>Our platform provides real-time financial analysis and accurate predictions to help you make smarter decisions.</p>
        <button className="login-button">Login</button>
      </div>
      <div className="illustration">
        <img src={bg} alt="Illustration" />
      </div>
    </div>
  );
}

export default home;