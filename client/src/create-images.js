import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Created uploads directory');
} else {
  console.log('✅ Uploads directory already exists');
}

// Function to create a simple PNG placeholder using base64
function createPlaceholderImage(title, bgColor) {
  // Simple SVG with the project title
  const svg = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${darkenColor(bgColor)};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#grad)"/>
    <rect x="50" y="50" width="500" height="300" rx="15" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
    <text x="300" y="170" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">
      ${title}
    </text>
    <text x="300" y="210" font-family="Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.6)" text-anchor="middle">
      Portfolio Project
    </text>
    <circle cx="300" cy="290" r="25" fill="rgba(255,255,255,0.1)"/>
    <circle cx="300" cy="290" r="8" fill="rgba(255,255,255,0.3)"/>
    <line x1="200" y1="330" x2="400" y2="330" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  </svg>`;
  
  return svg;
}

function darkenColor(hex) {
  let r = parseInt(hex.slice(1,3), 16);
  let g = parseInt(hex.slice(3,5), 16);
  let b = parseInt(hex.slice(5,7), 16);
  r = Math.floor(r * 0.7);
  g = Math.floor(g * 0.7);
  b = Math.floor(b * 0.7);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// Image data from your database
const images = [
  { 
    filename: '1786992594741-592151621.png', 
    title: 'DERASH BILL AGGREGATIONS', 
    bg: '#1a1a2e' 
  },
  { 
    filename: '1786992078038-291505216.png', 
    title: 'DERASH BILL AGGREGATIONS', 
    bg: '#16213e' 
  },
  { 
    filename: '1786712553050-972026875.png', 
    title: 'Mugher Cement Website', 
    bg: '#0f3460' 
  }
];

// Create each image
images.forEach(({ filename, title, bg }) => {
  const filePath = path.join(uploadDir, filename);
  const svgContent = createPlaceholderImage(title, bg);
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Created: ${filename}`);
});

console.log('✅ All placeholder images created successfully!');
console.log(`📁 Location: ${uploadDir}`);
console.log('\n📸 Images created:');
images.forEach(({ filename, title }) => {
  console.log(`  - ${filename} (${title})`);
});