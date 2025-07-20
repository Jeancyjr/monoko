const express = require('express');
const router = express.Router();

router.post('/analyze', (req, res) => {
  res.json({ success: true, message: 'Snap & Learn AI - coming soon!' });
});

module.exports = router;
