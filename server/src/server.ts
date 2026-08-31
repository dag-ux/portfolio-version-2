import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

console.log('🔍 Starting server...');
console.log(`📌 Imported app type: ${typeof app}`);

// ✅ Make sure the server actually starts
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Test route: http://localhost:${PORT}/api/test`);
  console.log(`📁 Projects API: http://localhost:${PORT}/api/projects`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
});