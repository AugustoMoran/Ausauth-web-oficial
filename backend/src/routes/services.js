const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', serviceController.getServices);
router.get('/admin', protect, adminOnly, serviceController.getAllServicesAdmin);
router.post('/', protect, adminOnly, serviceController.createService);
router.put('/:id', protect, adminOnly, serviceController.updateService);
router.delete('/:id', protect, adminOnly, serviceController.deleteService);

module.exports = router;
