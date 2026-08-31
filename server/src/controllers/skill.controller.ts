import { Request, Response } from 'express';
import { Skill } from '../models/Skill';

export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
};