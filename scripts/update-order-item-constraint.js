/**
 * Script برای به‌روزرسانی foreign key constraint در order_items
 * این کار باعث می‌شود که بتوان محصول را حذف کرد حتی اگر در سفارشات باشد
 * 
 * استفاده:
 * node scripts/update-order-item-constraint.js
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

async function updateOrderItemConstraint() {
  try {
    console.log('🔄 در حال به‌روزرسانی foreign key constraint...');
    
    // ابتدا constraint قدیمی را حذف می‌کنیم
    try {
      await prisma.$executeRaw`
        ALTER TABLE "order_items" 
        DROP CONSTRAINT IF EXISTS "order_items_productId_fkey";
      `;
      console.log('✅ Constraint قدیمی حذف شد');
    } catch (error) {
      console.log('ℹ️  Constraint قدیمی وجود نداشت یا قبلاً حذف شده است');
    }
    
    // حالا constraint جدید را با onDelete: SetNull اضافه می‌کنیم
    await prisma.$executeRaw`
      ALTER TABLE "order_items" 
      ADD CONSTRAINT "order_items_productId_fkey" 
      FOREIGN KEY ("productId") 
      REFERENCES "products"("id") 
      ON DELETE SET NULL;
    `;
    
    console.log('✅ Constraint جدید با موفقیت اضافه شد!');
    console.log('✅ حالا می‌توان محصول را حذف کرد حتی اگر در سفارشات باشد');
    
  } catch (error) {
    console.error('❌ خطا در اجرای migration:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// اجرای migration
updateOrderItemConstraint()
  .then(() => {
    console.log('✨ Migration با موفقیت انجام شد!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ خطای غیرمنتظره:', error);
    process.exit(1);
  });

