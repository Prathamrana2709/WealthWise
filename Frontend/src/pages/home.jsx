"use client"
import React from 'react';
import '../styles/home.css'
import logo from '../assets/Logo.png'
import bg from '../assets/bg.png'
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <div className="left-section1">
        <div className="logo-container">
          <img src={logo} alt="Company Logo" className="logo" />
          <span className="company-name">WealthWise</span>
        </div>
        <div className="content1">
          <h1 className="title-1">Transforming Data into Smart Financial Decisions</h1>
          <p>Our platform provides real-time financial analysis and accurate predictions to help you make smarter decisions.</p>
          <Link to="/login"><button className="login-btn" >Login </button></Link>
        </div>
      </div>
      <div className="illustration">
        <img src={bg} alt="Illustration" className="bg-image" />
      </div>
    </div>
  );
}

export default Home;
