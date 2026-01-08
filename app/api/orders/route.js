import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationSMS } from "@/utils/sms";

// تابع کمکی برای تولید شماره سفارش
function generateOrderNumber() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
}

// GET - دریافت لیست سفارش‌های کاربر
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        address: true,
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    });
    return NextResponse.json(
      {
        error: "خطا در دریافت سفارش‌ها",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// POST - ایجاد سفارش جدید
export async function POST(request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { addressId, paymentMethod, notes, shippingCost = 0, couponId } = body;

    if (!addressId) {
      return NextResponse.json(
        { error: "آدرس ارسال الزامی است" },
        { status: 400 }
      );
    }

    // بررسی وجود آدرس
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== session.user.id) {
      return NextResponse.json(
        { error: "آدرس یافت نشد" },
        { status: 404 }
      );
    }

    // دریافت سبد خرید
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
            variant: true, // شامل variant هم باشه
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "سبد خرید شما خالی است" },
        { status: 400 }
      );
    }

    // بررسی موجودی و محاسبه مبلغ کل
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      // بررسی موجودی - استفاده از variant یا product.stock
      let baseStock = item.product.stock || 0;
      let variantInfo = "";
      
      if (item.variantId && item.variant) {
        // اگر variant وجود دارد، از موجودی variant استفاده کن
        baseStock = item.variant.stock || 0;
        variantInfo = `سایز ${item.variant.size} و رنگ ${item.variant.color}`;
      } else if (item.size && item.color && item.product.sizeStock) {
        // اگر variant وجود ندارد اما sizeStock وجود دارد
        try {
          const sizeStockObj = typeof item.product.sizeStock === 'string' 
            ? JSON.parse(item.product.sizeStock) 
            : item.product.sizeStock;
          
          if (sizeStockObj && typeof sizeStockObj === 'object') {
            if (sizeStockObj[item.size] && typeof sizeStockObj[item.size] === 'object') {
              const colorStock = sizeStockObj[item.size][item.color];
              if (colorStock !== null && colorStock !== undefined) {
                baseStock = Number(colorStock) || 0;
                variantInfo = `سایز ${item.size} و رنگ ${item.color}`;
              }
            }
          }
        } catch (e) {
          console.log("Error parsing sizeStock:", e);
        }
      }
      
      // محاسبه موجودی واقعی: موجودی پایه - تعداد در سبد خرید (بدون آیتم فعلی)
      // چون این آیتم در حال تبدیل به سفارش است، باید موجودی را بدون در نظر گرفتن این آیتم چک کنیم
      let cartQuantityForVariant = 0;
      if (item.variantId) {
        // پیدا کردن تعداد این variant در سبد خرید (بدون آیتم فعلی)
        const otherCartItems = cart.items.filter(ci => 
          ci.variantId === item.variantId && ci.id !== item.id
        );
        cartQuantityForVariant = otherCartItems.reduce((sum, ci) => sum + ci.quantity, 0);
      } else if (item.size && item.color) {
        // پیدا کردن تعداد این سایز+رنگ در سبد خرید (بدون آیتم فعلی)
        const otherCartItems = cart.items.filter(ci => 
          ci.productId === item.productId && 
          ci.size === item.size && 
          ci.color === item.color && 
          ci.id !== item.id
        );
        cartQuantityForVariant = otherCartItems.reduce((sum, ci) => sum + ci.quantity, 0);
      }
      
      const availableStock = Math.max(0, baseStock - cartQuantityForVariant);
      
      // بررسی موجودی کافی
      if (availableStock < item.quantity) {
        const errorMessage = variantInfo 
          ? `موجودی ${variantInfo} محصول "${item.product.name}" کافی نیست. موجودی: ${availableStock}`
          : `موجودی محصول "${item.product.name}" کافی نیست. موجودی: ${availableStock}`;
        
        return NextResponse.json(
          { 
            error: errorMessage,
            productId: item.product.id,
          },
          { status: 400 }
        );
      }

      // محاسبه قیمت - اگر variant قیمت دارد، از آن استفاده کن
      let price = item.product.price;
      if (item.variant && item.variant.price) {
        price = item.variant.price;
      } else if (item.product.discountPercent) {
        price = item.product.price * (1 - item.product.discountPercent / 100);
      }
      
      const subtotal = price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: item.product.id,
        variantId: item.variantId || null, // اضافه کردن variantId
        productName: item.product.name,
        productImage: item.variant?.image || item.product.image, // اگر variant تصویر دارد، از آن استفاده کن
        productPrice: price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        subtotal,
      });
    }

    // اعمال کد تخفیف
    let discountAmount = 0;
    let finalCouponId = null;
    
    if (couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: { id: couponId },
      });

      if (coupon && coupon.isActive) {
        if (
          (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) &&
          (!coupon.minPurchase || totalAmount >= coupon.minPurchase)
        ) {
          // محاسبه تخفیف
          if (coupon.discountType === "percentage") {
            discountAmount = Math.round((totalAmount * coupon.discountValue) / 100);
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else if (coupon.discountType === "fixed") {
            discountAmount = coupon.discountValue;
            if (discountAmount > totalAmount) {
              discountAmount = totalAmount;
            }
          }
          finalCouponId = coupon.id;
        }
      }
    }

    totalAmount = totalAmount - discountAmount + shippingCost;

    // ایجاد سفارش
    const order = await prisma.$transaction(async (tx) => {
      // به‌روزرسانی تعداد استفاده کد تخفیف
      if (finalCouponId) {
        await tx.coupon.update({
          where: { id: finalCouponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      // ایجاد سفارش با وضعیت پرداخت نشده
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          orderNumber: generateOrderNumber(),
          addressId,
          paymentMethod: paymentMethod || "zarinpal",
          paymentStatus: "unpaid", // سفارش با وضعیت پرداخت نشده ایجاد می‌شود
          totalAmount,
          discountAmount,
          shippingCost,
          couponId: finalCouponId,
          notes: notes || null,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          address: true,
        },
      });

      // کاهش موجودی محصولات و variantها
      for (const item of cart.items) {
        // اگر variant وجود دارد، موجودی variant را کم کن
        if (item.variantId && item.variant) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
          
          // همچنین موجودی کلی محصول را هم کم کن (برای backward compatibility)
          await tx.product.update({
            where: { id: item.product.id },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        } else {
          // اگر variant وجود ندارد، فقط موجودی کلی محصول را کم کن
          const newStock = item.product.stock - item.quantity;
          await tx.product.update({
            where: { id: item.product.id },
            data: {
              stock: {
                decrement: item.quantity,
              },
              inStock: newStock > 0, // اگر موجودی به 0 یا کمتر رسید، inStock را false کن
            },
          });
        }
      }

      // پاک کردن سبد خرید
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    // ارسال SMS ثبت سفارش
    try {
      await sendOrderConfirmationSMS(session.user.phone, order.orderNumber, totalAmount);
    } catch (smsError) {
      console.error("Error sending order confirmation SMS:", smsError);
      // SMS error shouldn't fail the order creation
    }

    return NextResponse.json({
      success: true,
      message: "سفارش با موفقیت ثبت شد",
      data: order,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "خطا در ثبت سفارش" },
      { status: 500 }
    );
  }
}



