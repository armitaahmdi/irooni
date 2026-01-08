/**
 * تابع ارسال SMS با استفاده از Kavenegar API
 * این فایل wrapper برای توابع Kavenegar است و برای سازگاری با کدهای موجود نگه داشته شده
 */

import { sendSMS as sendKavenegarSMS, sendOTP as sendKavenegarOTP } from "@/utils/kavenegar"

/**
 * ارسال پیامک ساده
 * @param {string} phone - شماره گیرنده
 * @param {string} message - متن پیامک
 * @param {string} sender - شماره فرستنده (اختیاری)
 * @returns {Promise<{success: boolean, messageId?: number, data?: any}>}
 */
export async function sendSMS(phone, message, sender = null) {
  const kavenegarSender = sender || process.env.KAVENEGAR_SENDER || null
  return await sendKavenegarSMS(phone, message, kavenegarSender)
}

/**
 * ارسال OTP با فرمت استاندارد
 * در صورت وجود template در Kavenegar از متد Lookup استفاده می‌شود
 * در غیر این صورت از متد Send استفاده می‌شود
 * @param {string} phone - شماره گیرنده
 * @param {string} otp - کد OTP
 * @returns {Promise<{success: boolean, messageId?: number, data?: any}>}
 */
export async function sendOTP(phone, otp) {
  // استفاده از متد Lookup که برای OTP مناسب‌تر است
  return await sendKavenegarOTP(phone, otp)
}

/**
 * ارسال پیامک ثبت سفارش
 */
export async function sendOrderConfirmationSMS(phone, orderNumber, totalAmount) {
  const message = `سفارش شما با شماره ${orderNumber} ثبت شد.\nمبلغ: ${totalAmount.toLocaleString('fa-IR')} تومان\nپوشاک ایرونی\nبرای پیگیری سفارش به پروفایل خود مراجعه کنید.`
  return await sendSMS(phone, message)
}

/**
 * ارسال پیامک پرداخت موفق
 */
export async function sendPaymentSuccessSMS(phone, orderNumber) {
  const message = `پرداخت سفارش ${orderNumber} با موفقیت انجام شد.\nپوشاک ایرونی\nسفارش شما در حال پردازش است.`
  return await sendSMS(phone, message)
}

/**
 * ارسال پیامک آماده ارسال
 */
export async function sendOrderShippedSMS(phone, orderNumber, trackingNumber = null) {
  const trackingText = trackingNumber ? `\nشماره پیگیری: ${trackingNumber}` : ''
  const message = `سفارش ${orderNumber} آماده ارسال است.${trackingText}\nپوشاک ایرونی\nبا تشکر از خرید شما.`
  return await sendSMS(phone, message)
}

/**
 * ارسال پیامک تحویل سفارش
 */
export async function sendOrderDeliveredSMS(phone, orderNumber) {
  const message = `سفارش ${orderNumber} تحویل داده شد.\nپوشاک ایرونی\nامیدواریم از خرید خود راضی باشید.`
  return await sendSMS(phone, message)
}

