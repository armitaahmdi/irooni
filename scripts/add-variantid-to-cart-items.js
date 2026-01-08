/**
 * Script برای اضافه کردن فیلد variantId به cart_items و order_items
 * 
 * استفاده:
 * node scripts/add-variantid-to-cart-items.js
 */

const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter: adapter,
});

async function addVariantIdToCartItems() {
  try {
    console.log('🔄 در حال اضافه کردن فیلد variantId...');
    
    // اضافه کردن variantId به cart_items
    try {
      await prisma.$executeRaw`
        ALTER TABLE "cart_items" 
        ADD COLUMN IF NOT EXISTS "variantId" TEXT;
      `;
      console.log('✅ فیلد variantId به cart_items اضافه شد');
      
      try {
        await prisma.$executeRaw`
          ALTER TABLE "cart_items" 
          ADD CONSTRAINT "cart_items_variantId_fkey" 
          FOREIGN KEY ("variantId") 
          REFERENCES "product_variants"("id") 
          ON DELETE SET NULL;
        `;
        console.log('✅ Foreign key constraint برای cart_items اضافه شد');
      } catch (error) {
        if (error.message?.includes('already exists') || error.code === '42701' || error.code === '42P16') {
          console.log('ℹ️  Foreign key constraint برای cart_items از قبل وجود دارد');
        } else {
          throw error;
        }
      }
      
      try {
        await prisma.$executeRaw`
          CREATE INDEX "cart_items_variantId_idx" 
          ON "cart_items"("variantId");
        `;
        console.log('✅ Index برای variantId در cart_items اضافه شد');
      } catch (error) {
        if (error.message?.includes('already exists') || error.code === '42P07') {
          console.log('ℹ️  Index برای variantId در cart_items از قبل وجود دارد');
        } else {
          throw error;
        }
      }
    } catch (error) {
      if (error.message?.includes('already exists') || error.code === '42701') {
        console.log('ℹ️  فیلد variantId در cart_items از قبل وجود دارد');
      } else {
        throw error;
      }
    }
    
    // اضافه کردن variantId به order_items
    try {
      await prisma.$executeRaw`
        ALTER TABLE "order_items" 
        ADD COLUMN IF NOT EXISTS "variantId" TEXT;
      `;
      console.log('✅ فیلد variantId به order_items اضافه شد');
      
      try {
        await prisma.$executeRaw`
          ALTER TABLE "order_items" 
          ADD CONSTRAINT "order_items_variantId_fkey" 
          FOREIGN KEY ("variantId") 
          REFERENCES "product_variants"("id") 
          ON DELETE SET NULL;
        `;
        console.log('✅ Foreign key constraint برای order_items اضافه شد');
      } catch (error) {
        if (error.message?.includes('already exists') || error.code === '42701' || error.code === '42P16') {
          console.log('ℹ️  Foreign key constraint برای order_items از قبل وجود دارد');
        } else {
          throw error;
        }
      }
      
      try {
        await prisma.$executeRaw`
          CREATE INDEX "order_items_variantId_idx" 
          ON "order_items"("variantId");
        `;
        console.log('✅ Index برای variantId در order_items اضافه شد');
      } catch (error) {
        if (error.message?.includes('already exists') || error.code === '42P07') {
          console.log('ℹ️  Index برای variantId در order_items از قبل وجود دارد');
        } else {
          throw error;
        }
      }
    } catch (error) {
      if (error.message?.includes('already exists') || error.code === '42701') {
        console.log('ℹ️  فیلد variantId در order_items از قبل وجود دارد');
      } else {
        throw error;
      }
    }
    
    console.log('\n✨ Migration با موفقیت انجام شد!');
    
  } catch (error) {
    console.error('❌ خطا در اجرای migration:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addVariantIdToCartItems()
  .then(() => {
    console.log('\n✨ Migration با موفقیت انجام شد!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ خطای غیرمنتظره:', error);
    process.exit(1);
  });

