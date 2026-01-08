"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Set page title
    document.title = "ثبت نام | پوشاک ایرونی";
    // Redirect به صفحه login (ثبت‌نام و ورود یکسان هستند)
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">در حال انتقال...</p>
      </div>
    </div>
  );
}
