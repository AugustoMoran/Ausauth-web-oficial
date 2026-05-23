const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getDownloads, createDownload, updateDownload, deleteDownload } = require('../controllers/downloadController');

// Pública - todos pueden ver
router.get('/', getDownloads);

// Admin
router.post('/', protect, adminOnly, createDownload);
router.put('/:id', protect, adminOnly, updateDownload);
router.delete('/:id', protect, adminOnly, deleteDownload);

module.exports = router;
