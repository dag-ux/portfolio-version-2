import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  uploadSingle,
} from '../controllers/project.controller';

console.log('🔍 ===== DEBUG: Creating project router =====');

const router = express.Router();

// This will log EVERY request that comes through this router
router.use((req, res, next) => {
  console.log(`🔍 Project Router intercepted: ${req.method} ${req.originalUrl}`);
  next();
});

// GET all projects - THIS IS THE MAIN ROUTE
router.get('/', (req, res, next) => {
  console.log('🎯 GET /api/projects route handler called!');
  getProjects(req, res).catch(next);
});

// GET single project
router.get('/:id', (req, res, next) => {
  console.log(`🎯 GET /api/projects/${req.params.id} called`);
  getProject(req, res).catch(next);
});

// POST create project
router.post('/', (req, res, next) => {
  console.log('🎯 POST /api/projects called');
  uploadSingle(req, res, (err: any) => {
    if (err) {
      console.error('❌ Upload error:', err);
      return res.status(400).json({ error: err.message });
    }
    createProject(req, res).catch(next);
  });
});

// PUT update project
router.put('/:id', (req, res, next) => {
  console.log(`🎯 PUT /api/projects/${req.params.id} called`);
  uploadSingle(req, res, (err: any) => {
    if (err) {
      console.error('❌ Upload error:', err);
      return res.status(400).json({ error: err.message });
    }
    updateProject(req, res).catch(next);
  });
});

// DELETE project
router.delete('/:id', (req, res, next) => {
  console.log(`🎯 DELETE /api/projects/${req.params.id} called`);
  deleteProject(req, res).catch(next);
});

console.log('✅ Project router created successfully!');
console.log('📋 Routes registered:');
console.log('  - GET    /');
console.log('  - GET    /:id');
console.log('  - POST   /');
console.log('  - PUT    /:id');
console.log('  - DELETE /:id');

export default router;