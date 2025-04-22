const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const favoritesController = require('../controllers/favoritesController');
const alertsController = require('../controllers/alertsController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const multer = require('multer');
const path = require('path');

// Configure multer storage for profile image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// User profile routes
router.get('/profile', protect, authController.getCurrentUser);
router.put('/profile', protect, userController.updateProfile); // Updated to use updateProfile
router.post('/profile-image', protect, upload.single('image'), userController.updateProfileImage); // Added route for profile image upload

// New route to get all users except current user for messaging
router.get('/', protect, userController.getUsersList);

// Favorites routes
router.get('/favorites', protect, favoritesController.getFavorites);
router.get('/favorites/:id', protect, favoritesController.getFavoriteById);
router.post('/favorites', protect, favoritesController.addFavorite);
router.put('/favorites/:id', protect, favoritesController.updateFavorite);
router.delete('/favorites/:jobId', protect, favoritesController.removeFavorite);

// Alerts routes
router.get('/alerts', protect, alertsController.getAlerts);
router.get('/alerts/:id', protect, alertsController.getAlertById);
router.post('/alerts', protect, alertsController.createAlert);
router.put('/alerts/:id', protect, alertsController.updateAlert);
router.delete('/alerts/:id', protect, alertsController.removeAlert);

// Rating route
router.put('/rating', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }
    user.rating = req.body.rating;
    await user.save();
    res.json({ message: 'הדירוג עודכן בהצלחה' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

module.exports = router;
