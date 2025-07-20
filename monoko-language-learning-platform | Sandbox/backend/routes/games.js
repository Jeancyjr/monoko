const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Games API - coming soon!' });
});

module.exports = router;
