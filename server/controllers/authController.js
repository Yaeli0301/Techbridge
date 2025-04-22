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
    const existingEmailUser = await User.findOne({ email });
    const existingUsernameUser = await User.findOne({ username });

    let errors = [];
    if (existingEmailUser) errors.push('כתובת האימייל כבר בשימוש');
    if (existingUsernameUser) errors.push('שם המשתמש כבר בשימוש');

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join('ו') + '.' });
    }

    const user = new User({ username, email, password, role, profileImage, linkedin, portfolio });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role, profileImage: user.profileImage, linkedin: user.linkedin, portfolio: user.portfolio } });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ message: 'אירעה שגיאה בשרת. אנא נסה שוב מאוחר יותר.' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'פרטי ההתחברות שגויים. אנא נסה שוב.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'פרטי ההתחברות שגויים. אנא נסה שוב.' });
    }
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role, profileImage: user.profileImage, linkedin: user.linkedin, portfolio: user.portfolio } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'אירעה שגיאה בשרת. אנא נסה שוב מאוחר יותר.' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Map Hebrew role to English role for frontend compatibility
    let role = user.role;
    if (role === 'מועמד') role = 'candidate';
    else if (role === 'מגייס') role = 'recruiter';

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: role,
      profileImage: user.profileImage,
      linkedin: user.linkedin,
      portfolio: user.portfolio
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'אירעה שגיאה בשרת. אנא נסה שוב מאוחר יותר.' });
  }
};
