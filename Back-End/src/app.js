const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const passport = require('./config/passport');

const authRoutes = require('./routes/auth.routes');
const transactionRoutes = require('./routes/transaction.routes');
const categoryRoutes = require('./routes/category.routes');
const budgetRoutes = require('./routes/budget.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const savingsGoalRoutes = require('./routes/savingsGoal.routes');
const { errorHandler } = require('./middleware/error.middleware');

dotenv.config();

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// Middleware Global
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routing API
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/savings-goals', savingsGoalRoutes);

// Health Check Endpoint (Tes apakah server aktif)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server berjalan normal' });
});

// Handling Error Global (Harus paling bawah)
app.use(errorHandler);

module.exports = app;