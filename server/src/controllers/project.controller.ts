import { Request, Response } from 'express';
import mongoose from 'mongoose';

console.log('🔍 ===== DEBUG: Loading project controller =====');

// Helper function to get the model safely
const getProjectModel = () => {
  // @ts-ignore - Ignore TypeScript union type issue
  return mongoose.model('Project');
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    console.log('📝 GET /api/projects called - Fetching all projects');
    
    const Project = getProjectModel();
    const projects = await Project.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${projects.length} projects in database`);
    res.status(200).json(projects);
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({ 
      error: 'Failed to fetch projects',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log(`📝 GET /api/projects/${id}`);
    
    const Project = getProjectModel();
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    console.error('❌ Error fetching project:', error);
    res.status(500).json({ 
      error: 'Failed to fetch project',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    console.log('📝 POST /api/projects');
    
    const Project = getProjectModel();
    const projectData = { ...req.body };

    if (typeof projectData.techStack === 'string') {
      try {
        projectData.techStack = JSON.parse(projectData.techStack);
      } catch {
        projectData.techStack = projectData.techStack.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
    }

    if (!projectData.title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!projectData.description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const project = new Project(projectData);
    await project.save();
    
    console.log(`✅ Project created: ${project.title}`);
    res.status(201).json(project);
  } catch (error: any) {
    console.error('❌ Error creating project:', error);
    res.status(400).json({ 
      error: 'Failed to create project',
      details: error.message 
    });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log(`📝 PUT /api/projects/${id}`);
    
    const Project = getProjectModel();
    const projectData = { ...req.body };

    if (typeof projectData.techStack === 'string') {
      try {
        projectData.techStack = JSON.parse(projectData.techStack);
      } catch {
        projectData.techStack = projectData.techStack.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
    }

    const project = await Project.findByIdAndUpdate(
      id,
      projectData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log(`✅ Project updated: ${project.title}`);
    res.status(200).json(project);
  } catch (error: any) {
    console.error('❌ Error updating project:', error);
    res.status(400).json({ 
      error: 'Failed to update project',
      details: error.message 
    });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log(`📝 DELETE /api/projects/${id}`);
    
    const Project = getProjectModel();
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await Project.findByIdAndDelete(id);
    console.log(`✅ Project deleted: ${project.title}`);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting project:', error);
    res.status(500).json({ 
      error: 'Failed to delete project',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Multer middleware placeholder
export const uploadSingle = (req: any, res: any, next: any) => {
  console.log('📦 uploadSingle middleware called');
  next();
};

console.log('✅ Project controller loaded successfully!');