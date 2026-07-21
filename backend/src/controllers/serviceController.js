const Service = require('../models/Service');

exports.getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ habilitado: true }).sort('orden');
    res.json(services);
  } catch (error) {
    next(error);
  }
};

exports.getAllServicesAdmin = async (req, res, next) => {
  try {
    const services = await Service.find().sort('orden');
    res.json(services);
  } catch (error) {
    next(error);
  }
};

exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });
    res.json(service);
  } catch (error) {
    next(error);
  }
};

exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });
    res.json({ message: 'Servicio eliminado' });
  } catch (error) {
    next(error);
  }
};
