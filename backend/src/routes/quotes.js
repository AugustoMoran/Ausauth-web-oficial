const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createQuote,
  getAllQuotes,
  getQuoteById,
  getMyQuotes,
  updateQuote,
  sendQuote,
  downloadQuotePDF,
  updateQuoteStatus,
  deleteQuote,
  testPDF,
  getPDFErrorLog,
} = require('../controllers/quoteGeneratorController');

// Test endpoint - NO AUTH (goes before protect middleware)
router.get('/test/pdf', testPDF);
router.get('/debug/pdf-errors', getPDFErrorLog);  // Debug errors

// Apply auth middleware to all routes below
router.use(protect);

// Admin: Crear presupuesto
router.post('/', createQuote);

// Admin: Obtener todos
router.get('/admin/all', getAllQuotes);

// Cliente: Mis presupuestos
router.get('/mis-presupuestos', getMyQuotes);

// Obtener presupuesto por ID (admin o cliente dueño)
router.get('/:id', getQuoteById);

// Admin: Actualizar presupuesto
router.put('/:id', updateQuote);

// Admin: Enviar por email
router.post('/:id/enviar', sendQuote);

// Descargar PDF (admin o cliente dueño)
router.get('/:id/pdf', downloadQuotePDF);

// Cliente: Cambiar estado
router.put('/:id/status', updateQuoteStatus);

// Admin: Eliminar presupuesto (solo borrador)
router.delete('/:id', deleteQuote);

module.exports = router;
