import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET - دریافت لیست نظرات (برای ادمین)
export async function GET(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status"); // "approved", "pending", "all"
    const search = searchParams.get("search");
    const includeUnapproved = searchParams.get("includeUnapproved") === "true";

    const skip = (page - 1) * limit;

    const where = {};

    if (status === "approved") {
      where.isApproved = true;
    } else if (status === "pending") {
      where.isApproved = false;
    }
    // اگر status === "all" یا undefined باشد، همه نظرات را نشان می‌دهیم

    if (search) {
      where.OR = [
        { comment: { contains: search, mode: "insensitive" } },
        { product: { name: { contains: search, mode: "insensitive" } } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت نظرات" },
      { status: 500 }
    );
  }
}

