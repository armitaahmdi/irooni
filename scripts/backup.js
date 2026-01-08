/**
 * Database backup script
 * Usage: node scripts/backup.js
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const DATABASE_URL = process.env.DATABASE_URL;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function generateBackupFilename() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `backup-${timestamp}.sql`;
}

async function createBackup() {
  const filename = generateBackupFilename();
  const filepath = path.join(BACKUP_DIR, filename);

  console.log(`Creating backup: ${filename}`);

  // Extract database connection details from DATABASE_URL
  // Format: postgresql://user:password@host:port/database
  const url = new URL(DATABASE_URL);
  const host = url.hostname;
  const port = url.port;
  const database = url.pathname.slice(1);
  const username = url.username;
  const password = url.password;

  const pgDumpCommand = `PGPASSWORD=${password} pg_dump -h ${host} -p ${port} -U ${username} -d ${database} -f ${filepath} --no-password --format=custom`;

  return new Promise((resolve, reject) => {
    exec(pgDumpCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('Backup failed:', error);
        reject(error);
        return;
      }

      if (stderr) {
        console.warn('Backup warnings:', stderr);
      }

      console.log('Backup completed successfully:', filename);
      resolve(filepath);
    });
  });
}

async function cleanupOldBackups() {
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(file => file.startsWith('backup-') && file.endsWith('.sql'))
    .map(file => ({
      name: file,
      path: path.join(BACKUP_DIR, file),
      stats: fs.statSync(path.join(BACKUP_DIR, file)),
    }))
    .sort((a, b) => b.stats.mtime - a.stats.mtime);

  // Keep only last 10 backups
  const toDelete = files.slice(10);

  for (const file of toDelete) {
    fs.unlinkSync(file.path);
    console.log(`Deleted old backup: ${file.name}`);
  }
}

async function main() {
  try {
    await createBackup();
    await cleanupOldBackups();
    console.log('Backup process completed successfully');
  } catch (error) {
    console.error('Backup process failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { createBackup, cleanupOldBackups };
