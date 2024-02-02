import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './LoginForm.css';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginForm = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('Login successful');
        setLoggedIn(true);
      } else {
        console.error('Login failed');
        
      }
    } catch (error) {
      console.error('Error during login:', error);
      
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/Weekview" />;
  }

  return (
    <div className="wrapper">
      <form action="/" method="POST">
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>

        <button type="button" onClick={handleLogin}>
          Login
        </button>

       
      </form>
    </div>
  );
};

export default LoginForm;
