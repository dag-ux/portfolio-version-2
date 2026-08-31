import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/portfolioDB');
    console.log('✅ Connected to MongoDB successfully!');
    console.log(`📁 Database: ${mongoose.connection.db?.databaseName}`);

    // Test schema
    const testSchema = new mongoose.Schema({
      name: String,
      message: String,
      createdAt: { type: Date, default: Date.now }
    });
    const Test = mongoose.model('Test', testSchema);

    // Insert test data
    await Test.create({
      name: 'Dagimawit',
      message: 'MongoDB is working with Compass!'
    });
    console.log('✅ Test document inserted!');

    // Read test data
    const docs = await Test.find();
    console.log('📄 Documents:', docs);

    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testConnection();