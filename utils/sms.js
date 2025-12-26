/**
 * تابع ارسال SMS با استفاده از sms.ir API
 */

export async function sendSMS(phone, message) {
  const apiKey = process.env.SMS_IR_API_KEY

  if (!apiKey) {
    throw new Error("SMS_IR_API_KEY not configured in environment variables")
  }

  try {
    const response = await fetch("https://api.sms.ir/v1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        mobile: phone,
        message: message,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("SMS.ir API error:", data)
      throw new Error(data.message || data.Message || "خطا در ارسال پیامک")
    }

    return {
      success: true,
      data: data,
    }
  } catch (error) {
    console.error("SMS send error:", error)
    throw error
  }
}

/**
 * ارسال OTP با فرمت استاندارد
 */
export async function sendOTP(phone, otp) {
  const message = `کد تأیید شما: ${otp}\nپوشاک ایرونی\nاین کد برای 5 دقیقه معتبر است.`
  return await sendSMS(phone, message)
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

