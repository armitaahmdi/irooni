/**
 * Script برای nullable کردن productId در order_items
 * این کار باعث می‌شود که بتوان محصول را حذف کرد و productId به null تبدیل شود
 * 
 * استفاده:
 * node scripts/make-productid-nullable.js
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

async function makeProductIdNullable() {
  try {
    console.log('🔄 در حال nullable کردن productId در order_items...');
    
    // ابتدا constraint را حذف می‌کنیم
    try {
      await prisma.$executeRaw`
        ALTER TABLE "order_items" 
        DROP CONSTRAINT IF EXISTS "order_items_productId_fkey";
      `;
      console.log('✅ Constraint قدیمی حذف شد');
    } catch (error) {
      console.log('ℹ️  Constraint قدیمی وجود نداشت');
    }
    
    // حالا productId را nullable می‌کنیم
    await prisma.$executeRaw`
      ALTER TABLE "order_items" 
      ALTER COLUMN "productId" DROP NOT NULL;
    `;
    console.log('✅ productId در order_items nullable شد');
    
    // حالا constraint جدید را با onDelete: SET NULL اضافه می‌کنیم
    await prisma.$executeRaw`
      ALTER TABLE "order_items" 
      ADD CONSTRAINT "order_items_productId_fkey" 
      FOREIGN KEY ("productId") 
      REFERENCES "products"("id") 
      ON DELETE SET NULL;
    `;
    console.log('✅ Constraint جدید با SET NULL تنظیم شد');
    
    console.log('\n✨ Migration با موفقیت انجام شد!');
    console.log('✅ حالا می‌توان محصول را حذف کرد و productId در order_items به null تبدیل می‌شود');
    
  } catch (error) {
    console.error('❌ خطا در اجرای migration:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// اجرای migration
makeProductIdNullable()
  .then(() => {
    console.log('\n✨ Migration با موفقیت انجام شد!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ خطای غیرمنتظره:', error);
    process.exit(1);
  });

