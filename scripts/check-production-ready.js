#!/usr/bin/env node
/**
 * Production Readiness Check Script
 * این اسکریپت تمام جنبه‌های مهم برای production را بررسی می‌کند
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let errors = [];
let warnings = [];
let info = [];

function log(message, type = 'info') {
  const prefix = type === 'error' ? `${colors.red}✗${colors.reset}` :
                 type === 'warning' ? `${colors.yellow}⚠${colors.reset}` :
                 type === 'success' ? `${colors.green}✓${colors.reset}` :
                 `${colors.blue}ℹ${colors.reset}`;
  console.log(`${prefix} ${message}`);
}

function checkEnvFile() {
  log('بررسی فایل .env', 'info');
  const envPath = resolve(rootDir, '.env');
  
  if (!existsSync(envPath)) {
    errors.push('فایل .env وجود ندارد');
    log('فایل .env وجود ندارد', 'error');
    return null;
  }
  
  log('فایل .env یافت شد', 'success');
  
  const envContent = readFileSync(envPath, 'utf-8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  return envVars;
}

function checkEnvVariables(envVars) {
  log('بررسی متغیرهای محیطی', 'info');
  
  const required = [
    'NODE_ENV',
    'DATABASE_URL',
    'AUTH_SECRET',
    'NEXT_PUBLIC_BASE_URL',
  ];
  
  required.forEach(key => {
    if (!envVars[key] || envVars[key] === '') {
      errors.push(`متغیر ${key} تنظیم نشده است`);
      log(`متغیر ${key} تنظیم نشده است`, 'error');
    } else {
      log(`✓ ${key} تنظیم شده است`, 'success');
    }
  });
  
  // Check NODE_ENV
  if (envVars.NODE_ENV && envVars.NODE_ENV !== 'production') {
    warnings.push(`NODE_ENV باید production باشد (فعلاً: ${envVars.NODE_ENV})`);
    log(`NODE_ENV باید production باشد (فعلاً: ${envVars.NODE_ENV})`, 'warning');
  }
  
  // Check NEXT_PUBLIC_API_URL - این باید خالی باشد یا بدون /api
  if (envVars.NEXT_PUBLIC_API_URL) {
    if (envVars.NEXT_PUBLIC_API_URL.includes('/api')) {
      errors.push('NEXT_PUBLIC_API_URL نباید شامل /api باشد (این باعث خطای api/api/... می‌شود)');
      log('NEXT_PUBLIC_API_URL نباید شامل /api باشد', 'error');
    } else {
      info.push('NEXT_PUBLIC_API_URL تنظیم شده است (بهتر است خالی باشد)');
      log('NEXT_PUBLIC_API_URL تنظیم شده است (بهتر است خالی باشد)', 'info');
    }
  } else {
    log('✓ NEXT_PUBLIC_API_URL خالی است (صحیح)', 'success');
  }
  
  // Check DATABASE_URL for SSL in production
  if (envVars.DATABASE_URL && envVars.NODE_ENV === 'production') {
    if (!envVars.DATABASE_URL.includes('sslmode=require')) {
      warnings.push('برای production بهتر است DATABASE_URL شامل sslmode=require باشد');
      log('برای production بهتر است DATABASE_URL شامل SSL باشد', 'warning');
    } else {
      log('✓ DATABASE_URL شامل SSL است', 'success');
    }
  }
  
  // Check AUTH_SECRET
  if (envVars.AUTH_SECRET) {
    if (envVars.AUTH_SECRET.length < 32) {
      warnings.push('AUTH_SECRET باید حداقل 32 کاراکتر باشد');
      log('AUTH_SECRET کوتاه است (حداقل 32 کاراکتر)', 'warning');
    } else if (envVars.AUTH_SECRET.includes('CHANGE_THIS') || envVars.AUTH_SECRET.includes('your-')) {
      errors.push('AUTH_SECRET باید یک مقدار واقعی باشد، نه placeholder');
      log('AUTH_SECRET یک placeholder است', 'error');
    } else {
      log('✓ AUTH_SECRET معتبر است', 'success');
    }
  }
  
  // Check NEXT_PUBLIC_BASE_URL
  if (envVars.NEXT_PUBLIC_BASE_URL) {
    if (!envVars.NEXT_PUBLIC_BASE_URL.startsWith('https://')) {
      warnings.push('برای production بهتر است NEXT_PUBLIC_BASE_URL با https شروع شود');
      log('NEXT_PUBLIC_BASE_URL با https شروع نمی‌شود', 'warning');
    } else {
      log('✓ NEXT_PUBLIC_BASE_URL با https شروع می‌شود', 'success');
    }
  }
}

function checkBuildFiles() {
  log('بررسی فایل‌های build', 'info');
  
  const standalonePath = resolve(rootDir, '.next', 'standalone', 'server.js');
  const buildManifestPath = resolve(rootDir, '.next', 'BUILD_ID');
  
  if (!existsSync(standalonePath)) {
    errors.push('فایل .next/standalone/server.js وجود ندارد (باید npm run build اجرا شود)');
    log('فایل .next/standalone/server.js وجود ندارد', 'error');
  } else {
    log('✓ فایل standalone/server.js وجود دارد', 'success');
  }
  
  if (!existsSync(buildManifestPath)) {
    warnings.push('فایل BUILD_ID وجود ندارد (باید npm run build اجرا شود)');
    log('فایل BUILD_ID وجود ندارد', 'warning');
  } else {
    log('✓ فایل BUILD_ID وجود دارد', 'success');
  }
}

function checkPackageJson() {
  log('بررسی package.json', 'info');
  
  const packageJsonPath = resolve(rootDir, 'package.json');
  if (!existsSync(packageJsonPath)) {
    errors.push('فایل package.json وجود ندارد');
    return;
  }
  
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  
  // Check scripts
  const requiredScripts = ['build', 'start', 'dev'];
  requiredScripts.forEach(script => {
    if (!packageJson.scripts || !packageJson.scripts[script]) {
      errors.push(`اسکریپت ${script} در package.json وجود ندارد`);
      log(`اسکریپت ${script} وجود ندارد`, 'error');
    } else {
      log(`✓ اسکریپت ${script} وجود دارد`, 'success');
    }
  });
  
  // Check start script
  if (packageJson.scripts && packageJson.scripts.start) {
    if (!packageJson.scripts.start.includes('standalone')) {
      warnings.push('اسکریپت start باید از standalone استفاده کند');
      log('اسکریپت start بررسی شد', 'info');
    } else {
      log('✓ اسکریپت start از standalone استفاده می‌کند', 'success');
    }
  }
}

function checkNextConfig() {
  log('بررسی next.config.mjs', 'info');
  
  const configPath = resolve(rootDir, 'next.config.mjs');
  if (!existsSync(configPath)) {
    errors.push('فایل next.config.mjs وجود ندارد');
    return;
  }
  
  const configContent = readFileSync(configPath, 'utf-8');
  
  // Check for output: 'standalone'
  if (!configContent.includes("output: 'standalone'") && !configContent.includes('output: "standalone"')) {
    errors.push('next.config.mjs باید output: "standalone" داشته باشد');
    log('output: "standalone" در next.config.mjs یافت نشد', 'error');
  } else {
    log('✓ output: "standalone" تنظیم شده است', 'success');
  }
  
  // Check for security headers
  if (configContent.includes('headers()')) {
    log('✓ Security headers تنظیم شده‌اند', 'success');
  } else {
    warnings.push('Security headers در next.config.mjs بررسی نشد');
  }
}

function checkEcosystemConfig() {
  log('بررسی ecosystem.config.js', 'info');
  
  const ecosystemPath = resolve(rootDir, 'ecosystem.config.js');
  if (!existsSync(ecosystemPath)) {
    warnings.push('فایل ecosystem.config.js وجود ندارد (برای PM2 اختیاری است)');
    return;
  }
  
  const ecosystemContent = readFileSync(ecosystemPath, 'utf-8');
  
  // Check for NEXT_PUBLIC_API_URL
  if (ecosystemContent.includes('NEXT_PUBLIC_API_URL')) {
    if (ecosystemContent.includes("NEXT_PUBLIC_API_URL: \"\"") || ecosystemContent.includes("NEXT_PUBLIC_API_URL: ''")) {
      log('✓ NEXT_PUBLIC_API_URL در ecosystem.config.js خالی است (صحیح)', 'success');
    } else if (ecosystemContent.includes('/api')) {
      warnings.push('NEXT_PUBLIC_API_URL در ecosystem.config.js نباید شامل /api باشد');
      log('NEXT_PUBLIC_API_URL در ecosystem.config.js شامل /api است', 'warning');
    }
  }
}

function checkApiClient() {
  log('بررسی lib/api/client.js', 'info');
  
  const clientPath = resolve(rootDir, 'lib', 'api', 'client.js');
  if (!existsSync(clientPath)) {
    errors.push('فایل lib/api/client.js وجود ندارد');
    return;
  }
  
  const clientContent = readFileSync(clientPath, 'utf-8');
  
  // Check if the fix for /api/api/ issue is present
  if (clientContent.includes('replace(/\\/api\\/?$/,') || clientContent.includes('replace(/\/api\/?$/,') || clientContent.includes('replace(/\/api\/?$/,')) {
    log('✓ Fix برای مشکل api/api/ وجود دارد', 'success');
  } else {
    warnings.push('ممکن است fix برای مشکل api/api/ وجود نداشته باشد');
    log('بررسی fix برای api/api/...', 'info');
  }
}

function checkPrisma() {
  log('بررسی Prisma schema', 'info');
  
  const schemaPath = resolve(rootDir, 'prisma', 'schema.prisma');
  if (!existsSync(schemaPath)) {
    errors.push('فایل prisma/schema.prisma وجود ندارد');
    return;
  }
  
  log('✓ فایل schema.prisma وجود دارد', 'success');
  
  // Check if migrations directory exists
  const migrationsDir = resolve(rootDir, 'prisma', 'migrations');
  if (existsSync(migrationsDir)) {
    log('✓ دایرکتوری migrations وجود دارد', 'success');
  } else {
    warnings.push('دایرکتوری migrations وجود ندارد');
  }
}

function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.bright}${colors.cyan}گزارش نهایی Production Readiness${colors.reset}`);
  console.log('='.repeat(60) + '\n');
  
  console.log(`${colors.green}✓ موارد موفق: ${info.length + (errors.length === 0 && warnings.length === 0 ? 1 : 0)}${colors.reset}`);
  if (warnings.length > 0) {
    console.log(`${colors.yellow}⚠ هشدارها: ${warnings.length}${colors.reset}`);
  }
  if (errors.length > 0) {
    console.log(`${colors.red}✗ خطاها: ${errors.length}${colors.reset}`);
  }
  
  if (errors.length > 0) {
    console.log(`\n${colors.red}${colors.bright}خطاهای بحرانی:${colors.reset}`);
    errors.forEach((error, index) => {
      console.log(`${colors.red}${index + 1}. ${error}${colors.reset}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log(`\n${colors.yellow}${colors.bright}هشدارها:${colors.reset}`);
    warnings.forEach((warning, index) => {
      console.log(`${colors.yellow}${index + 1}. ${warning}${colors.reset}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (errors.length === 0) {
    console.log(`${colors.green}${colors.bright}✓ پروژه آماده deployment است!${colors.reset}`);
    console.log(`${colors.blue}نکته: حتماً قبل از deployment تمام هشدارها را بررسی کنید.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}${colors.bright}✗ پروژه آماده deployment نیست!${colors.reset}`);
    console.log(`${colors.yellow}لطفاً خطاهای بالا را برطرف کنید.${colors.reset}\n`);
    process.exit(1);
  }
}

async function main() {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   Production Readiness Check - Irooni Project          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(colors.reset + '\n');
  
  // Check environment file
  const envVars = checkEnvFile();
  
  if (envVars) {
    checkEnvVariables(envVars);
  }
  
  // Check build files
  checkBuildFiles();
  
  // Check package.json
  checkPackageJson();
  
  // Check next.config.mjs
  checkNextConfig();
  
  // Check ecosystem.config.js
  checkEcosystemConfig();
  
  // Check API client
  checkApiClient();
  
  // Check Prisma
  checkPrisma();
  
  // Generate report
  generateReport();
}

main().catch(error => {
  console.error(`${colors.red}خطا در اجرای اسکریپت:${colors.reset}`, error);
  process.exit(1);
});

