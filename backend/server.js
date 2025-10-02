const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/atm', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// ---------------- Routes ----------------

// Login
app.post('/api/login', async (req, res) => {
  const { pin } = req.body;
  console.log('Received PIN:', pin);
  const user = await User.findOne({ pin: Number(pin) });
  if (user) res.json({ success: true, userId: user._id });
  else res.json({ success: false, message: 'Invalid PIN' });
});

// Get user info
app.get('/api/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Deposit
app.post('/api/deposit', async (req, res) => {
  const { userId, amount } = req.body;
  const user = await User.findById(userId);
  user.balance += Number(amount);
  user.transactions.push({ type: 'credit', amount: Number(amount) });
  await user.save();
  res.json(user);
});

// Withdraw
app.post('/api/withdraw', async (req, res) => {
  const { userId, amount } = req.body;
  const user = await User.findById(userId);
  if (amount > user.balance) return res.status(400).json({ message: 'Insufficient balance' });
  user.balance -= Number(amount);
  user.transactions.push({ type: 'debit', amount: Number(amount) });
  await user.save();
  res.json(user);
});

// Change PIN
app.post('/api/changePin', async (req, res) => {
  const { userId, oldPin, newPin } = req.body;
  const user = await User.findById(userId);
  if (user.pin !== Number(oldPin)) return res.status(400).json({ message: 'Incorrect current PIN' });
  user.pin = Number(newPin);
  await user.save();
  res.json({ message: 'PIN changed successfully' });
});

// Start server
app.listen(5000, () => console.log('Server running on port 5000'));
