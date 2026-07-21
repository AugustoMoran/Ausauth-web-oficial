const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', testimonialController.getTestimonials);
router.get('/admin', protect, adminOnly, testimonialController.getAllTestimonialsAdmin);
router.post('/', protect, adminOnly, testimonialController.createTestimonial);
router.put('/:id', protect, adminOnly, testimonialController.updateTestimonial);
router.delete('/:id', protect, adminOnly, testimonialController.deleteTestimonial);

module.exports = router;
