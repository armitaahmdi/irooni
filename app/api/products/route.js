import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeSubcategory, normalizeCategory, getSubcategoryNameBySlug } from "@/utils/subcategoryHelper";

// GET - دریافت لیست محصولات برای کاربران عادی
export async function GET(request) {
  try {
    // بررسی اینکه prisma به درستی initialize شده است
    if (!prisma) {
      console.error("Prisma client is not initialized");
      return NextResponse.json(
        { 
          success: false,
          error: "خطا در اتصال به دیتابیس. لطفاً سرور را restart کنید."
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const search = searchParams.get("search");
    const inStock = searchParams.get("inStock");
    const onSale = searchParams.get("onSale");
    const size = searchParams.get("size");
    const color = searchParams.get("color");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "newest";

    const skip = (page - 1) * limit;

    // ساخت where clause
    const where = {
      isVisible: true, // فقط محصولات visible برای کاربران
    };
    
    if (category) {
      // پیدا کردن category بر اساس slug
      const categoryRecord = await prisma.category.findUnique({
        where: { slug: category },
      });

      if (categoryRecord) {
        // استفاده از ساختار جدید با categoryId
        if (subcategory && subcategory.trim() !== "") {
          // پیدا کردن subcategory بر اساس slug کامل
          const subcategorySlug = `${category}-${subcategory}`;
          const subcategoryRecord = await prisma.category.findUnique({
            where: { slug: subcategorySlug },
          });

          if (subcategoryRecord) {
            // فقط محصولات این subcategory
            where.subcategoryId = subcategoryRecord.id;
          } else {
            console.warn(`[API] Subcategory not found: ${subcategorySlug}`);
          }
        } else {
          // همه محصولات category + subcategories
          where.categoryId = categoryRecord.id;
        }
      } else {
        // Fallback به ساختار قدیمی برای backward compatibility
        console.warn(`[API] Category not found by slug: ${category}, using legacy structure`);
        const normalizedCategory = normalizeCategory(category);
        where.category = normalizedCategory || category;
        
        if (subcategory && subcategory.trim() !== "") {
          try {
            const normalizedSubcategory = normalizeSubcategory(where.category, subcategory);
            where.subcategory = normalizedSubcategory;
          } catch (error) {
            console.error("Error normalizing subcategory:", error);
            where.subcategory = subcategory;
          }
        }
      }
    } else if (subcategory) {
      // اگر فقط subcategory داده شده، سعی می‌کنیم آن را پیدا کنیم
      const subcategoryRecord = await prisma.category.findFirst({
        where: { 
          slug: { contains: subcategory },
          parentId: { not: null },
        },
      });

      if (subcategoryRecord) {
        where.subcategoryId = subcategoryRecord.id;
      } else {
        // Fallback
        where.subcategory = subcategory;
      }
    }

    // Handle search separately to avoid conflicts
    if (search) {
      const searchConditions = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
      
      if (where.OR) {
        // If OR already exists (from subcategory), combine with AND
        const existingOR = where.OR;
        where.AND = [
          { OR: existingOR },
          { OR: searchConditions },
        ];
        delete where.OR;
      } else if (where.AND) {
        // If AND already exists, add search OR to it
        where.AND.push({ OR: searchConditions });
      } else {
        // No existing OR/AND, create new OR for search
        where.OR = searchConditions;
      }
    }

    console.log(`[API] Fetching products with where:`, JSON.stringify(where, null, 2));
    
    if (inStock === "true") {
      where.inStock = true;
    }
    
    if (onSale === "true") {
      where.discountPercent = { gt: 0 };
    }
    
    if (size) {
      where.sizes = { has: size };
    }
    
    if (color) {
      where.colors = { has: color };
    }
    
    // محاسبه قیمت نهایی برای فیلتر قیمت
    if (minPrice || maxPrice) {
      // این فیلتر پیچیده است، باید در application level انجام شود
      // برای سادگی، فعلاً فقط price اصلی را چک می‌کنیم
      if (minPrice) {
        where.price = { gte: parseInt(minPrice) };
      }
      if (maxPrice) {
        where.price = { ...where.price, lte: parseInt(maxPrice) };
      }
    }

    // تعیین ترتیب
    let orderBy = {};
    switch (sortBy) {
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // بررسی وجود prisma.product قبل از استفاده
    if (!prisma.product) {
      console.error("Prisma product model is not available");
      console.error("Prisma instance:", {
        exists: !!prisma,
        type: typeof prisma,
        keys: prisma ? Object.keys(prisma).slice(0, 10) : [],
      });
      return NextResponse.json(
        { 
          success: false,
          error: "مدل محصولات در دسترس نیست. لطفاً دستور 'npx prisma generate' را اجرا کنید و سرور را restart کنید."
        },
        { status: 500 }
      );
    }

    // دریافت محصولات
    let products, total;
    try {
      // Try to query with relations, but handle if they don't exist
    try {
      // Optimized query: only select needed fields for better performance
      [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          select: {
            id: true,
            name: true,
            slug: true,
            code: true,
            image: true,
            images: true,
            price: true,
            discountPercent: true,
            stock: true,
            sizeStock: true,
            sizes: true,
            colors: true,
            inStock: true,
            material: true,
            description: true,
            features: true,
            sizeChart: true,
            category: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
            subcategory: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
            categoryLegacy: true,
            subcategoryLegacy: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.product.count({ where }),
      ]);
      } catch (relationError) {
        // If relations don't exist, try without them
        if (relationError.message?.includes('Unknown argument') || 
            relationError.message?.includes('include') ||
            relationError.code === 'P2009') {
          console.warn('[API] Relations not available, querying without relations');
          [products, total] = await Promise.all([
            prisma.product.findMany({
              where,
              skip,
              take: limit,
              orderBy,
            }),
            prisma.product.count({ where }),
          ]);
        } else {
          throw relationError;
        }
      }

      console.log(`[API] Query result: Found ${products.length} products, total: ${total}`);
      if (products.length > 0) {
        console.log(`[API] Sample products:`, products.slice(0, 3).map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          subcategory: p.subcategory,
        })));
      } else {
        console.warn(`[API] ⚠️ No products found!`, {
          category,
          subcategory,
          whereClause: JSON.stringify(where, null, 2),
        });
        
        // Debug: Try to find products with just category
        if (category) {
          const categoryOnlyCount = await prisma.product.count({
            where: { category },
          });
          console.log(`[API] Debug: Found ${categoryOnlyCount} products with category "${category}" (without subcategory filter)`);
        }
      }
      
      // اگر محصولی یافت نشد، آرایه خالی برمی‌گردانیم (نه خطا)
      if (!products) {
        products = [];
      }
      if (total === null || total === undefined) {
        total = 0;
      }
    } catch (dbError) {
      console.error("Database query error:", dbError);
      console.error("Error stack:", dbError.stack);
      console.error("Error details:", {
        message: dbError.message,
        code: dbError.code,
        meta: dbError.meta,
      });
      throw dbError;
    }

    // تبدیل محصولات به فرمت مورد نیاز (محاسبه قیمت نهایی با تخفیف)
    const formattedProducts = products.map((product) => {
      const finalPrice = product.discountPercent
        ? Math.round(product.price * (1 - product.discountPercent / 100))
        : product.price;
      
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        code: product.code,
        category: product.category?.slug || product.category || null,
        subcategory: product.subcategory?.slug || product.subcategory || null,
        image: product.image,
        images: product.images,
        price: finalPrice,
        originalPrice: product.discountPercent ? product.price : null,
        discountPercent: product.discountPercent,
        sizes: product.sizes,
        colors: product.colors,
        stock: product.stock,
        inStock: product.inStock,
        material: product.material,
        description: product.description,
        features: product.features,
        sizeChart: product.sizeChart,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[Products API] Error fetching products:", error);
    console.error("[Products API] Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack?.substring(0, 500), // Limit stack trace length
    });
    
    // بررسی نوع خطا
    let errorMessage = "خطا در دریافت محصولات";
    let statusCode = 500;
    
    if (error.code === "P2001" || 
        error.message?.includes("does not exist") || 
        (error.message?.includes("relation") && error.message?.includes("does not exist")) ||
        error.code === "P2021") {
      errorMessage = "جدول محصولات وجود ندارد. لطفاً دستور 'npx prisma db push' را اجرا کنید.";
      statusCode = 503; // Service Unavailable
    } else if (error.code === "P1001" || 
               error.message?.includes("connect") ||
               error.message?.includes("connection") ||
               error.message?.includes("ECONNREFUSED")) {
      errorMessage = "خطا در اتصال به دیتابیس. لطفاً اتصال دیتابیس را بررسی کنید.";
      statusCode = 503;
    } else if (error.code === "P2025") {
      errorMessage = "رکورد مورد نظر یافت نشد";
      statusCode = 404;
    } else if (error.message?.includes("Unknown model") || 
               error.message?.includes("product")) {
      errorMessage = "مدل محصولات در دسترس نیست. لطفاً 'npx prisma generate' را اجرا کنید.";
      statusCode = 503;
    } else if (error.message) {
      errorMessage = `خطا: ${error.message.substring(0, 200)}`;
    }
    
    // Always return JSON, never HTML
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        data: [], // Return empty array so frontend doesn't break
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
        details: process.env.NODE_ENV === "development" ? {
          message: error.message,
          code: error.code,
        } : undefined
      },
      { status: statusCode }
    );
  }
}


