import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - دریافت یک آدرس
export async function GET(request, { params }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      return NextResponse.json(
        { error: "آدرس یافت نشد" },
        { status: 404 }
      );
    }

    // بررسی اینکه آدرس متعلق به کاربر فعلی است
    if (address.userId !== session.user.id) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.error("Error fetching address:", error);
    return NextResponse.json(
      { error: "خطا در دریافت آدرس" },
      { status: 500 }
    );
  }
}

// PUT - به‌روزرسانی آدرس
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
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

    // بررسی وجود آدرس
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "آدرس یافت نشد" },
        { status: 404 }
      );
    }

    // بررسی اینکه آدرس متعلق به کاربر فعلی است
    if (existingAddress.userId !== session.user.id) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    // اگر این آدرس به عنوان پیش‌فرض تنظیم شود، بقیه را غیرفعال کن
    if (isDefault && !existingAddress.isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: session.user.id,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    // به‌روزرسانی آدرس
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (province !== undefined) updateData.province = province;
    if (city !== undefined) updateData.city = city;
    if (address !== undefined) updateData.address = address;
    if (plaque !== undefined) updateData.plaque = plaque || null;
    if (unit !== undefined) updateData.unit = unit || null;
    if (postalCode !== undefined) updateData.postalCode = postalCode || null;
    if (latitude !== undefined) updateData.latitude = latitude || null;
    if (longitude !== undefined) updateData.longitude = longitude || null;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "آدرس با موفقیت به‌روزرسانی شد",
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی آدرس" },
      { status: 500 }
    );
  }
}

// DELETE - حذف آدرس
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    // بررسی وجود آدرس
    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      return NextResponse.json(
        { error: "آدرس یافت نشد" },
        { status: 404 }
      );
    }

    // بررسی اینکه آدرس متعلق به کاربر فعلی است
    if (address.userId !== session.user.id) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    // حذف آدرس
    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "آدرس با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "خطا در حذف آدرس" },
      { status: 500 }
    );
  }
}


