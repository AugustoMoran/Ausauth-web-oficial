const FAQ = require('../models/FAQ');

exports.getFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find({ habilitado: true }).sort('orden');
    res.json(faqs);
  } catch (error) {
    next(error);
  }
};

exports.getAllFAQsAdmin = async (req, res, next) => {
  try {
    const faqs = await FAQ.find().sort('orden');
    res.json(faqs);
  } catch (error) {
    next(error);
  }
};

exports.createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json(faq);
  } catch (error) {
    next(error);
  }
};

exports.updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) return res.status(404).json({ message: 'FAQ no encontrado' });
    res.json(faq);
  } catch (error) {
    next(error);
  }
};

exports.deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ no encontrado' });
    res.json({ message: 'FAQ eliminado' });
  } catch (error) {
    next(error);
  }
};
