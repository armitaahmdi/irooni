module.exports = {
  apps: [
    {
      name: "irooni",
      script: "node",
      args: ".next/standalone/server.js",
      // نکته: PM2 به صورت خودکار فایل .env را می‌خواند (اگر dotenv نصب باشد)
      // اما برای اطمینان، می‌توانید environment variables را مستقیماً در اینجا تنظیم کنید
      // یا از pm2 start ecosystem.config.js --update-env استفاده کنید
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
        // متغیرهای پایه - مقادیر واقعی باید در .env تنظیم شوند
        DATABASE_URL: "postgresql://myproject_user:securepassword@localhost:5432/myproject",
        // آدرس پایه وب‌سایت (بدون اسلش انتهایی)
        NEXT_PUBLIC_BASE_URL: "https://irooni-men.ir",
        // آدرس پایه API - خالی بگذارید تا از مسیرهای نسبی استفاده شود
        // اگر تنظیم شود، نباید /api در انتها داشته باشد
        NEXT_PUBLIC_API_URL: "",
        // Secret key برای NextAuth - باید در .env تنظیم شود
        // برای تولید: openssl rand -base64 32
        AUTH_SECRET: "CHANGE_THIS_IN_ENV_FILE",
        // تنظیمات دیتابیس (اختیاری - پیش‌فرض‌ها)
        DATABASE_POOL_MAX: "30",
        DATABASE_POOL_MIN: "10",
        // سطح logging
        LOG_LEVEL: "info",
        // تنظیمات Kavenegar برای ارسال SMS و OTP
        KAVENEGAR_API_KEY: "",
        KAVENEGAR_TEMPLATE_NAME: "",
        KAVENEGAR_SENDER: "",
        NEXT_PUBLIC_NESHAN_API_KEY: "",
        NEXT_PUBLIC_SENTRY_DSN: "",
      },
    },
  ],
};

