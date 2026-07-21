const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const colorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    codigo: { type: String, required: true },
    habilitado: { type: Boolean, default: true },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    descripcion: { type: String, default: '' },
    
    // Project Specific Fields
    problema: { type: String, default: '' },
    solucion: { type: String, default: '' },
    resultado: { type: String, default: '' },
    tecnologias: [{ type: String, trim: true }], // Anteriormente tags
    urlProyecto: { type: String, default: '' },
    urlGitHub: { type: String, default: '' },
    mensajeWhatsApp: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    
    // Ecommerce Legacy Fields (Keeping for compatibility during transition)
    precio: { type: Number, default: null, min: 0 },
    precioOferta: { type: Number, default: null, min: 0 },
    stock: { type: Number, default: 0 },
    
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    imagenes: [mediaSchema],
    videos: [mediaSchema],
    
    // NEW: Instalación y zonas (Legacy but kept for now)
    hasInstallation: { type: Boolean, default: false },
    
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
    vendidos: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search
projectSchema.index({ nombre: 'text', descripcion: 'text', tecnologias: 'text' });

projectSchema.methods.softDelete = async function () {
  this.isActive = false;
  this.deletedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Project', projectSchema);
