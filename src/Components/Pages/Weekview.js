import React, { useState, useEffect } from 'react';
import './Weekview.css';

function Weekview() {
  const [days, setDays] = useState({
    Monday: { date: '', hours: '' },
    Tuesday: { date: '', hours: '' },
    Wednesday: { date: '', hours: '' },
    Thursday: { date: '', hours: '' },
    Friday: { date: '', hours: '' },
    Saturday: { date: 'Weekend', hours: '' },
    Sunday: { date: 'Weekend', hours: '' },
  });

  const [totalWorkHours, setTotalWorkHours] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('week1');
  const [submittedData, setsubmittedData] = useState('');
  const [validationErrors, setValidationErrors] = useState('');


useEffect(() => {
  setValidationErrors('');
  if (selectedWeek === 'week1') {
    setDays({
      Monday: { date: '2024-01-01', hours: '' },
      Tuesday: { date: '2024-01-02', hours: '' },
      Wednesday: { date: '2024-01-03', hours: '' },
      Thursday: { date: '2024-01-04', hours: '' },
      Friday: { date: '2024-01-05', hours: '' },
      Saturday: { date: 'Weekend', hours: '' },
      Sunday: { date: 'Weekend', hours: '' },
    });
  } else if (selectedWeek === 'week2') {
    setDays({
      Monday: { date: '2024-01-08', hours: '' },
      Tuesday: { date: '2024-01-09', hours: '' },
      Wednesday: { date: '2024-01-10', hours: '' },
      Thursday: { date: '2024-01-11', hours: '' },
      Friday: { date: '2024-01-12', hours: '' },
      Saturday: { date: 'Weekend', hours: '' },
      Sunday: { date: 'Weekend', hours: '' },
    });
  } else if (selectedWeek === 'week3') {
    setDays({
      Monday: { date: '2024-01-15', hours: '' },
      Tuesday: { date: '2024-01-16', hours: '' },
      Wednesday: { date: '2024-01-17', hours: '' },
      Thursday: { date: '2024-01-18', hours: '' },
      Friday: { date: '2024-01-19', hours: '' },
      Saturday: { date: 'Weekend', hours: '' },
      Sunday: { date: 'Weekend', hours: '' },
    });
  } else if (selectedWeek === 'week4') {
    setDays({
      Monday: { date: '2024-01-22', hours: '' },
      Tuesday: { date: '2024-01-23', hours: '' },
      Wednesday: { date: '2024-01-24', hours: '' },
      Thursday: { date: '2024-01-25', hours: '' },
      Friday: { date: '2024-01-26', hours: '' },
      Saturday: { date: 'Weekend', hours: '' },
      Sunday: { date: 'Weekend', hours: '' },
    });
  } else if (selectedWeek === 'week5') {
    setDays({
      Monday: { date: '2024-01-29', hours: '' },
      Tuesday: { date: '2024-01-30', hours: '' },
      Wednesday: { date: '2024-01-31', hours: '' },
    });
  } else {
  }
}, [selectedWeek]);

  const validateInput = () => {
    const errors = {};

    Object.keys(days).forEach((day) => {
      if (day !== 'Saturday' && day !== 'Sunday') {
        if (!days[day].date || !days[day].hours) {
          errors[day] = 'Required';
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

    const handleSubmit = async () => {
      if (!validateInput()) {
        return;
      }
      const workDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

      const totalHours = workDays.reduce((acc, day) => {
        const dayHours = parseFloat(days[day].hours) || 0;
        return acc + dayHours;
      }, 0);

      setTotalWorkHours('Total Work Hours: ' + totalHours);
      setsubmittedData({ ...days });
      
    try {
      const response = await fetch('http://localhost:3001/api/weekview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          selectedWeek: selectedWeek,
          weekData: days
        }),
      });

      if (response.ok) {
        console.log('Week data submitted successfully');
      } else {
        console.error('Week data submission failed');
      }
    } catch (error) {
      console.error('Error during week data submission:', error);
    }
  };

  

    const handleInputChange = (day, property, value) => {
      
      if (day !== 'Saturday' && day !== 'Sunday' && property === 'date') {
        return;
      }

      setDays((prevDays) => ({
        ...prevDays,
        [day]: {
          ...prevDays[day],
          [property]: value,
        },
      }));
    };

  return (
    <div className="week-view-container">
      <div className='button'><a href="Weekview">Weekview</a>&nbsp;&nbsp;&nbsp;&nbsp;                   
      <a href="Monthview">Monthview</a></div>
      <div className="week-details-box">
        <h3>Week Details</h3>
        <label htmlFor="month">Select Week:</label>
        <select id="month" onChange={(e) => setSelectedWeek(e.target.value)}>
          <option value="week1">Week-1</option>
          <option value="week2">Week-2</option>
          <option value="week3">Week-3</option>
          <option value="week4">Week-4</option>
          <option value="week5">Week-5</option>
        </select>
        <br></br>
        <br></br>
        {Object.keys(days).map((day) => (
          <div key={day} className="day-container">
            <label>{day}</label>
            {day === 'Saturday' || day === 'Sunday' ? (
              <span>{days[day].date}</span>
            ) : (
              <>
                <input
                  type="date"
                  value={days[day].date}
                  onChange={(e) => handleInputChange(day, 'date', e.target.value)}
                />
                <input
                  type="number"
                  value={days[day].hours}
                  onChange={(e) => handleInputChange(day, 'hours', e.target.value)}
                />
              </>
            )}
            {validationErrors[day] && (
            <div className="error-message" style={{ color: 'red' }}>
              {validationErrors[day]}
            </div>
            )}
          </div>
        ))}
        <button onClick={handleSubmit}>Submit</button>
        <div className="total-hours">{totalWorkHours}</div>
        
        {/* Display submitted data */}
        {submittedData && (
          <div className="submitted-data">
            <h3>Submitted Data</h3>
            {Object.keys(submittedData).map((day) => (
              <div key={day}>
                {day}: {submittedData[day].date} - {submittedData[day].hours} hours
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Weekview;
