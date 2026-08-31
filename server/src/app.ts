// server/src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import contactRoutes from './routes/contact.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Serve static files
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// ==================== CONNECT TO MONGODB ====================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolioDB';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected successfully');
    console.log(`📚 Database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
  });

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ==================== PROJECTS ROUTES ====================

// ✅ IMPORTANT: Define Project model and routes
let Project: any;

// Function to get Project model
const getProjectModel = async () => {
  if (!Project) {
    try {
      // Try to get existing model
      Project = mongoose.model('Project');
    } catch (e) {
      // Or import it
      const module = await import('./models/Project.js');
      Project = module.default;
    }
  }
  return Project;
};

// ✅ GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    console.log('📝 GET /api/projects called');
    
    const ProjectModel = await getProjectModel();
    const projects = await ProjectModel.find().sort({ createdAt: -1 });
    
    console.log(`✅ Found ${projects.length} projects`);
    res.json(projects);
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({ 
      error: 'Failed to fetch projects',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ✅ GET single project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const ProjectModel = await getProjectModel();
    const project = await ProjectModel.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('❌ Error fetching project:', error);
    res.status(500).json({ 
      error: 'Failed to fetch project',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ✅ POST create project
app.post('/api/projects', async (req, res) => {
  try {
    console.log('📝 POST /api/projects');
    
    const ProjectModel = await getProjectModel();
    const projectData = { ...req.body };
    
    // Parse techStack if it's a string
    if (typeof projectData.techStack === 'string') {
      try {
        projectData.techStack = JSON.parse(projectData.techStack);
      } catch {
        projectData.techStack = projectData.techStack.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
    }
    
    // Validation
    if (!projectData.title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!projectData.description) {
      return res.status(400).json({ error: 'Description is required' });
    }
    
    const project = new ProjectModel(projectData);
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
});

// ✅ PUT update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const ProjectModel = await getProjectModel();
    const projectData = { ...req.body };
    
    // Parse techStack if it's a string
    if (typeof projectData.techStack === 'string') {
      try {
        projectData.techStack = JSON.parse(projectData.techStack);
      } catch {
        projectData.techStack = projectData.techStack.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
    }
    
    const project = await ProjectModel.findByIdAndUpdate(
      req.params.id,
      projectData,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    console.log(`✅ Project updated: ${project.title}`);
    res.json(project);
  } catch (error: any) {
    console.error('❌ Error updating project:', error);
    res.status(400).json({ 
      error: 'Failed to update project',
      details: error.message 
    });
  }
});

// ✅ DELETE project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const ProjectModel = await getProjectModel();
    const project = await ProjectModel.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    console.log(`✅ Project deleted: ${project.title}`);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting project:', error);
    res.status(500).json({ 
      error: 'Failed to delete project',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ==================== CONTACT ROUTES ====================
app.use('/api/contact', contactRoutes);

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Global error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

console.log('✅ All routes registered successfully!');

export default app;