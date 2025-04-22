const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const jobController = require('../controllers/jobController');

// Job routes
router.post('/', protect, jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/recommended', protect, jobController.getRecommendedJobs);
router.get('/:id', jobController.getJobById);
router.post('/:id/apply', protect, jobController.applyToJob);

module.exports = router;
