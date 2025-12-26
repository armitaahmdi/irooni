import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET - دریافت یک مقاله
export async function GET(request, { params }) {
  try {
    await requireAdmin();

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: "مقاله یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Error fetching article:", error);

    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: "خطا در دریافت مقاله" },
      { status: 500 }
    );
  }
}

// PUT - به‌روزرسانی مقاله
export async function PUT(request, { params }) {
  try {
    await requireAdmin();

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const body = await request.json();

    const { title, slug, image, content, excerpt, category, isPublished } = body;

    // بررسی وجود مقاله
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: "مقاله یافت نشد" },
        { status: 404 }
      );
    }

    // اگر slug تغییر کرده باشد، بررسی تکراری نبودن
    if (slug && slug !== existingArticle.slug) {
      const slugExists = await prisma.article.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          {
            success: false,
            error: "مقاله‌ای با این اسلاگ وجود دارد",
          },
          { status: 400 }
        );
      }
    }

    // آماده‌سازی داده‌های به‌روزرسانی
    const updateData = {};

    if (title !== undefined) updateData.title = title || null;
    if (slug !== undefined) updateData.slug = slug;
    if (image !== undefined) updateData.image = image || null;
    if (content !== undefined) updateData.content = content || null;
    if (excerpt !== undefined) updateData.excerpt = excerpt || null;
    if (category !== undefined) updateData.category = category || null;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    // به‌روزرسانی مقاله
    const article = await prisma.article.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "مقاله با موفقیت به‌روزرسانی شد",
      data: article,
    });
  } catch (error) {
    console.error("Error updating article:", error);

    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "مقاله‌ای با این اسلاگ وجود دارد",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "خطا در به‌روزرسانی مقاله",
      },
      { status: 500 }
    );
  }
}

// DELETE - حذف مقاله
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    // بررسی وجود مقاله
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: "مقاله یافت نشد" },
        { status: 404 }
      );
    }

    // حذف مقاله
    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "مقاله با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting article:", error);

    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "خطا در حذف مقاله",
      },
      { status: 500 }
    );
  }
}

