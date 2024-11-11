require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Import helmet
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Connect to the database
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet()); // Use helmet middleware

app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});