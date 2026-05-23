const Download = require('../models/Download');

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
    const { titulo, enlace, descripcion } = req.body;
    
    if (!titulo || !enlace) {
      return res.status(400).json({ message: 'Título y enlace son requeridos' });
    }

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
    const { titulo, enlace, descripcion, isActive, orden } = req.body;

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
