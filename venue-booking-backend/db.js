// db.js
const mysql = require('mysql2');
const db = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'root', // your MySQL password
database: 'venue_booking'
});

db.connect(err => {
if (err) {
console.error('DB connection error:', err);
} else {
console.log('MySQL connected');
}
});

module.exports = db;