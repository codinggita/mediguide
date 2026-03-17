import axios from 'axios';
import fs from 'fs';

// IMPORTANT: Set your Vercel URL here after deploying, or use localhost for testing
const API_URL = 'http://localhost:3000/api/hospitals/seed'; 
const SECRET = 'mediguide_secret_key'; // Match JWT_SECRET in api/index.js

async function seed() {
  console.log('🚀 Starting Database Seeding...');
  
  // 1. Read the current data
  // Since hospitals.js is ESM, we'll just parse the file content as a string for simplicity in this script
  const content = fs.readFileSync('./src/data/hospitals.js', 'utf8');
  const dataString = content.match(/HOSPITALS_DATA = (\[[\s\S]*?\]);/)[1];
  const hospitals = JSON.parse(dataString);

  console.log(`📦 Found ${hospitals.length} hospitals to seed.`);

  try {
    const res = await axios.post(API_URL, {
      data: hospitals,
      secret: SECRET
    });
    console.log('✅ Success:', res.data);
  } catch (err) {
    console.error('❌ Error Seeding:', err.response?.data || err.message);
    console.log('\n💡 Tip: Make sure your server is running or you have deployed to Vercel and updated the API_URL in this script.');
  }
}

seed();
