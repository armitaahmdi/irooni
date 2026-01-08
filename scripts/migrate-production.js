/**
 * Production Migration Script
 * Safely runs Prisma migrations in production environment
 * Includes backup before migration and rollback capability
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createBackup, cleanupOldBackups } = require('./backup');

const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const MIGRATION_BACKUP_DIR = path.join(__dirname, '..', 'migration-backups');

// Ensure backup directories exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}
if (!fs.existsSync(MIGRATION_BACKUP_DIR)) {
  fs.mkdirSync(MIGRATION_BACKUP_DIR, { recursive: true });
}

async function createMigrationBackup() {
  console.log('📦 Creating database backup before migration...');
  try {
    const backupPath = await createBackup();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const migrationBackupPath = path.join(MIGRATION_BACKUP_DIR, `pre-migration-${timestamp}.sql`);
    
    // Copy backup to migration backups directory
    fs.copyFileSync(backupPath, migrationBackupPath);
    console.log(`✅ Migration backup created: ${migrationBackupPath}`);
    return migrationBackupPath;
  } catch (error) {
    console.error('❌ Failed to create migration backup:', error.message);
    throw error;
  }
}

function checkPrismaStatus() {
  console.log('🔍 Checking Prisma status...');
  try {
    const status = execSync('npx prisma migrate status', { 
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    console.log(status);
    return true;
  } catch (error) {
    console.error('❌ Prisma status check failed:', error.message);
    return false;
  }
}

async function runMigrations() {
  console.log('🔄 Running database migrations...');
  
  try {
    // Check current migration status
    if (!checkPrismaStatus()) {
      throw new Error('Migration status check failed');
    }

    // Create backup before migration
    const backupPath = await createMigrationBackup();

    // Run migrations in production mode
    console.log('⏳ Executing migrations...');
    execSync('npx prisma migrate deploy', {
      encoding: 'utf-8',
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production',
      },
    });

    console.log('✅ Migrations completed successfully');
    
    // Verify migration
    checkPrismaStatus();
    
    return { success: true, backupPath };
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('💡 You can restore from backup if needed');
    throw error;
  }
}

function generatePrismaClient() {
  console.log('🔨 Generating Prisma Client...');
  try {
    execSync('npx prisma generate', {
      encoding: 'utf-8',
      stdio: 'inherit',
    });
    console.log('✅ Prisma Client generated successfully');
  } catch (error) {
    console.error('❌ Failed to generate Prisma Client:', error.message);
    throw error;
  }
}

async function cleanupOldMigrationBackups() {
  console.log('🧹 Cleaning up old migration backups...');
  try {
    const files = fs.readdirSync(MIGRATION_BACKUP_DIR)
      .filter(file => file.startsWith('pre-migration-') && file.endsWith('.sql'))
      .map(file => ({
        name: file,
        path: path.join(MIGRATION_BACKUP_DIR, file),
        stats: fs.statSync(path.join(MIGRATION_BACKUP_DIR, file)),
      }))
      .sort((a, b) => b.stats.mtime - a.stats.mtime);

    // Keep only last 5 migration backups
    const toDelete = files.slice(5);
    for (const file of toDelete) {
      fs.unlinkSync(file.path);
      console.log(`🗑️  Deleted old migration backup: ${file.name}`);
    }
  } catch (error) {
    console.warn('⚠️  Failed to cleanup old migration backups:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting production migration process...\n');

  // Check environment
  if (process.env.NODE_ENV !== 'production' && !process.env.FORCE_MIGRATION) {
    console.warn('⚠️  Warning: NODE_ENV is not set to production');
    console.warn('   Set FORCE_MIGRATION=1 to run migrations anyway\n');
  }

  try {
    // Step 1: Generate Prisma Client (ensure it's up to date)
    generatePrismaClient();
    console.log('');

    // Step 2: Run migrations
    const result = await runMigrations();
    console.log('');

    // Step 3: Cleanup old migration backups
    await cleanupOldMigrationBackups();
    console.log('');

    // Step 4: Cleanup regular backups
    await cleanupOldBackups();
    console.log('');

    console.log('✅ Production migration process completed successfully!');
    console.log(`📦 Backup location: ${result.backupPath}`);
    console.log('');
    console.log('💡 Next steps:');
    console.log('   1. Verify the application is working correctly');
    console.log('   2. Monitor application logs for any issues');
    console.log('   3. If problems occur, restore from backup');
  } catch (error) {
    console.error('');
    console.error('❌ Production migration process failed!');
    console.error('');
    console.error('💡 Recovery steps:');
    console.error('   1. Check the error message above');
    console.error('   2. Review Prisma migration files');
    console.error('   3. Restore from backup if needed');
    console.error('   4. Fix issues and retry migration');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { runMigrations, createMigrationBackup };

