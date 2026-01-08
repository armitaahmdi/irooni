/**
 * Migration Script: ایجاد دسته‌بندی‌ها و به‌روزرسانی محصولات
 * 
 * این اسکریپت:
 * 1. دسته‌بندی‌ها و زیردسته‌ها را از data/categories.js می‌خواند
 * 2. آن‌ها را در دیتابیس ایجاد می‌کند
 * 3. محصولات موجود را به‌روزرسانی می‌کند تا از categoryId و subcategoryId استفاده کنند
 * 4. slug برای محصولات ایجاد می‌کند
 */

// Load environment variables
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { productCategories } = require("../data/categories");

// استفاده از PrismaClient با adapter (مثل lib/prisma.js)
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// بررسی DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables!");
  console.error("Please make sure .env file exists and contains DATABASE_URL");
  process.exit(1);
}

// ایجاد Pool برای PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ایجاد adapter
const adapter = new PrismaPg(pool);

// ایجاد Prisma Client instance
const prisma = new PrismaClient({
  adapter: adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// تابع برای ایجاد slug از نام محصول
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\w\s-]/g, "") // حذف کاراکترهای خاص
    .replace(/\s+/g, "-") // جایگزینی فاصله با خط تیره
    .replace(/-+/g, "-") // حذف خط تیره‌های تکراری
    .trim();
}

// تابع برای ایجاد slug یکتا
async function createUniqueSlug(baseSlug, checkFunction) {
  let slug = baseSlug;
  let counter = 1;
  
  while (await checkFunction(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

async function migrateCategories() {
  try {
    console.log("🚀 شروع migration دسته‌بندی‌ها...\n");

    // 1. ایجاد دسته‌بندی‌های اصلی
    const categoryMap = new Map();
    
    for (const cat of productCategories) {
      console.log(`📁 ایجاد دسته: ${cat.name} (${cat.slug})`);
      
      // بررسی اینکه آیا دسته قبلاً وجود دارد
      let category = await prisma.category.findUnique({
        where: { slug: cat.slug },
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            title: cat.name,
            slug: cat.slug,
            parentId: null,
          },
        });
        console.log(`   ✅ دسته ایجاد شد: ${category.id}`);
      } else {
        console.log(`   ℹ️  دسته از قبل وجود دارد: ${category.id}`);
      }

      categoryMap.set(cat.slug, category);

      // 2. ایجاد زیردسته‌ها
      for (const subcat of cat.subcategories || []) {
        console.log(`   📂 ایجاد زیردسته: ${subcat.name} (${subcat.slug})`);
        
        // ساخت slug کامل برای subcategory
        const subcategorySlug = `${cat.slug}-${subcat.slug}`;
        
        let subcategory = await prisma.category.findUnique({
          where: { slug: subcategorySlug },
        });

        if (!subcategory) {
          subcategory = await prisma.category.create({
            data: {
              title: subcat.name,
              slug: subcategorySlug,
              parentId: category.id,
            },
          });
          console.log(`      ✅ زیردسته ایجاد شد: ${subcategory.id}`);
        } else {
          console.log(`      ℹ️  زیردسته از قبل وجود دارد: ${subcategory.id}`);
        }

        categoryMap.set(subcategorySlug, subcategory);
      }
    }

    console.log("\n🔄 به‌روزرسانی محصولات...\n");

    // 3. به‌روزرسانی محصولات
    // دریافت همه محصولات (برای اطمینان از اینکه همه slug دارند)
    const allProducts = await prisma.product.findMany();
    console.log(`📦 تعداد کل محصولات: ${allProducts.length}\n`);

    // فیلتر کردن محصولاتی که نیاز به به‌روزرسانی دارند
    const products = allProducts.filter(p => !p.categoryId || !p.slug);
    console.log(`📦 تعداد محصولات برای به‌روزرسانی: ${products.length}\n`);

    for (const product of products) {
      try {
        // پیدا کردن category بر اساس category slug قدیمی
        let category = null;
        let subcategory = null;

        // استفاده از فیلدهای legacy برای migration
        const categorySlug = product.categoryLegacy || product.category;
        const subcategorySlugValue = product.subcategoryLegacy || product.subcategory;

        if (categorySlug) {
          category = categoryMap.get(categorySlug);
          
          if (!category) {
            console.log(`   ⚠️  دسته "${categorySlug}" برای محصول "${product.name}" یافت نشد`);
            continue;
          }
        }

        if (subcategorySlugValue && category) {
          // ساخت slug کامل برای subcategory
          const fullSubcategorySlug = `${categorySlug}-${subcategorySlugValue}`;
          subcategory = categoryMap.get(fullSubcategorySlug);
          
          if (!subcategory) {
            console.log(`   ⚠️  زیردسته "${fullSubcategorySlug}" برای محصول "${product.name}" یافت نشد`);
          }
        }

        // ایجاد slug برای محصول
        let productSlug = product.slug;
        if (!productSlug) {
          const baseSlug = createSlug(product.name);
          productSlug = await createUniqueSlug(
            baseSlug,
            async (slug) => {
              const existing = await prisma.product.findUnique({
                where: { slug },
              });
              return !!existing;
            }
          );
        }

        // به‌روزرسانی محصول
        const updateData = {
          slug: productSlug,
        };

        if (category) {
          updateData.categoryId = category.id;
        }

        if (subcategory) {
          updateData.subcategoryId = subcategory.id;
        }

        await prisma.product.update({
          where: { id: product.id },
          data: updateData,
        });

        console.log(`   ✅ محصول به‌روزرسانی شد: ${product.name} (slug: ${productSlug})`);
      } catch (error) {
        console.error(`   ❌ خطا در به‌روزرسانی محصول "${product.name}":`, error.message);
      }
    }

    console.log("\n✅ Migration با موفقیت انجام شد!");
  } catch (error) {
    console.error("❌ خطا در migration:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// اجرای migration
if (require.main === module) {
  migrateCategories()
    .then(() => {
      console.log("\n🎉 تمام!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 خطا:", error);
      process.exit(1);
    });
}

module.exports = { migrateCategories };

