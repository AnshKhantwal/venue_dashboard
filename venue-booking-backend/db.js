// // db.js
// const mysql = require('mysql2');
// const db = mysql.createConnection({
// host: 'localhost',
// user: 'root',
// password: 'root', // your MySQL password
// database: 'venue_booking'
// });

// db.connect(err => {
// if (err) {
// console.error('DB connection error:', err);
// } else {
// console.log('MySQL connected');
// }
// });

// module.exports = db;

require('dotenv').config(); // load .env file

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT, // important: Railway uses a custom port
});

db.connect(err => {
  if (err) {
    console.error('DB connection error:', err);
  } else {
    console.log('MySQL connected');
  }
});

module.exports = db;
