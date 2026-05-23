const express = require('express');
const router = express.Router();
const {
  getMyRecommendations,
  rejectRecommendation,
  markAsViewed,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

/**
 * CLIENT ROUTES - Rutas públicas para clientes
 */

// GET /api/recommendations - obtener mis recomendaciones
router.get('/', protect, getMyRecommendations);

// PUT /api/recommendations/:id/viewed - marcar como visto
router.put('/:id/viewed', protect, markAsViewed);

// DELETE /api/recommendations/:id - rechazar recomendación
router.delete('/:id', protect, rejectRecommendation);

module.exports = router;
