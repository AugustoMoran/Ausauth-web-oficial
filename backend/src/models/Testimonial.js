const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    puesto: { type: String, trim: true },
    empresa: { type: String, trim: true },
    comentario: { type: String, required: true },
    imagen: {
      url: { type: String },
      publicId: { type: String },
    },
    estrellas: { type: Number, default: 5, min: 1, max: 5 },
    habilitado: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
