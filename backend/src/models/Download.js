const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es requerido'],
      trim: true,
    },
    enlace: {
      type: String,
      required: [true, 'El enlace es requerido'],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    orden: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Download', downloadSchema);
