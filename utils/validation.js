/**
 * Validation utilities using Zod
 * Centralized validation schemas for API endpoints
 */

import { z } from 'zod';

// Phone number validation (Iranian format)
export const phoneSchema = z
  .string()
  .regex(/^09\d{9}$/, 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد')
  .length(11, 'شماره موبایل باید 11 رقم باشد');

// OTP validation
export const otpSchema = z
  .string()
  .regex(/^\d{6}$/, 'کد تأیید باید 6 رقم باشد')
  .length(6, 'کد تأیید باید 6 رقم باشد');

// Email validation
export const emailSchema = z
  .string()
  .email('ایمیل معتبر نیست')
  .optional()
  .nullable();

// Product validation schemas
export const productCreateSchema = z.object({
  name: z.string().min(1, 'نام محصول الزامی است').max(200, 'نام محصول نباید بیشتر از 200 کاراکتر باشد'),
  code: z.string().min(1, 'کد محصول الزامی است').max(50, 'کد محصول نباید بیشتر از 50 کاراکتر باشد'),
  category: z.string().min(1, 'دسته‌بندی الزامی است'),
  subcategory: z.string().optional().nullable(),
  image: z.string().url('آدرس تصویر معتبر نیست'),
  images: z.array(z.string().url('آدرس تصویر معتبر نیست')).optional().default([]),
  price: z.number().int().positive('قیمت باید عدد مثبت باشد'),
  discountPercent: z.number().int().min(0).max(100).optional().nullable(),
  rating: z.number().min(0).max(5).optional().nullable(),
  stock: z.number().int().min(0, 'موجودی نمی‌تواند منفی باشد'),
  sizes: z.array(z.string()).optional().default([]),
  colors: z.array(z.string()).optional().default([]),
  inStock: z.boolean().optional().default(true),
  isVisible: z.boolean().optional().default(true),
  material: z.string().max(200).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  features: z.array(z.string()).optional().default([]),
  sizeChart: z.any().optional().nullable(),
  variants: z.array(z.object({
    color: z.string(),
    size: z.string(),
    price: z.number().int().positive(),
    stock: z.number().int().min(0),
    image: z.string().url().optional().nullable(),
  })).optional().default([]),
});

export const productUpdateSchema = productCreateSchema.partial().extend({
  id: z.string().min(1, 'شناسه محصول الزامی است'),
});

// Address validation
export const addressSchema = z.object({
  title: z.string().min(1, 'عنوان آدرس الزامی است').max(50, 'عنوان آدرس نباید بیشتر از 50 کاراکتر باشد'),
  province: z.string().min(1, 'استان الزامی است'),
  city: z.string().min(1, 'شهر الزامی است'),
  address: z.string().min(10, 'آدرس باید حداقل 10 کاراکتر باشد').max(500, 'آدرس نباید بیشتر از 500 کاراکتر باشد'),
  plaque: z.string().max(20).optional().nullable(),
  unit: z.string().max(20).optional().nullable(),
  postalCode: z.string().regex(/^\d{10}$/, 'کدپستی باید 10 رقم باشد').optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  isDefault: z.boolean().optional().default(false),
});

// Order validation
export const orderCreateSchema = z.object({
  addressId: z.string().min(1, 'آدرس الزامی است'),
  paymentMethod: z.string().optional().default('zarinpal'),
  couponCode: z.string().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

// Contact message validation
export const contactMessageSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل 2 کاراکتر باشد').max(100, 'نام نباید بیشتر از 100 کاراکتر باشد'),
  phone: phoneSchema,
  email: emailSchema,
  subject: z.string().min(3, 'موضوع باید حداقل 3 کاراکتر باشد').max(200, 'موضوع نباید بیشتر از 200 کاراکتر باشد'),
  message: z.string().min(10, 'پیام باید حداقل 10 کاراکتر باشد').max(2000, 'پیام نباید بیشتر از 2000 کاراکتر باشد'),
});

// Review validation
export const reviewSchema = z.object({
  productId: z.string().min(1, 'شناسه محصول الزامی است'),
  rating: z.number().int().min(1, 'امتیاز باید بین 1 تا 5 باشد').max(5, 'امتیاز باید بین 1 تا 5 باشد'),
  title: z.string().max(200).optional().nullable(),
  comment: z.string().max(2000).optional().nullable(),
});

// Coupon validation
export const couponSchema = z.object({
  code: z.string().min(3, 'کد تخفیف باید حداقل 3 کاراکتر باشد').max(50, 'کد تخفیف نباید بیشتر از 50 کاراکتر باشد').regex(/^[A-Z0-9]+$/, 'کد تخفیف باید فقط حروف بزرگ و اعداد باشد'),
  description: z.string().max(500).optional().nullable(),
  discountType: z.enum(['percentage', 'fixed'], {
    errorMap: () => ({ message: 'نوع تخفیف باید percentage یا fixed باشد' }),
  }),
  discountValue: z.number().int().positive('مقدار تخفیف باید عدد مثبت باشد'),
  minPurchase: z.number().int().min(0).optional().nullable(),
  maxDiscount: z.number().int().min(0).optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

// Article validation
export const articleSchema = z.object({
  title: z.string().min(1, 'عنوان مقاله الزامی است').max(200, 'عنوان نباید بیشتر از 200 کاراکتر باشد'),
  slug: z.string().min(1, 'اسلاگ الزامی است').max(200, 'اسلاگ نباید بیشتر از 200 کاراکتر باشد').regex(/^[a-z0-9-]+$/, 'اسلاگ باید فقط حروف کوچک، اعداد و خط تیره باشد'),
  image: z.string().url().optional().nullable(),
  content: z.string().max(50000).optional().nullable(),
  excerpt: z.string().max(500).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  isPublished: z.boolean().optional().default(false),
});

// Pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1, 'صفحه باید حداقل 1 باشد').default(1),
  limit: z.coerce.number().int().min(1, 'تعداد در هر صفحه باید حداقل 1 باشد').max(100, 'تعداد در هر صفحه نباید بیشتر از 100 باشد').default(12),
});

// Search validation
export const searchSchema = z.object({
  query: z.string().min(1, 'عبارت جستجو الزامی است').max(200, 'عبارت جستجو نباید بیشتر از 200 کاراکتر باشد'),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  inStock: z.coerce.boolean().optional(),
  sortBy: z.enum(['price-asc', 'price-desc', 'newest', 'popular', 'rating']).optional(),
});

/**
 * Validate data against a schema
 * @param {z.ZodSchema} schema - Zod schema
 * @param {any} data - Data to validate
 * @returns {Object} - { success: boolean, data?: any, error?: string }
 */
export function validate(schema, data) {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: firstError?.message || 'اعتبارسنجی ناموفق بود',
        errors: error.errors,
      };
    }
    return {
      success: false,
      error: 'خطا در اعتبارسنجی',
    };
  }
}

/**
 * Safe parse - returns result object instead of throwing
 */
export function safeParse(schema, data) {
  return schema.safeParse(data);
}

