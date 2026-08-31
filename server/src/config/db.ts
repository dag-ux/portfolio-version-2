import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolioDB';
    console.log(`📡 Connecting to MongoDB at: ${mongoURI}`);
    
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📚 Database: ${conn.connection.name}`);
    
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📚 Available collections:', collections.map(c => c.name));
    
    if (collections.some(c => c.name === 'projects')) {
      try {
        const Project = (await import('../models/Project')).default;
        const count = await Project.countDocuments();
        console.log(`📊 Projects in database: ${count}`);
      } catch (error) {
        console.log('⚠️ Could not count projects:', error);
      }
    }
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};