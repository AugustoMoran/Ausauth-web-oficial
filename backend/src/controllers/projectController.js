const projectService = require('../services/projectService');

const getProjects = async (req, res, next) => {
  try {
    const { page, limit, categoria, search, sort, currency, exchangeRate } = req.query;
    const data = await projectService.getProjects({ page, limit, categoria, search, sort, currency, exchangeRate });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.json(project);
  } catch (error) {
    next(error);
  }
};

const getRelated = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    const categoriaId = project.categoria?._id || project.categoria || null;
    if (!categoriaId) return res.json([]);
    const related = await projectService.getRelatedProjects(project._id, categoriaId);
    res.json(related);
  } catch (error) {
    next(error);
  }
};

const getSuggestions = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;
    const suggestions = await projectService.getSuggestions(q, parseInt(limit));
    res.json(suggestions);
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    res.json(project);
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id);
    res.json({ message: 'Projecto eliminado.' });
  } catch (error) {
    next(error);
  }
};

const addImage = async (req, res, next) => {
  try {
    const { url, publicId } = req.body;
    const project = await projectService.addProjectImage(req.params.id, url, publicId);
    res.json(project);
  } catch (error) {
    next(error);
  }
};

const removeImage = async (req, res, next) => {
  try {
    const project = await projectService.removeProjectImage(req.params.id, req.body.publicId);
    res.json(project);
  } catch (error) {
    next(error);
  }
};

const addVideo = async (req, res, next) => {
  try {
    const { url, publicId } = req.body;
    const project = await projectService.addProjectVideo(req.params.id, url, publicId);
    res.json(project);
  } catch (error) {
    next(error);
  }
};

const removeVideo = async (req, res, next) => {
  try {
    const project = await projectService.removeProjectVideo(req.params.id, req.body.publicId);
    res.json(project);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, getProject, getRelated, getSuggestions, createProject, updateProject, deleteProject, addImage, removeImage, addVideo, removeVideo };
