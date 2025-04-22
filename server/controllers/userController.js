const User = require('../models/User');
const path = require('path');

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    console.log('Uploaded file info:', req.file);
    if (!req.file) {
      return res.status(400).json({ message: 'לא הועלתה תמונה' });
    }
    if (!allowedImageTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'סוג הקובץ אינו נתמך. יש להעלות תמונה בלבד.' });
    }
    if (req.file.size > 5 * 1024 * 1024) { // 5MB limit
      return res.status(400).json({ message: 'גודל הקובץ גדול מדי. יש להעלות תמונה עד 5MB.' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }
    user.profileImage = req.file.filename;
    await user.save();
    res.json({ message: 'תמונת הפרופיל עודכנה בהצלחה', profileImage: user.profileImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email, linkedin, portfolio, role } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (linkedin) user.linkedin = linkedin;
    if (portfolio) user.portfolio = portfolio;
    if (role) user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};
