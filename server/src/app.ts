// server/src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import contactRoutes from './routes/contact.routes.js';
import Project from './models/Project.js';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import skillRoutes from './routes/skill.routes.js';
import experienceRoutes from './routes/experience.routes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://portfolio-version-2-two.vercel.app',
  'https://portfolio-version-2.vercel.app',
  'https://portfolio-frontend.vercel.app',
  'https://dag-ux.github.io',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600,
}));

// Body parsers MUST come before routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolioDB';

const mongooseOptions: any = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('MongoDB Connected successfully');
    console.log(`Database: ${mongoose.connection.name}`);
    console.log(`Connection string: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@')}`);
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    console.log('Server will continue running but database features may not work');
  });

(mongoose.connection as any).on('error', (err: any) => {
  console.error('MongoDB connection error:', err);
});

(mongoose.connection as any).on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: process.uptime(),
  });
});

app.get('/api/projects', async (req, res) => {
  try {
    console.log('GET /api/projects called');

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected',
        message: 'Please try again later',
      });
    }

    const projects = await Project.find().sort({ createdAt: -1 });

    console.log(`Found ${projects.length} projects`);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      error: 'Failed to fetch projects',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    console.log(`GET /api/projects/${req.params.id}`);

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected',
        message: 'Please try again later',
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      error: 'Failed to fetch project',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    console.log('POST /api/projects');

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected',
        message: 'Please try again later',
      });
    }

    const projectData: any = { ...req.body };

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

    console.log(`Project created: ${project.title}`);
    res.status(201).json(project);
  } catch (error: any) {
    console.error('Error creating project:', error);
    res.status(400).json({
      error: 'Failed to create project',
      details: error.message,
    });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    console.log(`PUT /api/projects/${req.params.id}`);

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected',
        message: 'Please try again later',
      });
    }

    const projectData: any = { ...req.body };

    if (typeof projectData.techStack === 'string') {
      try {
        projectData.techStack = JSON.parse(projectData.techStack);
      } catch {
        projectData.techStack = projectData.techStack.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      projectData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log(`Project updated: ${project.title}`);
    res.json(project);
  } catch (error: any) {
    console.error('Error updating project:', error);
    res.status(400).json({
      error: 'Failed to update project',
      details: error.message,
    });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    console.log(`DELETE /api/projects/${req.params.id}`);

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected',
        message: 'Please try again later',
      });
    }

    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log(`Project deleted: ${project.title}`);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      error: 'Failed to delete project',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Route registrations AFTER body parsers
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/contact', contactRoutes);

app.use((req, res) => {
  console.log(`404: ${req.method} ${req.url}`);
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', err);

  const isProduction = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: isProduction ? 'Something went wrong. Please try again later.' : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

console.log('All routes registered successfully!');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);

export default app;
export { app };