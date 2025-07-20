const express = require('express');
const cors = require('cors');
const app = express();
const adminRoutes = require('./routes/admin'); 

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/admin', adminRoutes); // All /admin routes handled here

// app.listen(5000, () => {
//   console.log('Server running on http://localhost:5000');
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});