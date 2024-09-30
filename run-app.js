// run-app.js
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverPath = path.join(__dirname, 'server');
const clientPath = path.join(__dirname, 'client');

const server = spawn('npm', ['start'], { cwd: serverPath, shell: true });
const client = spawn('npm', ['start'], { cwd: clientPath, shell: true });

server.stdout.on('data', (data) => {
  console.log(`Server: ${data}`);
});

client.stdout.on('data', (data) => {
  console.log(`${data}`);  // This will include the QR code
});

server.stderr.on('data', (data) => {
  console.error(`Server Error: ${data}`);
});

client.stderr.on('data', (data) => {
  console.error(`Client Error: ${data}`);
});

process.on('SIGINT', () => {
  server.kill();
  client.kill();
  process.exit();
});