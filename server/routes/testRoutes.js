const express = require('express');
const router = express.Router();

router.post('/test', (req, res) => {
  res.json({ message: 'Test route works' });
});

module.exports = router;
