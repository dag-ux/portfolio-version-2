import express from 'express';
import { uploadImage, deleteImage } from '../controllers/upload.controller.js';
import { upload } from '../middleware/upload.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, upload.single('image'), uploadImage);
router.delete('/', requireAuth, deleteImage);

export default router;
