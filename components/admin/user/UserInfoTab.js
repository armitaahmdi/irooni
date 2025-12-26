"use client";

import { User, Mail, Smartphone, Shield, Calendar } from "lucide-react";
import { formatDate } from "@/utils/reviewHelpers";

/**
 * UserInfoTab Component
 * User information tab content
 */
export default function UserInfoTab({ user }) {
  return (
    <div className="space-y-6">
      {/* اطلاعات اصلی */}
      <div className="bg-gradient-to-br from-[#A2CFFF]/20 to-[#A2CFFF]/10 rounded-xl p-6 border border-[#A2CFFF]/30">
        <h3 className="text-lg font-bold text-[#286378] mb-4">اطلاعات اصلی</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-[#286378] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">شماره موبایل</p>
              <p className="font-medium text-gray-900">{user.phone}</p>
            </div>
          </div>
          {user.name && (
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-[#286378] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">نام</p>
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>
            </div>
          )}
          {user.email && (
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#286378] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">ایمیل</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#286378] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">نقش</p>
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {user.role === "admin" ? "مدیر" : "کاربر"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* اطلاعات زمانی */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">اطلاعات زمانی</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">تاریخ ثبت‌نام</p>
              <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">آخرین به‌روزرسانی</p>
              <p className="font-medium text-gray-900">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

