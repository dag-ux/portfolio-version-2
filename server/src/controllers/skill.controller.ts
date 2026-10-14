import { Request, Response } from 'express';
import { Skill } from '../models/Skill.js';

export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
};

export const createSkill = async (req: Request, res: Response) => {
  try {
    const { name, category, proficiency } = req.body || {};
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }
    const skill = new Skill({ name, category, proficiency });
    await skill.save();
    res.status(201).json(skill);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to create skill', details: error.message });
  }
};

export const updateSkill = async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) return res.status(404).json({ error: 'Skill not found' });
    res.json(skill);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update skill', details: error.message });
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ error: 'Skill not found' });
    res.json({ message: 'Skill deleted' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete skill', details: error.message });
  }
};