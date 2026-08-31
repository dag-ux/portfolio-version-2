import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String, default: '' },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String, required: true },
  achievements: [{ type: String }],
  techStack: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export const Experience = mongoose.model('Experience', ExperienceSchema);