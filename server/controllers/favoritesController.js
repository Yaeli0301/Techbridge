const User = require('../models/User');

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }
    res.json(user.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.getFavoriteById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favorites',
      match: { _id: req.params.id }
    });
    if (!user || user.favorites.length === 0) {
      return res.status(404).json({ message: 'המועדף לא נמצא' });
    }
    res.json(user.favorites[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { jobId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }
    if (user.favorites.includes(jobId)) {
      return res.status(400).json({ message: 'המשרה כבר במועדפים' });
    }
    user.favorites.push(jobId);
    await user.save();
    res.json({ message: 'המשרה נוספה למועדפים' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.updateFavorite = async (req, res) => {
  // Since favorites are just job IDs, update might not be meaningful.
  // But if needed, implement logic here.
  res.status(400).json({ message: 'עדכון מועדף אינו נתמך' });
};

exports.removeFavorite = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }
    user.favorites = user.favorites.filter(fav => fav.toString() !== jobId);
    await user.save();
    res.json({ message: 'המשרה הוסרה מהמועדפים' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};
