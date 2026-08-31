import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'devops', 'database', 'mobile', 'other'],
    required: true,
  },
  proficiency: { type: Number, min: 0, max: 100, default: 80 },
  createdAt: { type: Date, default: Date.now },
});

export const Skill = mongoose.model('Skill', SkillSchema);