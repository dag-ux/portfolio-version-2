import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { 
      type: String, 
      required: [true, 'Title is required'], 
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, 'Description is required'] 
    },
    image: { 
      type: String, 
      default: '' 
    },
    techStack: [{ 
      type: String 
    }],
    liveUrl: { 
      type: String, 
      default: '' 
    },
    githubUrl: { 
      type: String, 
      default: '' 
    },
    featured: { 
      type: Boolean, 
      default: false 
    },
  },
  {
    timestamps: true,
    collection: 'projects'
  }
);

// ✅ This registers the model with mongoose
const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export default Project;