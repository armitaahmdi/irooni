import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET - دریافت لیست مقالات
export async function GET(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const skip = (page - 1) * limit;

    // ساخت where clause
    const where = {};

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
    let articles, total;
    try {
      [articles, total] = await Promise.all([
        prisma.article.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.article.count({ where }),
      ]);
    } catch (dbError) {
      // اگر خطا مربوط به جدول یا مدل باشد
      if (dbError.message?.includes("Unknown arg `article`") || 
          dbError.message?.includes("model Article") ||
          dbError.message?.includes("Cannot read property 'article'")) {
        throw new Error("مدل Article در Prisma Client موجود نیست. لطفاً 'npx prisma generate' را اجرا کنید.");
      }
      throw dbError;
    }

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
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack?.substring(0, 500),
    });
    
    // بررسی نوع خطا
    let errorMessage = "خطا در دریافت مقالات";
    let statusCode = 500;
    
    if (error.code === "P2001" || 
        error.message?.includes("does not exist") || 
        (error.message?.includes("relation") && error.message?.includes("does not exist")) ||
        error.code === "P2021") {
      errorMessage = "جدول مقالات وجود ندارد. لطفاً دستور 'npx prisma db push' را اجرا کنید.";
      statusCode = 503;
    } else if (error.code === "P1001" || 
               error.message?.includes("connect") ||
               error.message?.includes("connection") ||
               error.message?.includes("ECONNREFUSED")) {
      errorMessage = "خطا در اتصال به دیتابیس. لطفاً اتصال دیتابیس را بررسی کنید.";
      statusCode = 503;
    } else if (error.message?.includes("Unknown model") || 
               error.message?.includes("article")) {
      errorMessage = "مدل مقالات در دسترس نیست. لطفاً 'npx prisma generate' را اجرا کنید.";
      statusCode = 503;
    } else if (error.message?.includes("Unauthorized")) {
      errorMessage = "دسترسی غیرمجاز";
      statusCode = 401;
    } else if (error.message) {
      errorMessage = `خطا: ${error.message.substring(0, 200)}`;
    }
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        ...(process.env.NODE_ENV === "development" && {
          details: {
            message: error.message,
            code: error.code,
            meta: error.meta,
          },
        }),
      },
      { status: statusCode }
    );
  }
}

// POST - ایجاد مقاله جدید
export async function POST(request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { title, slug, image, content, excerpt, category, isPublished } = body;

    // بررسی اینکه slug یکتا باشد
    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: "اسلاگ الزامی است",
        },
        { status: 400 }
      );
    }

    // بررسی تکراری نبودن slug
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      return NextResponse.json(
        {
          success: false,
          error: "مقاله‌ای با این اسلاگ وجود دارد",
        },
        { status: 400 }
      );
    }

    // ایجاد مقاله جدید
    const article = await prisma.article.create({
      data: {
        title: title || null,
        slug,
        image: image || null,
        content: content || null,
        excerpt: excerpt || null,
        category: category || null,
        isPublished: isPublished ?? false,
      },
    });

    // Revalidate cache for articles API
    revalidatePath('/api/articles');

    return NextResponse.json({
      success: true,
      data: article,
      message: "مقاله با موفقیت ایجاد شد",
    });
  } catch (error) {
    console.error("Error creating article:", error);
    
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
        error: error.message || "خطا در ایجاد مقاله",
      },
      { status: error.message?.includes("Unauthorized") ? 401 : 500 }
    );
  }
}

