const Download = require('../models/Download');

// Helper: Validar y agregar protocolo si falta
const ensureProtocol = (url) => {
  const urlTrim = url.trim();
  if (!urlTrim.startsWith('http://') && !urlTrim.startsWith('https://')) {
    return 'https://' + urlTrim;
  }
  return urlTrim;
};

const getDownloads = async (req, res, next) => {
  try {
    const downloads = await Download.find({ isActive: true }).sort({ orden: 1 });
    res.json(downloads);
  } catch (error) {
    next(error);
  }
};

const createDownload = async (req, res, next) => {
  try {
    let { titulo, enlace, descripcion } = req.body;
    
    if (!titulo || !enlace) {
      return res.status(400).json({ message: 'Título y enlace son requeridos' });
    }

    // Asegurar que el enlace tenga protocolo
    enlace = ensureProtocol(enlace);

    const download = await Download.create({
      titulo,
      enlace,
      descripcion,
    });

    res.status(201).json(download);
  } catch (error) {
    next(error);
  }
};

const updateDownload = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { titulo, enlace, descripcion, isActive, orden } = req.body;

    // Asegurar que el enlace tenga protocolo si se actualiza
    if (enlace) {
      enlace = ensureProtocol(enlace);
    }

    const download = await Download.findByIdAndUpdate(
      id,
      { titulo, enlace, descripcion, isActive, orden },
      { new: true, runValidators: true }
    );

    if (!download) {
      return res.status(404).json({ message: 'Descarga no encontrada' });
    }

    res.json(download);
  } catch (error) {
    next(error);
  }
};

const deleteDownload = async (req, res, next) => {
  try {
    const { id } = req.params;
    const download = await Download.findByIdAndDelete(id);

    if (!download) {
      return res.status(404).json({ message: 'Descarga no encontrada' });
    }

    res.json({ message: 'Descarga eliminada' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDownloads, createDownload, updateDownload, deleteDownload };
