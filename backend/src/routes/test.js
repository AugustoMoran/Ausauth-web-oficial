const express = require('express');
const router = express.Router();

router.get('/debug', async (req, res) => {
  res.json({ status: 'ok', message: 'Debug endpoint' });
});

router.get('/mp-config', async (req, res) => {
  const token = process.env.MP_ACCESS_TOKEN || '';
  res.json({
    mpToken: {
      exists: !!token,
      length: token.length,
    },
    backendUrl: process.env.BACKEND_URL || 'NOT SET',
  });
});

module.exports = router;
