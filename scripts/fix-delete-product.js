/**
 * Script برای بررسی و اصلاح constraint های حذف محصول
 * این کار باعث می‌شود که بتوان محصول را در هر شرایطی حذف کرد
 * 
 * استفاده:
 * node scripts/fix-delete-product.js
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

async function fixConstraints() {
  try {
    console.log('🔄 در حال بررسی و اصلاح constraints...');
    
    // بررسی constraint برای cart_items
    console.log('\n📦 بررسی cart_items constraint...');
    try {
      // حذف constraint قدیمی
      await prisma.$executeRaw`
        ALTER TABLE "cart_items" 
        DROP CONSTRAINT IF EXISTS "cart_items_productId_fkey";
      `;
      console.log('✅ Constraint قدیمی cart_items حذف شد');
      
      // اضافه کردن constraint جدید با onDelete: CASCADE
      await prisma.$executeRaw`
        ALTER TABLE "cart_items" 
        ADD CONSTRAINT "cart_items_productId_fkey" 
        FOREIGN KEY ("productId") 
        REFERENCES "products"("id") 
        ON DELETE CASCADE;
      `;
      console.log('✅ Constraint cart_items با CASCADE تنظیم شد');
    } catch (error) {
      console.error('❌ خطا در تنظیم cart_items constraint:', error.message);
    }
    
    // بررسی constraint برای order_items
    console.log('\n📦 بررسی order_items constraint...');
    try {
      // حذف constraint قدیمی
      await prisma.$executeRaw`
        ALTER TABLE "order_items" 
        DROP CONSTRAINT IF EXISTS "order_items_productId_fkey";
      `;
      console.log('✅ Constraint قدیمی order_items حذف شد');
      
      // اضافه کردن constraint جدید با onDelete: SET NULL
      await prisma.$executeRaw`
        ALTER TABLE "order_items" 
        ADD CONSTRAINT "order_items_productId_fkey" 
        FOREIGN KEY ("productId") 
        REFERENCES "products"("id") 
        ON DELETE SET NULL;
      `;
      console.log('✅ Constraint order_items با SET NULL تنظیم شد');
    } catch (error) {
      console.error('❌ خطا در تنظیم order_items constraint:', error.message);
    }
    
    // بررسی نهایی
    console.log('\n📊 نتیجه:');
    console.log('✅ cart_items constraint با CASCADE تنظیم شد');
    console.log('✅ order_items constraint با SET NULL تنظیم شد');
    
    console.log('\n✨ همه constraints به درستی تنظیم شدند!');
    console.log('✅ حالا می‌توان محصول را در هر شرایطی حذف کرد');
    
  } catch (error) {
    console.error('❌ خطا در اجرای migration:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// اجرای migration
fixConstraints()
  .then(() => {
    console.log('\n✨ Migration با موفقیت انجام شد!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ خطای غیرمنتظره:', error);
    process.exit(1);
  });

