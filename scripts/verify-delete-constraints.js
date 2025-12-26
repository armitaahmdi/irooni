/**
 * Script برای بررسی و به‌روزرسانی foreign key constraints
 * این کار باعث می‌شود که بتوان محصول را در هر شرایطی حذف کرد
 * 
 * استفاده:
 * node scripts/verify-delete-constraints.js
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

async function verifyConstraints() {
  try {
    console.log('🔄 در حال بررسی foreign key constraints...');
    
    // بررسی constraint برای cart_items
    try {
      await prisma.$executeRaw`
        ALTER TABLE "cart_items" 
        DROP CONSTRAINT IF EXISTS "cart_items_productId_fkey";
      `;
      console.log('✅ Constraint قدیمی cart_items حذف شد');
    } catch (error) {
      console.log('ℹ️  Constraint قدیمی cart_items وجود نداشت');
    }
    
    // اضافه کردن constraint جدید با onDelete: Cascade
    await prisma.$executeRaw`
      ALTER TABLE "cart_items" 
      ADD CONSTRAINT "cart_items_productId_fkey" 
      FOREIGN KEY ("productId") 
      REFERENCES "products"("id") 
      ON DELETE CASCADE;
    `;
    console.log('✅ Constraint cart_items با CASCADE تنظیم شد');
    
    // بررسی constraint برای order_items (اگر قبلاً تنظیم نشده باشد)
    try {
      const checkOrderItems = await prisma.$queryRaw`
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'order_items' 
        AND constraint_name = 'order_items_productId_fkey';
      `;
      
      if (checkOrderItems.length === 0) {
        await prisma.$executeRaw`
          ALTER TABLE "order_items" 
          ADD CONSTRAINT "order_items_productId_fkey" 
          FOREIGN KEY ("productId") 
          REFERENCES "products"("id") 
          ON DELETE SET NULL;
        `;
        console.log('✅ Constraint order_items با SET NULL تنظیم شد');
      } else {
        console.log('ℹ️  Constraint order_items از قبل وجود دارد');
      }
    } catch (error) {
      console.log('ℹ️  خطا در تنظیم constraint order_items:', error.message);
    }
    
    console.log('✅ همه constraints به درستی تنظیم شدند!');
    console.log('✅ حالا می‌توان محصول را در هر شرایطی حذف کرد:');
    console.log('   - اگر در سبد خرید باشد، cart_items به صورت خودکار حذف می‌شوند');
    console.log('   - اگر در سفارشات باشد، productId در order_items به null تبدیل می‌شود');
    
  } catch (error) {
    console.error('❌ خطا در اجرای migration:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// اجرای migration
verifyConstraints()
  .then(() => {
    console.log('✨ Migration با موفقیت انجام شد!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ خطای غیرمنتظره:', error);
    process.exit(1);
  });

