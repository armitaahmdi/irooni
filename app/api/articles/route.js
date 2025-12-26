import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - دریافت لیست مقالات منتشر شده (عمومی)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const skip = (page - 1) * limit;

    // ساخت where clause - فقط مقالات منتشر شده
    const where = {
      isPublished: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    // دریافت مقالات
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در دریافت مقالات",
      },
      { status: 500 }
    );
  }
}

