/**
 * Script برای تبدیل داده‌های موجود از sizeStock به ProductVariant
 * 
 * این script:
 * 1. همه محصولات را می‌خواند
 * 2. برای هر محصول، sizeStock را بررسی می‌کند
 * 3. اگر sizeStock وجود دارد، برای هر ترکیب سایز+رنگ یک variant ایجاد می‌کند
 * 4. موجودی را از sizeStock به variant.stock منتقل می‌کند
 * 
 * استفاده:
 * node scripts/migrate-sizeStock-to-variants.js
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

async function migrateSizeStockToVariants() {
  try {
    console.log('🔄 شروع migration از sizeStock به ProductVariant...\n');
    
    // دریافت همه محصولات
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { sizeStock: { not: null } },
          { sizes: { isEmpty: false } },
          { colors: { isEmpty: false } },
        ],
      },
      select: {
        id: true,
        name: true,
        code: true,
        price: true,
        sizes: true,
        colors: true,
        sizeStock: true,
      },
    });
    
    console.log(`📦 تعداد محصولات پیدا شده: ${products.length}\n`);
    
    let totalVariantsCreated = 0;
    let productsProcessed = 0;
    let productsSkipped = 0;
    
    for (const product of products) {
      try {
        console.log(`\n🔍 پردازش محصول: ${product.name} (${product.code})`);
        
        // بررسی اینکه آیا variantهای این محصول از قبل وجود دارند
        const existingVariants = await prisma.productVariant.findMany({
          where: { productId: product.id },
        });
        
        if (existingVariants.length > 0) {
          console.log(`   ⏭️  این محصول قبلاً variant دارد (${existingVariants.length} variant). رد می‌شود.`);
          productsSkipped++;
          continue;
        }
        
        // اگر sizeStock وجود دارد، از آن استفاده کن
        if (product.sizeStock) {
          let sizeStockObj = product.sizeStock;
          
          // اگر sizeStock یک string است، parse کن
          if (typeof sizeStockObj === 'string') {
            try {
              sizeStockObj = JSON.parse(sizeStockObj);
            } catch (e) {
              console.log(`   ⚠️  خطا در parse کردن sizeStock: ${e.message}`);
              productsSkipped++;
              continue;
            }
          }
          
          // اگر sizeStock یک object است
          if (sizeStockObj && typeof sizeStockObj === 'object') {
            const variantsToCreate = [];
            
            // بررسی ساختار جدید: {"S": {"قرمز": 3, "آبی": 2}}
            for (const [size, sizeData] of Object.entries(sizeStockObj)) {
              if (sizeData && typeof sizeData === 'object') {
                // ساختار جدید: هر رنگ یک موجودی دارد
                for (const [color, stock] of Object.entries(sizeData)) {
                  if (typeof stock === 'number' && stock >= 0) {
                    variantsToCreate.push({
                      productId: product.id,
                      color: color,
                      size: size,
                      price: product.price,
                      stock: stock,
                      image: null,
                    });
                  }
                }
              }
              // ساختار قدیمی: {"S": 5} - برای هر رنگ از محصول، همان موجودی را استفاده کن
              else if (typeof sizeData === 'number' && sizeData >= 0) {
                // اگر محصول رنگ دارد، برای هر رنگ یک variant ایجاد کن
                if (product.colors && product.colors.length > 0) {
                  for (const color of product.colors) {
                    variantsToCreate.push({
                      productId: product.id,
                      color: color,
                      size: size,
                      price: product.price,
                      stock: sizeData,
                      image: null,
                    });
                  }
                } else {
                  // اگر رنگ ندارد، فقط یک variant با رنگ null ایجاد کن
                  variantsToCreate.push({
                    productId: product.id,
                    color: null,
                    size: size,
                    price: product.price,
                    stock: sizeData,
                    image: null,
                  });
                }
              }
            }
            
            // ایجاد variantها
            if (variantsToCreate.length > 0) {
              // حذف duplicate ها (اگر یک variant با همان سایز و رنگ وجود دارد)
              const uniqueVariants = [];
              const seen = new Set();
              
              for (const variant of variantsToCreate) {
                const key = `${variant.size}-${variant.color || 'null'}`;
                if (!seen.has(key)) {
                  seen.add(key);
                  uniqueVariants.push(variant);
                }
              }
              
              // ایجاد variantها در دیتابیس
              for (const variant of uniqueVariants) {
                try {
                  await prisma.productVariant.create({
                    data: variant,
                  });
                  totalVariantsCreated++;
                } catch (error) {
                  // اگر variant از قبل وجود دارد (unique constraint)، رد کن
                  if (error.code === 'P2002') {
                    console.log(`   ⚠️  Variant ${variant.size}-${variant.color} از قبل وجود دارد.`);
                  } else {
                    throw error;
                  }
                }
              }
              
              console.log(`   ✅ ${uniqueVariants.length} variant ایجاد شد`);
              productsProcessed++;
            } else {
              console.log(`   ⏭️  هیچ variant قابل ایجاد نیست.`);
              productsSkipped++;
            }
          } else {
            console.log(`   ⏭️  sizeStock معتبر نیست.`);
            productsSkipped++;
          }
        }
        // اگر sizeStock وجود ندارد اما sizes و colors وجود دارند
        else if (product.sizes && product.sizes.length > 0 && product.colors && product.colors.length > 0) {
          // برای هر ترکیب سایز+رنگ یک variant با موجودی 0 ایجاد کن
          const variantsToCreate = [];
          
          for (const size of product.sizes) {
            for (const color of product.colors) {
              variantsToCreate.push({
                productId: product.id,
                color: color,
                size: size,
                price: product.price,
                stock: 0,
                image: null,
              });
            }
          }
          
          // ایجاد variantها
          for (const variant of variantsToCreate) {
            try {
              await prisma.productVariant.create({
                data: variant,
              });
              totalVariantsCreated++;
            } catch (error) {
              if (error.code === 'P2002') {
                console.log(`   ⚠️  Variant ${variant.size}-${variant.color} از قبل وجود دارد.`);
              } else {
                throw error;
              }
            }
          }
          
          console.log(`   ✅ ${variantsToCreate.length} variant با موجودی 0 ایجاد شد`);
          productsProcessed++;
        } else {
          console.log(`   ⏭️  هیچ sizeStock، sizes یا colors وجود ندارد.`);
          productsSkipped++;
        }
      } catch (error) {
        console.error(`   ❌ خطا در پردازش محصول ${product.name}:`, error.message);
        productsSkipped++;
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✨ Migration با موفقیت انجام شد!');
    console.log('='.repeat(50));
    console.log(`📊 آمار:`);
    console.log(`   - محصولات پردازش شده: ${productsProcessed}`);
    console.log(`   - محصولات رد شده: ${productsSkipped}`);
    console.log(`   - کل variantهای ایجاد شده: ${totalVariantsCreated}`);
    console.log('='.repeat(50) + '\n');
    
  } catch (error) {
    console.error('❌ خطا در اجرای migration:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateSizeStockToVariants()
  .then(() => {
    console.log('✨ Migration با موفقیت انجام شد!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ خطای غیرمنتظره:', error);
    process.exit(1);
  });

