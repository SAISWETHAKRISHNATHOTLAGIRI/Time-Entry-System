import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Pages/Navbar';
import LoginForm from './Components/LoginForm/LoginForm';
import Dashboard from './Components/Pages/Dashboard';
import Weekview from './Components/Pages/Weekview';
import Monthview from './Components/Pages/Monthview';
import RegistrationPage from './Components/Pages/RegistrationPage';





const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/weekview" element={<Weekview />} />
        <Route path="/monthview" element={<Monthview />} />
        <Route path="/RegistrationPage" element={<RegistrationPage />} />
        

      
        
      </Routes>
    </Router>
  );
};

export default App;
