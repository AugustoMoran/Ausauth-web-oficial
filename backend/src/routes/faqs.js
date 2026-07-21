const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', faqController.getFAQs);
router.get('/admin', protect, adminOnly, faqController.getAllFAQsAdmin);
router.post('/', protect, adminOnly, faqController.createFAQ);
router.put('/:id', protect, adminOnly, faqController.updateFAQ);
router.delete('/:id', protect, adminOnly, faqController.deleteFAQ);

module.exports = router;
