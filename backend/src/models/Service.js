const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    icono: { type: String, default: '' }, // Puede ser un nombre de icono de react-icons o una URL
    habilitado: { type: Boolean, default: true },
    orden: { type: Number, default: 0 },
    beneficios: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
