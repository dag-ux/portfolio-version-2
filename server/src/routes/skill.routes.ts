import express from 'express';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skill.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSkills);
router.post('/', requireAuth, createSkill);
router.put('/:id', requireAuth, updateSkill);
router.delete('/:id', requireAuth, deleteSkill);

export default router;