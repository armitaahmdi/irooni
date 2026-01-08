#!/bin/bash

# اسکریپت راه‌اندازی دیتابیس PostgreSQL برای پروژه ایرونی

echo "🚀 شروع راه‌اندازی دیتابیس PostgreSQL..."
echo ""

# بررسی نصب PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL نصب نیست!"
    echo "لطفا ابتدا PostgreSQL را نصب کنید:"
    echo "sudo apt update && sudo apt install postgresql postgresql-contrib"
    exit 1
fi

echo "✅ PostgreSQL نصب است"

# بررسی اجرای سرویس
if ! sudo systemctl is-active --quiet postgresql; then
    echo "⚠️  سرویس PostgreSQL در حال اجرا نیست. در حال راه‌اندازی..."
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

echo "✅ سرویس PostgreSQL در حال اجرا است"
echo ""

# ایجاد دیتابیس
DB_NAME="irooni"
DB_USER="irooni_user"
DB_PASSWORD="irooni_pass_2024"

echo "📦 در حال ایجاد دیتابیس '$DB_NAME'..."

# ایجاد کاربر و دیتابیس
sudo -u postgres psql <<EOF
-- حذف دیتابیس و کاربر در صورت وجود (اختیاری)
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS $DB_USER;

-- ایجاد کاربر
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- ایجاد دیتابیس
CREATE DATABASE $DB_NAME OWNER $DB_USER;

-- اعطای دسترسی
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;

\q
EOF

if [ $? -eq 0 ]; then
    echo "✅ دیتابیس '$DB_NAME' با موفقیت ایجاد شد"
    echo ""
    echo "📝 اطلاعات اتصال:"
    echo "   دیتابیس: $DB_NAME"
    echo "   کاربر: $DB_USER"
    echo "   رمز عبور: $DB_PASSWORD"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo ""
    echo "🔗 DATABASE_URL:"
    echo "postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public"
    echo ""
    echo "✅ راه‌اندازی کامل شد!"
    echo ""
    echo "💡 حالا باید فایل .env را با DATABASE_URL بالا به‌روزرسانی کنید"
else
    echo "❌ خطا در ایجاد دیتابیس"
    exit 1
fi

