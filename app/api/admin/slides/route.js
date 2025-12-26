import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET - دریافت لیست بنرها
export async function GET() {
  try {
    await requireAdmin();

    // بررسی وجود مدل heroSlide
    if (!prisma.heroSlide) {
      console.error("Prisma heroSlide model not found. Available models:", Object.keys(prisma).filter(key => !key.startsWith('_') && !key.startsWith('$')));
      return NextResponse.json(
        { 
          error: "مدل HeroSlide در Prisma Client یافت نشد. لطفاً 'npx prisma generate' را اجرا کنید و سرور را restart کنید.",
        },
        { status: 500 }
      );
    }

    const slides = await prisma.heroSlide.findMany({
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      data: slides,
    });
  } catch (error) {
    console.error("Error fetching slides:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { 
        error: "خطا در دریافت بنرها",
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// POST - ایجاد بنر جدید
export async function POST(request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { image, imageMobile, alt, link, overlay, order, isActive } = body;

    // اعتبارسنجی
    if (!image || !imageMobile || !alt) {
      return NextResponse.json(
        { error: "تصویر دسکتاپ، تصویر موبایل و متن alt الزامی است" },
        { status: 400 }
      );
    }

    // بررسی وجود مدل heroSlide
    if (!prisma.heroSlide) {
      return NextResponse.json(
        { 
          error: "مدل HeroSlide در Prisma Client یافت نشد. لطفاً 'npx prisma generate' را اجرا کنید و سرور را restart کنید.",
        },
        { status: 500 }
      );
    }

    const slide = await prisma.heroSlide.create({
      data: {
        image,
        imageMobile,
        alt,
        link: link || null,
        overlay: overlay !== undefined ? overlay : true,
        order: order !== undefined ? order : 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      success: true,
      data: slide,
    });
  } catch (error) {
    console.error("Error creating slide:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد بنر" },
      { status: 500 }
    );
  }
}

