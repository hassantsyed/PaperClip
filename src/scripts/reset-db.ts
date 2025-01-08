import path from 'path';
import fs from 'fs';
import os from 'os';

// Manually construct the path based on OS
const APP_NAME = 'portal';
const userDataPath = process.platform === 'darwin'
  ? path.join(os.homedir(), 'Library', 'Application Support', APP_NAME)
  : process.platform === 'win32'
    ? path.join(process.env.APPDATA || '', APP_NAME)
    : path.join(os.homedir(), '.config', APP_NAME);

const dbPath = path.join(userDataPath, 'database.json');

if (fs.existsSync(dbPath)) {
    console.log('Database file found at:', dbPath);
    console.log('Size:', (fs.statSync(dbPath).size / 1024).toFixed(2), 'KB');
    fs.unlinkSync(dbPath);
    console.log('Database deleted successfully');
} else {
    console.log('No database file found. Would create at:', dbPath);
} 