/**
 * Script برای اضافه کردن فیلد sizeStock به جدول products
 * 
 * استفاده:
 * node scripts/add-size-stock.js
 */

// استفاده از همان Prisma instance که در پروژه استفاده می‌شود
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// ایجاد Pool برای PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ایجاد adapter
const adapter = new PrismaPg(pool);

// ایجاد Prisma Client با تنظیمات مشابه پروژه
const prisma = new PrismaClient({
  adapter: adapter,
});

async function addSizeStockField() {
  try {
    console.log('🔄 در حال اضافه کردن فیلد sizeStock...');
    
    // اجرای SQL برای اضافه کردن فیلد
    await prisma.$executeRaw`
      ALTER TABLE "products" 
      ADD COLUMN IF NOT EXISTS "sizeStock" JSONB;
    `;
    
    console.log('✅ فیلد sizeStock با موفقیت اضافه شد!');
    
    // بررسی اینکه فیلد اضافه شده است
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'sizeStock';
    `;
    
    if (result.length > 0) {
      console.log('✅ تأیید: فیلد sizeStock در دیتابیس وجود دارد');
      console.log('📊 نوع داده:', result[0].data_type);
    }
    
  } catch (error) {
    // اگر فیلد از قبل وجود دارد، خطا نیست
    if (error.message?.includes('already exists') || 
        error.message?.includes('duplicate') ||
        error.code === '42701') {
      console.log('ℹ️  فیلد sizeStock از قبل وجود دارد');
      return;
    }
    
    console.error('❌ خطا در اجرای migration:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// اجرای migration
addSizeStockField()
  .then(() => {
    console.log('✨ Migration با موفقیت انجام شد!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ خطای غیرمنتظره:', error);
    process.exit(1);
  });

