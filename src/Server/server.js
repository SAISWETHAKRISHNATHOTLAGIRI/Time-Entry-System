const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const port = 3001;

app.use(cors());  
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pujitha$77',
  database: 'time_entry_system',
  insecureAuth: true,
});


db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.use(bodyParser.json());

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};


// LoginForm start
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const checkUsernameQuery = 'SELECT * FROM employees WHERE username = ?';
  db.query(checkUsernameQuery, [username], async (checkUsernameError, existingUser) => {
    if (checkUsernameError) {
      console.error('Error checking username in MySQL:', checkUsernameError);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (existingUser.length > 0) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }

    const insertUserQuery = 'INSERT INTO employees (username, password) VALUES (?, ?)';
    db.query(insertUserQuery, [username, password], (insertError, result) => {
      if (insertError) {
        console.error('Error inserting data into MySQL:', insertError);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      console.log('User login successfully');
      res.status(201).json({ success: true, message: 'User login successfully' });
    });
  });
});
// LoginForm end

// Weekview start
app.post('/api/weekview', (req, res) => {
  const { weekData, selectedWeek } = req.body;

  const sql = `
    INSERT INTO week (Weeknum, Monday, Tuesday, Wednesday, Thursday, Friday)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    selectedWeek,
    weekData.Monday.hours,
    weekData.Tuesday.hours,
    weekData.Wednesday.hours,
    weekData.Thursday.hours,
    weekData.Friday.hours,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    console.log('Data inserted into MySQL');
    res.status(201).json({ success: true, message: 'Week data submitted successfully' });
  });
});

// Weekview end


// Monthview start
app.post('/api/monthview', async (req, res) => {
  try {
    const { selectedMonth } = req.body;

    
    const weekData = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (key.startsWith('Week-')) {
        weekData[key] = value;
      }
    }

    const sql = `
      INSERT INTO month (Monthname, Week1, Week2, Week3, Week4, Week5)
      VALUES (?, ?, ?, ?, ?, ?)
  `;
  
    const values = [
      selectedMonth,
      weekData['Week1'],
      weekData['Week2'],
      weekData['Week3'],
      weekData['Week4'],
      weekData['Week5'],
    ];

    await db.query(sql, values);

    console.log('Data inserted into MySQL');
    res.status(201).json({ success: true, message: 'Month data submitted successfully' });
  } catch (error) {
    console.error('Error during month data submission:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Monthview end


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
