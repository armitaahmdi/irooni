/**
 * سرویس ارسال SMS با استفاده از Kavenegar API
 * مستندات: https://kavenegar.com/rest.html
 */

const KAVENEGAR_BASE_URL = "https://api.kavenegar.com/v1"

/**
 * ارسال پیامک ساده با استفاده از متد Send
 * @param {string} receptor - شماره گیرنده (مثال: 09121234567)
 * @param {string} message - متن پیامک
 * @param {string} sender - شماره فرستنده (اختیاری)
 * @returns {Promise<{success: boolean, messageId?: number, data?: any, error?: string}>}
 */
export async function sendSMS(receptor, message, sender = null) {
  const apiKey = process.env.KAVENEGAR_API_KEY

  if (!apiKey) {
    throw new Error("KAVENEGAR_API_KEY not configured in environment variables")
  }

  if (!receptor || !message) {
    throw new Error("receptor and message are required")
  }

  try {
    // ساخت URL با API Key
    const url = `${KAVENEGAR_BASE_URL}/${apiKey}/sms/send.json`

    // ساخت پارامترها
    const params = new URLSearchParams({
      receptor: receptor,
      message: message,
    })

    // افزودن sender در صورت وجود
    if (sender) {
      params.append("sender", sender)
    }

    const response = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    })

    const data = await response.json()

    // بررسی وضعیت پاسخ
    if (data.return?.status !== 200) {
      const errorMessage = data.return?.message || "خطا در ارسال پیامک"
      console.error("Kavenegar API error:", data)
      
      // پیام‌های خطای خاص
      if (data.return?.status === 412) {
        throw new Error(
          "شماره فرستنده نامعتبر است. لطفاً در پنل کاوه‌نگار خط پیش‌فرض را تنظیم کنید " +
          "یا متغیر KAVENEGAR_SENDER را در .env تنظیم کنید. " +
          "یا از متد Lookup با تنظیم KAVENEGAR_TEMPLATE_NAME استفاده کنید."
        )
      }
      
      throw new Error(errorMessage)
    }

    // استخراج messageId از اولین entry
    const messageId = data.entries?.[0]?.messageid || null

    return {
      success: true,
      messageId: messageId,
      data: data.entries?.[0] || data,
    }
  } catch (error) {
    console.error("Kavenegar SMS send error:", error)
    throw error
  }
}

/**
 * ارسال OTP با استفاده از متد Lookup (اعتبار سنجی)
 * این متد اولویت بالایی دارد و فیلتر نمی‌شود
 * @param {string} receptor - شماره گیرنده
 * @param {string} token - کد OTP
 * @param {string} template - نام الگوی تعریف شده در پنل کاوه‌نگار
 * @param {string} token2 - توکن دوم (اختیاری)
 * @param {string} token3 - توکن سوم (اختیاری)
 * @returns {Promise<{success: boolean, messageId?: number, data?: any, error?: string}>}
 */
export async function sendOTP(receptor, token, template = null, token2 = null, token3 = null) {
  const apiKey = process.env.KAVENEGAR_API_KEY
  const templateName = template || process.env.KAVENEGAR_TEMPLATE_NAME

  if (!apiKey) {
    throw new Error("KAVENEGAR_API_KEY not configured in environment variables")
  }

  if (!receptor || !token) {
    throw new Error("receptor and token are required")
  }

  // اگر template تعریف نشده باشد، از متد Send استفاده می‌کنیم
  if (!templateName) {
    const message = `کد تایید شما : ${token}`
    // استفاده از sender از env یا null (که از خط پیش‌فرض استفاده می‌کند)
    const sender = process.env.KAVENEGAR_SENDER || null
    
    try {
      return await sendSMS(receptor, message, sender)
    } catch (error) {
      // اگر با sender خطا داد (مثلاً 412)، بدون sender امتحان می‌کنیم
      if (error.message.includes("ارسال کننده نامعتبر") && sender) {
        console.warn("Sender invalid, trying without sender (using default line)")
        return await sendSMS(receptor, message, null)
      }
      throw error
    }
  }

  try {
    // ساخت URL با API Key
    const url = `${KAVENEGAR_BASE_URL}/${apiKey}/verify/lookup.json`

    // ساخت پارامترها
    const params = new URLSearchParams({
      receptor: receptor,
      token: token,
      template: templateName,
    })

    // افزودن token2 و token3 در صورت وجود
    if (token2) {
      params.append("token2", token2)
    }
    if (token3) {
      params.append("token3", token3)
    }

    const response = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    })

    const data = await response.json()

    // بررسی وضعیت پاسخ
    if (data.return?.status !== 200) {
      const errorMessage = data.return?.message || "خطا در ارسال کد تأیید"
      console.error("Kavenegar Lookup API error:", data)
      
      // بررسی خطاهای خاص
      if (data.return?.status === 424) {
        throw new Error("الگوی مورد نظر پیدا نشد. لطفاً نام الگو را در پنل کاوه‌نگار بررسی کنید.")
      }
      if (data.return?.status === 426) {
        throw new Error("استفاده از این متد نیازمند سرویس پیشرفته می‌باشد")
      }
      if (data.return?.status === 432) {
        throw new Error("پارامتر token در متن الگو پیدا نشد")
      }
      
      throw new Error(errorMessage)
    }

    // استخراج messageId از اولین entry
    const messageId = data.entries?.[0]?.messageid || null

    return {
      success: true,
      messageId: messageId,
      data: data.entries?.[0] || data,
    }
  } catch (error) {
    console.error("Kavenegar OTP send error:", error)
    throw error
  }
}

/**
 * بررسی وضعیت پیامک ارسال شده
 * @param {number|string} messageId - شناسه پیامک
 * @returns {Promise<{success: boolean, status?: number, statusText?: string, data?: any}>}
 */
export async function checkStatus(messageId) {
  const apiKey = process.env.KAVENEGAR_API_KEY

  if (!apiKey) {
    throw new Error("KAVENEGAR_API_KEY not configured in environment variables")
  }

  try {
    const url = `${KAVENEGAR_BASE_URL}/${apiKey}/sms/status.json?messageid=${messageId}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    })

    const data = await response.json()

    if (data.return?.status !== 200) {
      throw new Error(data.return?.message || "خطا در دریافت وضعیت")
    }

    return {
      success: true,
      status: data.entries?.[0]?.status,
      statusText: data.entries?.[0]?.statustext,
      data: data.entries?.[0],
    }
  } catch (error) {
    console.error("Kavenegar status check error:", error)
    throw error
  }
}

/**
 * دریافت اطلاعات حساب کاربری
 * @returns {Promise<{success: boolean, remainCredit?: number, expireDate?: number, type?: string}>}
 */
export async function getAccountInfo() {
  const apiKey = process.env.KAVENEGAR_API_KEY

  if (!apiKey) {
    throw new Error("KAVENEGAR_API_KEY not configured in environment variables")
  }

  try {
    const url = `${KAVENEGAR_BASE_URL}/${apiKey}/account/info.json`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    })

    const data = await response.json()

    if (data.return?.status !== 200) {
      throw new Error(data.return?.message || "خطا در دریافت اطلاعات حساب")
    }

    return {
      success: true,
      remainCredit: data.entries?.remaincredit,
      expireDate: data.entries?.expiredate,
      type: data.entries?.type,
      data: data.entries,
    }
  } catch (error) {
    console.error("Kavenegar account info error:", error)
    throw error
  }
}

