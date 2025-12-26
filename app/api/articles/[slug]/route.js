import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - دریافت یک مقاله بر اساس slug (عمومی)
export async function GET(request, { params }) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { slug } = resolvedParams;

    const article = await prisma.article.findUnique({
      where: { slug },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: "مقاله یافت نشد" },
        { status: 404 }
      );
    }

    // اگر مقاله منتشر نشده باشد، نمایش داده نمی‌شود
    if (!article.isPublished) {
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
    return NextResponse.json(
      { success: false, error: "خطا در دریافت مقاله" },
      { status: 500 }
    );
  }
}

