import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET - دریافت یک بنر
export async function GET(request, { params }) {
  try {
    await requireAdmin();

    const { id } = params;

    const slide = await prisma.heroSlide.findUnique({
      where: { id },
    });

    if (!slide) {
      return NextResponse.json(
        { error: "بنر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: slide,
    });
  } catch (error) {
    console.error("Error fetching slide:", error);
    return NextResponse.json(
      { error: "خطا در دریافت بنر" },
      { status: 500 }
    );
  }
}

// PUT - به‌روزرسانی بنر
export async function PUT(request, { params }) {
  try {
    await requireAdmin();

    const { id } = params;
    const body = await request.json();
    const { image, imageMobile, alt, link, overlay, order, isActive } = body;

    // بررسی وجود بنر
    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id },
    });

    if (!existingSlide) {
      return NextResponse.json(
        { error: "بنر یافت نشد" },
        { status: 404 }
      );
    }

    // اعتبارسنجی
    if (!image || !imageMobile || !alt) {
      return NextResponse.json(
        { error: "تصویر دسکتاپ، تصویر موبایل و متن alt الزامی است" },
        { status: 400 }
      );
    }

    const slide = await prisma.heroSlide.update({
      where: { id },
      data: {
        image,
        imageMobile,
        alt,
        link: link || null,
        overlay: overlay !== undefined ? overlay : existingSlide.overlay,
        order: order !== undefined ? order : existingSlide.order,
        isActive: isActive !== undefined ? isActive : existingSlide.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      data: slide,
    });
  } catch (error) {
    console.error("Error updating slide:", error);
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی بنر" },
      { status: 500 }
    );
  }
}

// DELETE - حذف بنر
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();

    const { id } = params;

    const slide = await prisma.heroSlide.findUnique({
      where: { id },
    });

    if (!slide) {
      return NextResponse.json(
        { error: "بنر یافت نشد" },
        { status: 404 }
      );
    }

    await prisma.heroSlide.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "بنر با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting slide:", error);
    return NextResponse.json(
      { error: "خطا در حذف بنر" },
      { status: 500 }
    );
  }
}

