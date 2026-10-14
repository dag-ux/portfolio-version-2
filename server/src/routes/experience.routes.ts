import express from 'express';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../controllers/experience.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getExperiences);
router.post('/', requireAuth, createExperience);
router.put('/:id', requireAuth, updateExperience);
router.delete('/:id', requireAuth, deleteExperience);

export default router;
