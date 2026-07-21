const Testimonial = require('../models/Testimonial');

exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ habilitado: true }).sort('-createdAt');
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

exports.getAllTestimonialsAdmin = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort('-createdAt');
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

exports.createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (error) {
    next(error);
  }
};

exports.updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!testimonial) return res.status(404).json({ message: 'Testimonio no encontrado' });
    res.json(testimonial);
  } catch (error) {
    next(error);
  }
};

exports.deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonio no encontrado' });
    res.json({ message: 'Testimonio eliminado' });
  } catch (error) {
    next(error);
  }
};
