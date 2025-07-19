// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // adjust path if needed
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, 'uploads/'); // Make sure this folder exists
},
filename: function (req, file, cb) {
const uniqueName = Date.now() + '-' + file.originalname;
cb(null, uniqueName);
}
});

const upload = multer({ storage }); 

// 1. Add Venue
router.post('/venues', upload.single('image'), (req, res) => {
const { name, location, capacity, description } = req.body;
const image = req.file ? req.file.filename : null;

const sql = 'INSERT INTO venues (name, location, capacity, description, image) VALUES (?, ?, ?, ?, ?)';
db.query(sql, [name, location, capacity, description, image], (err, result) => {
if (err) return res.status(500).json({ message: 'Error inserting venue', error: err });
res.json({ message: 'Venue added successfully' });
});
});


router.get('/venues', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM venues');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching venues:', err);
    res.status(500).json({ message: 'Server error' });
  }
});





// 3. Update Venue (with optional image upload)
router.put('/venues/:id', upload.single('image'), async (req, res) => {
  const id = req.params.id;
  const { name, location, capacity, description } = req.body;
  const newImage = req.file ? req.file.filename : null;

  try {
    if (newImage) {
      // If new image is provided, update including image
      const sql = `UPDATE venues SET name = ?, location = ?, capacity = ?, description = ?, image = ? WHERE id = ?`;
      await db.promise().execute(sql, [name, location, capacity, description, newImage, id]);
    } else {
      // If no image, leave the existing image unchanged
      const sql = `UPDATE venues SET name = ?, location = ?, capacity = ?, description = ? WHERE id = ?`;
      await db.promise().execute(sql, [name, location, capacity, description, id]);
    }

    res.json({ message: 'Venue updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// 4. Delete Venue
router.delete('/venues/:id', (req, res) => {
const sql = 'DELETE FROM venues WHERE id = ?';
db.query(sql, [req.params.id], (err) => {
if (err) return res.status(500).json({ error: err.message });
res.json({ message: 'Venue deleted successfully' });
});
});

// 5. Block Dates
router.post('/block-dates', (req, res) => {
const { venue_name, start_date, end_date } = req.body;
const sql = 'INSERT INTO blocked_dates (venue_name, start_date, end_date) VALUES (?, ?, ?)';
db.query(sql, [venue_name, start_date, end_date], (err) => {
if (err) return res.status(500).json({ error: err.message });
res.json({ message: 'Dates blocked successfully' });
});
});

// 6. Get Blocked Dates
router.get('/blocked-dates', (req, res) => {
db.query('SELECT * FROM blocked_dates', (err, rows) => {
if (err) return res.status(500).json({ error: err.message });
res.json(rows);
});
});

// 7. View Bookings
router.get('/bookings', (req, res) => {
db.query('SELECT * FROM bookings', (err, rows) => {
if (err) return res.status(500).json({ error: err.message });
res.json(rows);
});
});


router.post('/login', (req, res) => {
const { username, password } = req.body;
const sql = 'SELECT * FROM admins WHERE username = ? AND password = ?';
db.query(sql, [username, password], (err, results) => {
if (err) return res.status(500).json({ error: 'DB error' });
if (results.length === 0) {
return res.status(401).json({ message: 'Invalid credentials' });
}
res.json({ message: 'Login successful', admin: results[0] });
});
});




// DELETE /api/admin/blocked-dates/:id
router.delete('/blocked-dates/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM blocked_dates WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting blocked date:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Blocked date not found" });
    }
    return res.json({ success: true });
  });
});



module.exports = router; // This must be included