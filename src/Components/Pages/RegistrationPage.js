import React, { useState } from 'react';
import { FaUser, FaLock, FaUserTag } from "react-icons/fa";
import './RegistrationPage.css'; 

function RegistrationPage() {
  const [employeeName, setEmployeeName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = () => {
    console.log('Employee Name:', employeeName);
    console.log('Username:', username);
    console.log('Password:', password);
    
  };

  return (
    <div className="wrapper">
      <h1>Register</h1>
        <div className="input-box">
          <input type="text" placeholder='Employee Name' required />
            <FaUser className='icon'/>
        </div>
        <div className="input-box">
          <input type="text" placeholder='Username' required />
          <FaUserTag className='icon'/>
        </div>
        <div className="input-box">
          <input type="password" placeholder='Password' required />
            <FaLock className='icon'/>
        </div>
  
        <button><a href="Login">Submit</a></button>

      </div>
  );
}

export default RegistrationPage;