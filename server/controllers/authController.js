const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (user) => {
  return jwt.sign(
    { user: { id: user._id, username: user.username, role: user.role } },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '1h' }
  );
};

exports.register = async (req, res) => {
  let { username, email, password, role, linkedin, portfolio } = req.body;
  const profileImage = req.file ? req.file.filename : null;

  // Map English role values to Hebrew enum values only if role is in English
  if (role === 'candidate') role = 'מועמד';
  else if (role === 'recruiter') role = 'מגייס';
  else if (role !== 'מועמד' && role !== 'מגייס') {
    // If role is not recognized, set default role or return error
    role = 'מועמד'; // default role
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'המשתמש כבר קיים' });
    }
    user = new User({ username, email, password, role, profileImage, linkedin, portfolio });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role, profileImage: user.profileImage, linkedin: user.linkedin, portfolio: user.portfolio } });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'שגיאת שרת' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'פרטי התחברות שגויים' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'פרטי התחברות שגויים' });
    }
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role, profileImage: user.profileImage, linkedin: user.linkedin, portfolio: user.portfolio } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};
