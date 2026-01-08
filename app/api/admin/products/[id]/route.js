import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { normalizeSubcategory, normalizeCategory } from "@/utils/subcategoryHelper";

// GET - دریافت یک محصول
export async function GET(request, { params }) {
  try {
    await requireAdmin();

    // در Next.js 15+ params باید await شود، در نسخه‌های قدیمی‌تر مستقیماً استفاده می‌شود
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subcategory: true,
        variants: {
          orderBy: [
            { color: "asc" },
            { size: "asc" },
          ],
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "محصول یافت نشد" },
        { status: 404 }
      );
    }

    // فرمت محصول برای backward compatibility
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

    const formattedProduct = {
      ...product,
      category: product.category?.slug || product.categoryLegacy || null,
      subcategory: subcategorySlug,
    };

    return NextResponse.json({
      success: true,
      data: formattedProduct,
    });
  } catch (error) {
    console.error("Error fetching product:", error);

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "خطا در دریافت محصول" },
      { status: 500 }
    );
  }
}

// PUT - به‌روزرسانی محصول
export async function PUT(request, { params }) {
  try {
    await requireAdmin();

    // در Next.js 15+ params باید await شود، در نسخه‌های قدیمی‌تر مستقیماً استفاده می‌شود
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const body = await request.json();

    const {
      name,
      code,
      category,
      subcategory,
      image,
      images,
      price,
      discountPercent,
      rating,
      stock,
      sizeStock,
      sizes,
      colors,
      variants,
      inStock,
      isVisible,
      material,
      description,
      features,
      sizeChart,
    } = body;

    // بررسی وجود محصول
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "محصول یافت نشد" },
        { status: 404 }
      );
    }

    // بررسی کد تکراری (اگر تغییر کرده باشد)
    if (code && code !== existingProduct.code) {
      const codeExists = await prisma.product.findUnique({
        where: { code },
      });

      if (codeExists) {
        return NextResponse.json(
          { error: "کد محصول تکراری است" },
          { status: 400 }
        );
      }
    }

    // آماده‌سازی داده‌های به‌روزرسانی
    const updateData = {};

    if (name) updateData.name = name;
    if (code) updateData.code = code;
    if (image) updateData.image = image;
    if (images !== undefined) updateData.images = images;
    if (price) updateData.price = parseInt(price);
    if (discountPercent !== undefined) {
      updateData.discountPercent = discountPercent ? parseInt(discountPercent) : null;
    }
    if (rating !== undefined) {
      updateData.rating =
        rating !== null && rating !== "" && !Number.isNaN(parseFloat(rating))
          ? parseFloat(rating)
          : null;
    }
    if (stock !== undefined) updateData.stock = parseInt(stock) || 0;
    if (sizeStock !== undefined) updateData.sizeStock = sizeStock || {};
    if (sizes !== undefined) updateData.sizes = sizes;
    if (colors !== undefined) updateData.colors = colors;
    if (inStock !== undefined) updateData.inStock = inStock;
    if (isVisible !== undefined) updateData.isVisible = isVisible;
    if (material !== undefined) updateData.material = material || null;
    if (description !== undefined) updateData.description = description || null;
    if (features !== undefined) updateData.features = features;
    if (sizeChart !== undefined) updateData.sizeChart = sizeChart;

    // به‌روزرسانی categoryId و subcategoryId اگر category یا subcategory تغییر کرده باشد
    if (category) {
      const normalizedCategory = normalizeCategory(category);
      const categoryRecord = await prisma.category.findUnique({
        where: { slug: normalizedCategory },
      });

      if (!categoryRecord) {
        return NextResponse.json(
          { error: `دسته‌بندی "${normalizedCategory}" یافت نشد` },
          { status: 400 }
        );
      }

      updateData.categoryId = categoryRecord.id;

      // اگر subcategory هم داده شده، آن را هم به‌روزرسانی کن
      if (subcategory !== undefined) {
        if (subcategory && subcategory.trim() !== "") {
          const normalizedSubcategory = normalizeSubcategory(normalizedCategory, subcategory);
          const fullSubcategorySlug = `${normalizedCategory}-${normalizedSubcategory}`;
          const subcategoryRecord = await prisma.category.findUnique({
            where: { slug: fullSubcategorySlug },
          });

          if (!subcategoryRecord) {
            return NextResponse.json(
              { error: `زیردسته "${normalizedSubcategory}" یافت نشد` },
              { status: 400 }
            );
          }

          updateData.subcategoryId = subcategoryRecord.id;
        } else {
          updateData.subcategoryId = null;
        }
      }
    } else if (subcategory !== undefined) {
      // اگر فقط subcategory تغییر کرده (بدون تغییر category)
      const currentCategory = existingProduct.categoryId
        ? await prisma.category.findUnique({ where: { id: existingProduct.categoryId } })
        : null;

      if (!currentCategory) {
        return NextResponse.json(
          { error: "دسته‌بندی محصول یافت نشد" },
          { status: 400 }
        );
      }

      if (subcategory && subcategory.trim() !== "") {
        const normalizedSubcategory = normalizeSubcategory(currentCategory.slug, subcategory);
        const fullSubcategorySlug = `${currentCategory.slug}-${normalizedSubcategory}`;
        const subcategoryRecord = await prisma.category.findUnique({
          where: { slug: fullSubcategorySlug },
        });

        if (!subcategoryRecord) {
          return NextResponse.json(
            { error: `زیردسته "${normalizedSubcategory}" یافت نشد` },
            { status: 400 }
          );
        }

        updateData.subcategoryId = subcategoryRecord.id;
      } else {
        updateData.subcategoryId = null;
      }
    }

    // به‌روزرسانی slug اگر name تغییر کرده باشد
    if (name && name !== existingProduct.name) {
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

      while (await prisma.product.findUnique({ where: { slug: productSlug } })) {
        productSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      updateData.slug = productSlug;
    }

    // مدیریت ورینت‌ها
    if (variants !== undefined && Array.isArray(variants)) {
      // حذف ورینت‌های قدیمی که در لیست جدید نیستند
      const existingVariants = await prisma.productVariant.findMany({
        where: { productId: id },
        select: { id: true },
      });
      
      const newVariantIds = variants
        .filter(v => v.id)
        .map(v => v.id);
      
      const variantsToDelete = existingVariants
        .filter(v => !newVariantIds.includes(v.id))
        .map(v => v.id);
      
      if (variantsToDelete.length > 0) {
        await prisma.productVariant.deleteMany({
          where: {
            id: { in: variantsToDelete },
            productId: id,
          },
        });
      }
      
      // به‌روزرسانی یا ایجاد ورینت‌ها
      for (const variant of variants) {
        // تبدیل price و stock به عدد
        const variantPrice = variant.price !== undefined && variant.price !== null && variant.price !== ''
          ? parseInt(variant.price)
          : (price ? parseInt(price) : existingProduct.price);
        
        const variantStock = variant.stock !== undefined && variant.stock !== null && variant.stock !== ''
          ? parseInt(variant.stock)
          : 0;

        if (variant.id) {
          // به‌روزرسانی ورینت موجود
          await prisma.productVariant.update({
            where: { id: variant.id },
            data: {
              color: variant.color,
              size: variant.size,
              price: variantPrice,
              stock: variantStock,
              image: variant.image || null,
            },
          });
        } else {
          // ایجاد ورینت جدید
          await prisma.productVariant.create({
            data: {
              productId: id,
              color: variant.color,
              size: variant.size,
              price: variantPrice,
              stock: variantStock,
              image: variant.image || null,
            },
          });
        }
      }
    }

    // به‌روزرسانی محصول
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        variants: {
          orderBy: [
            { color: "asc" },
            { size: "asc" },
          ],
        },
      },
    });

    // Revalidate cache for products API
    revalidatePath('/api/products');
    revalidatePath('/api/products/search');
    if (product.slug) {
      revalidatePath(`/api/products/by-slug/${product.slug}`);
    }

    return NextResponse.json({
      success: true,
      message: "محصول با موفقیت به‌روزرسانی شد",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    if (error.message.includes("Unauthorized")) {
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

    // در development، جزئیات خطا را برگردان
    const errorDetails = process.env.NODE_ENV === "development" ? {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    } : undefined;

    return NextResponse.json(
      { 
        error: "خطا در به‌روزرسانی محصول",
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}

// DELETE - حذف محصول
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();

    // در Next.js 15+ params باید await شود، در نسخه‌های قدیمی‌تر مستقیماً استفاده می‌شود
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    // بررسی وجود محصول
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "محصول یافت نشد" },
        { status: 404 }
      );
    }

    // ابتدا cart_items را حذف می‌کنیم (برای اطمینان)
    try {
      await prisma.cartItem.deleteMany({
        where: { productId: id },
      });
    } catch (cartError) {
      console.log("Note: Could not delete cart items manually:", cartError.message);
      // ادامه می‌دهیم - constraint خودش حذف می‌کند
    }

    // حذف محصول
    // با onDelete: Cascade در CartItem و onDelete: SetNull در OrderItem،
    // می‌توان محصول را در هر شرایطی حذف کرد
    // constraint خودش cart_items را حذف می‌کند و order_items را به null تبدیل می‌کند
    await prisma.product.delete({
      where: { id },
    });

    // Revalidate cache for products API
    revalidatePath('/api/products');
    revalidatePath('/api/products/search');

    return NextResponse.json({
      success: true,
      message: "محصول با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });

    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    // همیشه جزئیات خطا را در development برگردان
    const errorDetails = {
      message: error.message,
      code: error.code,
      meta: error.meta,
    };

    // اگر مشکل از foreign key constraint باشد، سعی می‌کنیم به صورت دستی حذف کنیم
    if (error.code === "P2003" || 
        error.message?.includes("Foreign key constraint") || 
        error.message?.includes("violates foreign key") ||
        error.message?.includes("foreign key")) {
      try {
        console.log("Attempting manual delete due to constraint issue...");
        
        // حذف cart_items مرتبط
        const deletedCartItems = await prisma.cartItem.deleteMany({
          where: { productId: id },
        });
        console.log(`Deleted ${deletedCartItems.count} cart items`);
        
        // دوباره سعی می‌کنیم محصول را حذف کنیم
        await prisma.product.delete({
          where: { id },
        });
        
        return NextResponse.json({
          success: true,
          message: "محصول با موفقیت حذف شد",
        });
      } catch (retryError) {
        console.error("Retry delete failed:", retryError);
        return NextResponse.json(
          { 
            error: "خطا در حذف محصول. لطفاً دوباره تلاش کنید.",
            details: process.env.NODE_ENV === "development" ? {
              originalError: errorDetails,
              retryError: {
                message: retryError.message,
                code: retryError.code,
                meta: retryError.meta,
              },
            } : undefined,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: "خطا در حذف محصول",
        details: process.env.NODE_ENV === "development" ? errorDetails : undefined,
      },
      { status: 500 }
    );
  }
}
