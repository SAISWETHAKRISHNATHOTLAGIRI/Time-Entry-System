import React, { useState } from 'react';
import './Monthview.css';

const Monthview = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [inputValues, setInputValues] = useState(Array(31).fill(''));
  const [inputErrors, setInputErrors] = useState(Array(31).fill(''));

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleInputChange = (index, event) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
    validateInput(index, event.target.value);
  };

  const validateInput = (index, value) => {
    const newInputErrors = [...inputErrors];
    if (!value.trim()) {
      newInputErrors[index] = 'Field is required';
    } else {
      newInputErrors[index] = '';
    }
    setInputErrors(newInputErrors);
  };

  const calculateRowTotal = (rowValues) => {
    return rowValues.reduce((total, value) => total + parseFloat(value) || 0, 0);
  };

  const calculateMonthTotal = (values) => {
    return calculateRowTotal(values);
  };

  const getLastDaysOfPreviousMonth = (year, month, days) => {
    const lastDays = [];
    for (let i = days - 2; i <= days; i++) {
      const date = new Date(year, month - 1, i);
      lastDays.push(date);
    }
    return lastDays;
  };

  const getFirstDaysOfNextMonth = (year, month, days) => {
    const firstDays = [];
    for (let i = 1; i <= days; i++) {
      const date = new Date(year, month, i);
      firstDays.push(date);
    }
    return firstDays;
  };

  const renderDates = () => {
    const daysInMonth = selectedMonth === 'January' ? 31 : 29;
    const dates = [];

    const totalRowValues = inputValues.map((value, index) => {
      return {
        index,
        value: parseFloat(value) || 0,
      };
    });

    const startDay = new Date(2024, selectedMonth === 'January' ? 0 : 1, 1).getDay();

    if (startDay === 4) {
      const lastDaysOfJanuary = getLastDaysOfPreviousMonth(2024, 1, 31);
      for (let i = 0; i < 3; i++) {
        const dayString = lastDaysOfJanuary[i].toLocaleDateString('en-US', { weekday: 'long' });
        dates.push(
          <div key={`empty${i}`} className="date-container empty-box">
            <div>{`January ${lastDaysOfJanuary[i].getDate()}`}</div>
            <div style={{ color: 'red' }}>{dayString}</div>
          </div>
        );
      }
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(2024, selectedMonth === 'January' ? 0 : 1, i);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      if (isWeekend) {
        dates.push(
          <div key={i} className="date-container">
            <div>{`${selectedMonth} ${i}`}</div>
            <div style={{ color: 'blue' }}>Weekend</div>
          </div>
        );
      } else {
        const dayString = date.toLocaleDateString('en-US', { weekday: 'short' });
        dates.push(
          <div key={i} className="date-container">
            <div>{`${selectedMonth} ${i}`}</div>
            <div>({dayString})</div>
            <input
              type="number"
              placeholder="Hours Worked"
              value={inputValues[i - 1] || ''}
              onChange={(event) => handleInputChange(i - 1, event)}
            />
            {inputErrors[i - 1] && (
            <div className="error-message" style={{ color: 'red' }}>
              {inputErrors[i - 1]}
            </div>
          )}
          </div>
        );
      }
    }

    const lastDay = new Date(2024, selectedMonth === 'January' ? 0 : 1, daysInMonth);
    const endDay = lastDay.getDay();

    if (endDay !== 6 && selectedMonth === 'January') {
      const firstDaysOfFebruary = getFirstDaysOfNextMonth(2024, 1, 6 - endDay);
      for (let i = 0; i < firstDaysOfFebruary.length; i++) {
        const dayString = firstDaysOfFebruary[i].toLocaleDateString('en-US', { weekday: 'long' });
        dates.push(
          <div key={`empty${i + daysInMonth}`} className="date-container empty-box">
            <div>{`February ${firstDaysOfFebruary[i].getDate()}`}</div>
            <div style={{ color: 'green' }}>{dayString}</div>
          </div>
        );
      }
    }

    const totalRow = calculateRowTotal(totalRowValues.map((item) => item.value));

    const weeks = [];
    for (let i = 0; i < dates.length; i += 7) {
      const weekRowValues = totalRowValues.slice(i, i + 7);
      const weekTotal = calculateRowTotal(weekRowValues.map((item) => item.value));

      weeks.push(
        <div key={i} className="week-container">
          {dates.slice(i, i + 7)}
          <div className="total-container"></div>
        </div>
      );
    }
    const monthTotal = calculateMonthTotal(totalRowValues.map((item) => item.value));

    return (
      <>
        {weeks}
        <div className="total-container">
          <div>Total for the Month:</div>
          <div>{monthTotal}</div>
        </div>
      </>
    );
  };

  const handleSubmit = async () => {
    try {
      if (!selectedMonth || inputValues.some((value) => !value.trim())) {
        const newInputErrors = inputValues.map((value) => (!value.trim() ? 'Field is required' : ''));
        setInputErrors(newInputErrors);
        return;
      }

      console.log(`Submit button clicked for ${selectedMonth}`);
      console.log('Input values:', inputValues);

      const formData = new FormData();
      formData.append('selectedMonth', selectedMonth);

      inputValues.forEach((value, index) => {
        formData.append(`Week-${Math.ceil((index + 1) / 7)}`, value);
      });

      const response = await fetch('http://localhost:3001/api/monthview', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log('Server response:', data);
    } catch (error) {
      console.error('Error sending data to the server:', error);
    }
  };

  return (
    <div className="container">
      <div className="center">
        <label>
          Select Month:
          <select
            className={`dropdown ${selectedMonth && 'selected'}`}
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            <option value="">Select</option>
            <option value="January">January 2024</option>
            <option value="February">February 2024</option>
          </select>
        </label>
        {selectedMonth && renderDates()}
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Monthview;
