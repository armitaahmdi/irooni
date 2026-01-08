import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - دریافت لیست آدرس‌های کاربر
export async function GET() {
  try {
    const session = await auth();
    console.log("[Addresses API] Session:", session?.user?.id ? "exists" : "missing");
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    console.log("[Addresses API] Fetching addresses for user:", session.user.id);
    
    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: "desc" }, // آدرس پیش‌فرض اول
        { createdAt: "desc" },
      ],
    });

    console.log("[Addresses API] Found", addresses.length, "addresses");

    return NextResponse.json({
      success: true,
      data: addresses || [],
    });
  } catch (error) {
    console.error("[Addresses API] Error fetching addresses:", error);
    console.error("[Addresses API] Error code:", error.code);
    console.error("[Addresses API] Error message:", error.message);
    console.error("[Addresses API] Error stack:", error.stack);
    
    // اگر خطای دیتابیس است (مثلاً جدول وجود ندارد)، آرایه خالی برگردان
    if (error.code === "P2021" || 
        error.code === "P2001" ||
        error.message?.includes("does not exist") ||
        error.message?.includes("Unknown model") ||
        error.message?.includes("address")) {
      console.log("[Addresses API] Address table/model issue, returning empty array");
      return NextResponse.json({
        success: true,
        data: [],
      });
    }
    
    // برای سایر خطاها، جزئیات را در development نمایش بده
    return NextResponse.json(
      { 
        success: false,
        error: "خطا در دریافت آدرس‌ها",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// POST - ایجاد آدرس جدید
export async function POST(request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      province,
      city,
      address,
      plaque,
      unit,
      postalCode,
      latitude,
      longitude,
      isDefault,
    } = body;

    // اعتبارسنجی فیلدهای الزامی
    if (!title || !province || !city || !address) {
      return NextResponse.json(
        { error: "فیلدهای عنوان، استان، شهر و آدرس الزامی هستند" },
        { status: 400 }
      );
    }

    // اگر این آدرس به عنوان پیش‌فرض تنظیم شود، بقیه را غیرفعال کن
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    // ایجاد آدرس جدید
    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        title,
        province,
        city,
        address,
        plaque: plaque || null,
        unit: unit || null,
        postalCode: postalCode || null,
        latitude: latitude || null,
        longitude: longitude || null,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "آدرس با موفقیت اضافه شد",
      data: newAddress,
    }, { status: 201 });
  } catch (error) {
    console.error("[Addresses API] Error creating address:", error);
    console.error("[Addresses API] Error code:", error.code);
    console.error("[Addresses API] Error message:", error.message);
    
    // اگر خطای دیتابیس است، جزئیات را نمایش بده
    if (error.code === "P2021" || 
        error.code === "P2001" ||
        error.message?.includes("does not exist") ||
        error.message?.includes("Unknown model")) {
      return NextResponse.json(
        { 
          error: "جدول آدرس در دیتابیس وجود ندارد. لطفاً `npm run db:push` را اجرا کنید.",
          details: process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "خطا در ایجاد آدرس",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}


