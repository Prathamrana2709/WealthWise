import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../assets/Logo.png';

const Login = () => {
  const [Email_id, setEmail] = useState('');  // Changed to 'Email_id'
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // For programmatic navigation

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(Email_id, password)

    try {
      const response = await fetch('http://127.0.0.1:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email_id: Email_id, password: password }),  // Correct key
      });
      

      const data = await response.json();

      if (response.ok && data.role === 'HR') {
        console.log('Login Successful:', data);
        // Redirect to the dashboard or home page upon successful login
        setEmail('');  // Clear the input fields
        setPassword('');
        navigate('/Dashboard');
      } else if(response.ok && data.role === 'Financial Manager'){
        console.log('Login Successful:', data);
        // Redirect to the dashboard or home page upon successful login
        setEmail('');  // Clear the input fields
        setPassword('');
        navigate('/Dashboard1');
        }
        else if(response.ok && data.role === 'Chief Financial Officer (CFO)'){
          console.log('Login Successful:', data);
          // Redirect to the dashboard or home page upon successful login
          setEmail('');  // Clear the input fields
          setPassword('');
          navigate('/Dashboard');
  
              } 
              else if(response.ok && data.role === 'Data Analyst/Scientist'){
                console.log('Login Successful:', data);
                // Redirect to the dashboard or home page upon successful login
                setEmail('');  // Clear the input fields
                setPassword('');
                navigate('/Dashboard2');
        
                    } 
                    else if(response.ok && data.role === 'Compliance Officer'){
                      console.log('Login Successful:', data);
                      // Redirect to the dashboard or home page upon successful login
                      setEmail('');  // Clear the input fields
                      setPassword('');
                      navigate('/Dashboard');
              
                          } 
                          else if(response.ok && data.role === 'Financial Analyst/Advisor'){
                            console.log('Login Successful:', data);
                            // Redirect to the dashboard or home page upon successful login
                            setEmail('');  // Clear the input fields
                            setPassword('');
                            navigate('/Dashboard3');
                    
                                } 
                                else if(response.ok && data.role === 'Budget Analyst'){
                                  console.log('Login Successful:', data);
                                  // Redirect to the dashboard or home page upon successful login
                                  setEmail('');  // Clear the input fields
                                  setPassword('');
                                  navigate('/Dashboard4');
                          
                                      } 
                                      else if(response.ok && data.role === 'Treasury Manager'){
                                        console.log('Login Successful:', data);
                                        // Redirect to the dashboard or home page upon successful login
                                        setEmail('');  // Clear the input fields
                                        setPassword('');
                                        navigate('/Dashboard5');
                                
                                            } 
                                            else if(response.ok && data.role === 'Compliance Auditor'){
                                              console.log('Login Successful:', data);
                                              // Redirect to the dashboard or home page upon successful login
                                              setEmail('');  // Clear the input fields
                                              setPassword('');
                                              navigate('/Dashboard');
                                      
                                                  } 
      
                    
            else {
        console.error('Login failed:', data.error);
        setError(data.error);  // Display error message to the user
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="page-container">
      <div className="left-section">
        <div className='main-div'>
          <div>
            <img src={logo} alt="logo" className='logo-image' />
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
                id="Email_id"
                placeholder="Email"
                required
                value={Email_id}  // Correct value binding
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

          {error && <div className="error-message">{error}</div>}  {/* Display error if login fails */}
        </div>
      </div>
    </div>
  );
}

export default Login;
