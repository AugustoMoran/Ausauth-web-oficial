/**
 * src/controllers/chatController.js
 *
 * Integrates the AI Engine with this project's MongoDB Service and Project models.
 * REFACTORED: Now uses a real AI model (Gemini) instead of mock logic.
 */

const Service = require('../models/Service');
const Project = require('../models/Project');
const FAQ     = require('../models/FAQ');
const aiService = require('../services/aiService');

async function handleChat(req, res) {
  try {
    const { message, sessionId, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'El mensaje es requerido.' });
    }

    // 1. Obtener contexto (Servicios, Proyectos, FAQs)
    const [services, projects, faqs] = await Promise.all([
      Service.find({ habilitado: true }).select('titulo descripcion beneficios -_id').lean(),
      Project.find({ isActive: true }).select('nombre descripcion solucion tecnologas -_id').limit(8).lean(),
      FAQ.find().select('question answer -_id').lean()
    ]);

    // 2. Delegar a la IA
    const aiResponseText = await aiService.generateResponse(message, { 
      services, 
      projects,
      faqs,
      history: conversationHistory 
    });

    // 3. Responder
    return res.json({
      text: aiResponseText,
      intent: 'ai_consultation',
      sessionId: sessionId || 'default',
      actions: [
        { label: 'Consultar por WhatsApp', url: 'https://wa.me/5491168393582', type: 'whatsapp' },
        { label: 'Ver mis proyectos', url: '/proyectos', type: 'link' },
        { label: 'Solicitar Presupuesto', url: '/contacto', type: 'link' }
      ]
    });
  } catch (error) {
    console.error('❌ Error en handleChat:', error);
    return res.json({
      text: 'Disculpa, estoy teniendo dificultades técnicas. Augusto Morán puede ayudarte personalmente por WhatsApp en este mismo momento.',
      intent: 'error_fallback',
      actions: [
        { label: 'Hablar con Augusto', url: 'https://wa.me/541176045100', type: 'whatsapp' }
      ]
    });
  }
}

async function getChatStats(req, res) {
  res.json({ status: 'active', engine: 'Gemini 3 Flash (Preview)' });
}

async function getChatAnalytics(req, res) {
  res.json({ totalInteractions: 0 });
}

async function clearChatCache(req, res) {
  res.json({ success: true });
}

module.exports = {
  handleChat,
  getChatStats,
  getChatAnalytics,
  clearChatCache,
};
