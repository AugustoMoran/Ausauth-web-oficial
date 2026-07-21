const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    pregunta: { type: String, required: true, trim: true },
    respuesta: { type: String, required: true },
    categoria: { type: String, default: 'General' },
    habilitado: { type: Boolean, default: true },
    orden: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FAQ', faqSchema);
