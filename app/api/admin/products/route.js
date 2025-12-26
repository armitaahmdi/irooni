import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { normalizeSubcategory, normalizeCategory } from "@/utils/subcategoryHelper";
import { validateCategorySubcategory } from "@/utils/categoryValidator";

// GET - دریافت لیست محصولات
export async function GET(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // ساخت where clause
    const where = {};
    
    if (category) {
      // پیدا کردن category بر اساس slug
      const categoryRecord = await prisma.category.findUnique({
        where: { slug: category },
      });

      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
      } else {
        // Fallback به ساختار قدیمی
        where.categoryLegacy = category;
      }
    }
    // اگر category انتخاب نشده، فیلتر category اعمال نمی‌شود و همه محصولات نمایش داده می‌شوند
    
    if (search) {
      // اگر search و category هر دو وجود دارند، باید با AND ترکیب شوند
      if (Object.keys(where).length > 0) {
        where.AND = [
          ...(where.categoryId ? [{ categoryId: where.categoryId }] : []),
          ...(where.categoryLegacy ? [{ categoryLegacy: where.categoryLegacy }] : []),
          {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { code: { contains: search, mode: "insensitive" } },
            ],
          },
        ];
        delete where.categoryId;
        delete where.categoryLegacy;
      } else {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { code: { contains: search, mode: "insensitive" } },
        ];
      }
    }

    // دریافت محصولات
    let products, total;
    try {
      [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            category: true,
            subcategory: true,
          },
        }),
        prisma.product.count({ where }),
      ]);
    } catch (dbError) {
      // اگر خطا مربوط به فیلدهای جدید است (مثل sizeStock)، بدون include query کن
      if (dbError.message?.includes("sizeStock") || 
          dbError.code === "P2009" || 
          dbError.code === "P2011" ||
          dbError.message?.includes("Unknown column") ||
          dbError.message?.includes("column") && dbError.message?.includes("does not exist")) {
        console.warn("Database schema mismatch detected, querying without new fields");
        [products, total] = await Promise.all([
          prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              name: true,
              slug: true,
              code: true,
              categoryId: true,
              subcategoryId: true,
              image: true,
              images: true,
              price: true,
              discountPercent: true,
              rating: true,
              stock: true,
              sizes: true,
              colors: true,
              inStock: true,
              material: true,
              description: true,
              features: true,
              sizeChart: true,
              categoryLegacy: true,
              subcategoryLegacy: true,
              createdAt: true,
              updatedAt: true,
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
            },
          }),
          prisma.product.count({ where }),
        ]);
        // اضافه کردن sizeStock به null برای همه محصولات
        products = products.map(p => ({ ...p, sizeStock: null }));
      } else {
        throw dbError;
      }
    }

    // فرمت محصولات برای backward compatibility
    const formattedProducts = products.map((product) => {
      let subcategorySlug = null;
      if (product.subcategory?.slug) {
        // استخراج subcategory slug از slug کامل
        const categorySlug = product.category?.slug || "";
        if (categorySlug && product.subcategory.slug.startsWith(`${categorySlug}-`)) {
          subcategorySlug = product.subcategory.slug.replace(`${categorySlug}-`, "");
        } else {
          subcategorySlug = product.subcategory.slug;
        }
      } else if (product.subcategoryLegacy) {
        subcategorySlug = product.subcategoryLegacy;
      }

      return {
        ...product,
        category: product.category?.slug || product.categoryLegacy || null,
        subcategory: subcategorySlug,
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
    console.error("Error fetching products:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
    
    if (error.message?.includes("Unauthorized") || error.code === "P2003") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    // اگر خطای دیتابیس مربوط به فیلدهای جدید است، سعی کن بدون آن‌ها query کن
    if (error.message?.includes("sizeStock") || error.code === "P2009" || error.code === "P2011") {
      console.warn("Field 'sizeStock' may not exist in database, trying without it");
      try {
        // Query بدون include کردن فیلدهای جدید
        const [products, total] = await Promise.all([
          prisma.product.findMany({
            where: {},
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              name: true,
              slug: true,
              code: true,
              categoryId: true,
              subcategoryId: true,
              image: true,
              images: true,
              price: true,
              discountPercent: true,
              rating: true,
              stock: true,
              sizes: true,
              colors: true,
              inStock: true,
              material: true,
              description: true,
              features: true,
              sizeChart: true,
              categoryLegacy: true,
              subcategoryLegacy: true,
              createdAt: true,
              updatedAt: true,
            },
            include: {
              category: true,
              subcategory: true,
            },
          }),
          prisma.product.count({}),
        ]);

        const formattedProducts = products.map((product) => {
          let subcategorySlug = null;
          if (product.subcategory?.slug) {
            const categorySlug = product.category?.slug || "";
            if (categorySlug && product.subcategory.slug.startsWith(`${categorySlug}-`)) {
              subcategorySlug = product.subcategory.slug.replace(`${categorySlug}-`, "");
            } else {
              subcategorySlug = product.subcategory.slug;
            }
          } else if (product.subcategoryLegacy) {
            subcategorySlug = product.subcategoryLegacy;
          }

          return {
            ...product,
            sizeStock: null, // Set to null if field doesn't exist
            category: product.category?.slug || product.categoryLegacy || null,
            subcategory: subcategorySlug,
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
      } catch (retryError) {
        console.error("Retry also failed:", retryError);
        return NextResponse.json(
          { 
            error: "خطا در دریافت محصولات",
            details: process.env.NODE_ENV === "development" ? retryError.message : undefined,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: "خطا در دریافت محصولات",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// POST - ایجاد محصول جدید
export async function POST(request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      name,
      code,
      category,
      subcategory,
      image,
      images = [],
      price,
      discountPercent,
      rating,
      stock,
      sizeStock = {}, // ساختار قدیمی: {"S": {"قرمز": 3, "آبی": 2}}
      variants = [], // ساختار جدید: [{color: "قرمز", size: "S", price: 100000, stock: 3, image: "..."}]
      sizes = [],
      colors = [],
      inStock = true,
      isVisible = true,
      material,
      description,
      features = [],
      sizeChart,
    } = body;

    // اعتبارسنجی فیلدهای الزامی
    if (!name || !code || !category || !image || !price || stock === undefined) {
      return NextResponse.json(
        { error: "فیلدهای الزامی را پر کنید" },
        { status: 400 }
      );
    }

    // Normalize category to slug format (ensure it's always a slug)
    // این کار باعث می‌شود که همیشه slug در دیتابیس ذخیره شود
    const normalizedCategory = normalizeCategory(category);
    if (!normalizedCategory) {
      return NextResponse.json(
        { error: "دسته‌بندی نامعتبر است" },
        { status: 400 }
      );
    }

    // اعتبارسنجی دسته‌بندی و زیردسته (با category normalize شده)
    const validation = validateCategorySubcategory(normalizedCategory, subcategory || null);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || "دسته‌بندی یا زیردسته نامعتبر است" },
        { status: 400 }
      );
    }

    // Normalize subcategory to slug format (ensure it's always a slug)
    // این کار باعث می‌شود که همیشه slug در دیتابیس ذخیره شود
    let normalizedSubcategory = null;
    if (subcategory && subcategory.trim() !== "") {
      try {
        normalizedSubcategory = normalizeSubcategory(normalizedCategory, subcategory);
        // Double check: if normalize returned the same value but it's not a valid slug, use validation result
        if (validation.subcategory && validation.subcategory.slug !== normalizedSubcategory) {
          normalizedSubcategory = validation.subcategory.slug;
        }
        console.log(`[API] Normalized subcategory: "${subcategory}" -> "${normalizedSubcategory}" for category "${normalizedCategory}"`);
      } catch (error) {
        console.error("Error normalizing subcategory:", error);
        // If validation passed, use the validated subcategory slug
        if (validation.subcategory) {
          normalizedSubcategory = validation.subcategory.slug;
        } else {
          normalizedSubcategory = null;
        }
      }
    }

    console.log(`[API] Creating product with category: "${normalizedCategory}", subcategory: "${normalizedSubcategory || 'none'}"`);

    // پیدا کردن category بر اساس slug
    const categoryRecord = await prisma.category.findUnique({
      where: { slug: normalizedCategory },
    });

    if (!categoryRecord) {
      return NextResponse.json(
        { error: `دسته‌بندی "${normalizedCategory}" یافت نشد. لطفاً ابتدا دسته‌بندی را ایجاد کنید.` },
        { status: 400 }
      );
    }

    // پیدا کردن subcategory بر اساس slug کامل (اگر وجود دارد)
    let subcategoryRecord = null;
    if (normalizedSubcategory) {
      const fullSubcategorySlug = `${normalizedCategory}-${normalizedSubcategory}`;
      subcategoryRecord = await prisma.category.findUnique({
        where: { slug: fullSubcategorySlug },
      });

      if (!subcategoryRecord) {
        return NextResponse.json(
          { error: `زیردسته "${normalizedSubcategory}" برای دسته "${normalizedCategory}" یافت نشد. لطفاً ابتدا زیردسته را ایجاد کنید.` },
          { status: 400 }
        );
      }
    }

    // بررسی اینکه کد تکراری نباشد
    const existingProduct = await prisma.product.findUnique({
      where: { code },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "کد محصول تکراری است" },
        { status: 400 }
      );
    }

    // ایجاد slug برای محصول
    function createSlug(text) {
      return text
        .toLowerCase()
        .replace(/[^\u0600-\u06FF\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }

    const baseSlug = createSlug(name);
    let productSlug = baseSlug;
    let counter = 1;
    
    // بررسی یکتایی slug
    while (await prisma.product.findUnique({ where: { slug: productSlug } })) {
      productSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // ایجاد محصول با استفاده از categoryId و subcategoryId
    const product = await prisma.product.create({
      data: {
        name,
        slug: productSlug,
        code,
        categoryId: categoryRecord.id,
        subcategoryId: subcategoryRecord?.id || null,
        image,
        images: images || [],
        price: parseInt(price),
        discountPercent: discountPercent ? parseInt(discountPercent) : null,
        rating:
          rating !== undefined && rating !== null && rating !== ""
            ? parseFloat(rating)
            : null,
        stock: parseInt(stock) || 0,
        sizeStock: sizeStock || {}, // برای backward compatibility
        sizes: sizes || [],
        colors: colors || [],
        inStock,
        isVisible: isVisible !== undefined ? isVisible : true,
        material: material || null,
        description: description || null,
        features: features || [],
        sizeChart: sizeChart || null,
        variants: {
          // ایجاد ورینت‌ها
          create: variants.map((variant) => ({
            color: variant.color,
            size: variant.size,
            price: variant.price ? parseInt(variant.price) : parseInt(price), // تبدیل به عدد
            stock: variant.stock ? parseInt(variant.stock) : 0, // تبدیل به عدد
            image: variant.image || null,
          })),
        },
      },
      include: {
        variants: {
          orderBy: [
            { color: "asc" },
            { size: "asc" },
          ],
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "محصول با موفقیت ایجاد شد",
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "کد محصول تکراری است" },
        { status: 400 }
      );
    }

    // نمایش خطای دقیق‌تر در حالت development
    const errorMessage = process.env.NODE_ENV === "development"
      ? `خطا در ایجاد محصول: ${error.message}`
      : "خطا در ایجاد محصول";

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
