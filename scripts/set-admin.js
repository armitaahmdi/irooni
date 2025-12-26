const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setAdmin() {
  try {
    console.log('در حال تنظیم نقش admin برای شماره 09198718211...');
    
    const user = await prisma.user.update({
      where: { phone: '09198718211' },
      data: { role: 'admin' },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        role: true,
      },
    });
    
    console.log('✅ نقش admin با موفقیت تنظیم شد!');
    console.log('کاربر:', user);
  } catch (error) {
    console.error('❌ خطا:', error.message);
    if (error.code === 'P2025') {
      console.error('کاربر با این شماره یافت نشد');
    }
  } finally {
    await prisma.$disconnect();
  }
}

setAdmin();

