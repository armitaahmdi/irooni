const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // بررسی اینکه آیا محصول تستی از قبل وجود دارد
  const existingProduct = await prisma.product.findUnique({
    where: { code: 'TEST-PRODUCT-001' },
  });

  if (existingProduct) {
    console.log('✅ Test product already exists, skipping seed');
    return;
  }

  // ایجاد یک محصول تستی حداقلی
  try {
    const testProduct = await prisma.product.create({
      data: {
        name: 'محصول تستی',
        slug: 'test-product',
        code: 'TEST-PRODUCT-001',
        image: '/logo/main-logo.png', // استفاده از لوگو موجود
        images: ['/logo/main-logo.png'],
        price: 100000, // 100,000 تومان
        isVisible: true,
        inStock: true,
        sizes: ['S', 'M', 'L'],
        colors: ['سفید', 'مشکی'],
        stock: 10,
        description: 'این یک محصول تستی است که برای اطمینان از کارکرد صحیح سیستم ایجاد شده است.',
        features: ['تست', 'محصول نمونه'],
      },
    });

    console.log('✅ Test product created successfully:', testProduct.id);
  } catch (error) {
    console.error('❌ Error creating test product:', error);
    // اگر خطا رخ داد، seed را متوقف نکن - فقط warning بده
    console.warn('⚠️ Continuing seed process despite error...');
  }

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

