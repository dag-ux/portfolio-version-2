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

// ✅ CORS Configuration - Allow multiple origins including deployment URLs
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://portfolio-version-2.vercel.app',  // Your Vercel frontend URL
  'https://portfolio-frontend.vercel.app',   // Alternative Vercel URL
  'https://dag-ux.github.io',                // GitHub Pages URL
  // Add your custom domain if you have one
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`❌ Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight requests for 10 minutes
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`📨 ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Serve static files
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// ==================== CONNECT TO MONGODB ====================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolioDB';

// MongoDB connection options for better stability
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
};

mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('✅ MongoDB Connected successfully');
    console.log(`📚 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Connection string: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@')}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    console.log('⚠️  Server will continue running but database features may not work');
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed through app termination');
  process.exit(0);
});

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: process.uptime()
  });
});

// ==================== PROJECTS ROUTES ====================

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
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected',
        message: 'Please try again later'
      });
    }

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
    console.log(`📝 GET /api/projects/${req.params.id}`);
    
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected',
        message: 'Please try again later'
      });
    }

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
    
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected',
        message: 'Please try again later'
      });
    }

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
    console.log(`📝 PUT /api/projects/${req.params.id}`);
    
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected',
        message: 'Please try again later'
      });
    }

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
    console.log(`📝 DELETE /api/projects/${req.params.id}`);
    
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected',
        message: 'Please try again later'
      });
    }

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
  
  // Don't expose internal errors in production
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: isProduction ? 'Something went wrong. Please try again later.' : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  });
});

console.log('✅ All routes registered successfully!');
console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🌐 CORS allowed origins: ${allowedOrigins.join(', ')}`);

export default app;