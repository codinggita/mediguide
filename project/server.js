import { spawn } from 'child_process';
import app, { autoSeed } from './api/index.js';
import { HOSPITALS_DATA } from './src/data/hospitals.js';

const port = process.env.PORT || 3000;

// 1. Start Express Server
const server = app.listen(port, async () => {
  console.log(`\n🚀 [BACKEND] Server is running on http://localhost:${port}`);
  
  // 2. Auto-Seed Database if empty
  console.log('🔍 Checking database for hospital data...');
  await autoSeed(HOSPITALS_DATA);

  console.log('🌐 [FRONTEND] Starting Vite development server...');
  
  // 3. Spawn Vite Frontend
  const vite = spawn('npx', ['vite'], {
    shell: true,
    stdio: 'inherit' // This pipes Vite logs directly to this terminal
  });

  vite.on('error', (err) => {
    console.error('❌ Failed to start Vite:', err);
  });

  vite.on('close', (code) => {
    console.log(`Vite process exited with code ${code}`);
    process.exit(code);
  });
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nStopping servers...');
  server.close();
  process.exit();
});
