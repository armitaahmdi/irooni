/**
 * Script برای ایجاد جدول product_variants
 * 
 * استفاده:
 * node scripts/create-product-variants-table.js
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

async function createProductVariantsTable() {
  try {
    console.log('🔄 در حال ایجاد جدول product_variants...');
    
    // ایجاد جدول product_variants
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "product_variants" (
        "id" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "color" TEXT NOT NULL,
        "size" TEXT NOT NULL,
        "price" INTEGER NOT NULL,
        "stock" INTEGER NOT NULL DEFAULT 0,
        "image" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
      );
    `;
    console.log('✅ جدول product_variants ایجاد شد');
    
    // ایجاد foreign key constraint
    try {
      await prisma.$executeRaw`
        ALTER TABLE "product_variants" 
        ADD CONSTRAINT "product_variants_productId_fkey" 
        FOREIGN KEY ("productId") 
        REFERENCES "products"("id") 
        ON DELETE CASCADE;
      `;
      console.log('✅ Foreign key constraint اضافه شد');
    } catch (error) {
      if (error.message?.includes('already exists') || error.code === '42701' || error.code === '42P16') {
        console.log('ℹ️  Foreign key constraint از قبل وجود دارد');
      } else {
        throw error;
      }
    }
    
    // ایجاد unique constraint برای productId + color + size
    try {
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX "product_variants_productId_color_size_key" 
        ON "product_variants"("productId", "color", "size");
      `;
      console.log('✅ Unique constraint اضافه شد');
    } catch (error) {
      if (error.message?.includes('already exists') || error.code === '42P07') {
        console.log('ℹ️  Unique constraint از قبل وجود دارد');
      } else {
        throw error;
      }
    }
    
    // ایجاد index برای productId
    try {
      await prisma.$executeRaw`
        CREATE INDEX "product_variants_productId_idx" 
        ON "product_variants"("productId");
      `;
      console.log('✅ Index برای productId اضافه شد');
    } catch (error) {
      if (error.message?.includes('already exists') || error.code === '42P07') {
        console.log('ℹ️  Index برای productId از قبل وجود دارد');
      } else {
        throw error;
      }
    }
    
    // ایجاد index برای stock
    try {
      await prisma.$executeRaw`
        CREATE INDEX "product_variants_stock_idx" 
        ON "product_variants"("stock");
      `;
      console.log('✅ Index برای stock اضافه شد');
    } catch (error) {
      if (error.message?.includes('already exists') || error.code === '42P07') {
        console.log('ℹ️  Index برای stock از قبل وجود دارد');
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

createProductVariantsTable()
  .then(() => {
    console.log('\n✨ Migration با موفقیت انجام شد!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ خطای غیرمنتظره:', error);
    process.exit(1);
  });

