const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getProjects, getProject, getRelated, getSuggestions, createProject, updateProject, deleteProject, addImage, removeImage, addVideo, removeVideo,
} = require('../controllers/projectController');

router.get('/', getProjects);
router.get('/suggestions', getSuggestions);
router.get('/:id', getProject);
router.get('/:id/related', getRelated);

// Admin
router.post('/', protect, adminOnly, createProject);
router.put('/:id', protect, adminOnly, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);
router.post('/:id/images', protect, adminOnly, addImage);
router.delete('/:id/images', protect, adminOnly, removeImage);
router.post('/:id/videos', protect, adminOnly, addVideo);
router.delete('/:id/videos', protect, adminOnly, removeVideo);

module.exports = router;
