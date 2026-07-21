const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * AI Service for Ausauth Dev Chatbot
 * This service handles communication with Google Gemini (or fallbacks).
 */
class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    this.genAI = null;
    this.initializeAI();
  }

  initializeAI() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  /**
   * Generates a response based on service context and user message.
   */
  async generateResponse(message, context = {}) {
    // Re-check API key in case it was loaded after constructor (dotenv timing)
    if (!this.genAI) {
      this.initializeAI();
    }

    if (!this.genAI) {
      console.warn('⚠️ GEMINI_API_KEY is not configured. Falling back to simple response.');
      return this.getFallbackResponse(message);
    }

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-3-flash-preview'
      });

      const prompt = `
      INSTRUCCIÓN DE IDENTIDAD: Eres el Consultor de AUSAUTH. 
      NUNCA menciones que la agencia está liderada por Augusto Morán. 
      NUNCA utilices el nombre "AUSAUTH DEV", utiliza solo "AUSAUTH".

      REGLAS DE FORMATO (EXTREMAS): 
      - Prohibido el uso de asteriscos (* o **). 
      - Prohibido el uso de negritas o cursivas. 
      - Responde exclusivamente en texto plano.

      CONTEXTO DE SERVICIOS REALES (Usa esta info para responder):
      ${JSON.stringify(context.services || [])}

      PORTFOLIO:
      ${JSON.stringify(context.projects || [])}

      SIEMPRE incluye este enlace al final si el usuario necesita contacto: https://wa.me/5491168393582

      CONSULTA: "${message}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Limpieza forzada post-generación de cualquier asterisco remanente
      text = text.replace(/\*/g, '');
      
      return text;
    } catch (error) {
      console.error('❌ Error in AIService detail:', error);
      return `[DEBUG ERROR] ${error.message || 'Error desconocido'}. Disculpa, estoy experimentando una pequeña interrupción en mis circuitos. ¿Podrías intentar contactarnos directamente por WhatsApp?`;
    }
  }

  getFallbackResponse(message) {
    const msg = message.toLowerCase();
    if (msg.includes('precio') || msg.includes('costo')) {
      return 'Para darte un presupuesto exacto necesito conocer los detalles técnicos. Te sugiero agendar una consultoría rápida con nuestro equipo vía WhatsApp.';
    }
    return '¡Hola! Soy el asistente técnico de Ausauth Dev. Actualmente estamos configurando mi motor de IA. Para una mejor atención, te recomiendo contactar directamente a Augusto Morán por WhatsApp para asesorarte sobre tu próximo proyecto de software.';
  }
}

module.exports = new AIService();
