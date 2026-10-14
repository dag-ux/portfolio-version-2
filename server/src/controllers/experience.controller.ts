import { Request, Response } from 'express';
import { Experience } from '../models/Experience.js';

export const getExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.json(experiences);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch experiences', details: error.message });
  }
};

export const createExperience = async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    if (!body.company || !body.position || !body.startDate || !body.description) {
      return res.status(400).json({ error: 'Company, position, startDate and description are required' });
    }
    const experience = new Experience(body);
    await experience.save();
    res.status(201).json(experience);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to create experience', details: error.message });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!experience) return res.status(404).json({ error: 'Experience not found' });
    res.json(experience);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update experience', details: error.message });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) return res.status(404).json({ error: 'Experience not found' });
    res.json({ message: 'Experience deleted' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete experience', details: error.message });
  }
};
