const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validateInput = (input, pattern) => {
  return pattern.test(input);
};

exports.registerUser = async (req, res) => {
  const { fullName, idNumber, accountNumber, password } = req.body;

  const namePattern = /^[a-zA-Z\s]+$/;
  const idPattern = /^[0-9]{13}$/;
  const accountPattern = /^[0-9]{10}$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!validateInput(fullName, namePattern) ||
      !validateInput(idNumber, idPattern) ||
      !validateInput(accountNumber, accountPattern) ||
      !validateInput(password, passwordPattern)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    let user = await User.findOne({ idNumber });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ fullName, idNumber, accountNumber, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { idNumber, password } = req.body;

  try {
    const user = await User.findOne({ idNumber });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { fullName: user.fullName, accountNumber: user.accountNumber } });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};