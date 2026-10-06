import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8"]);

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    console.log(`📡 Connecting to MongoDB...`);
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📚 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};