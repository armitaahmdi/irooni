"use client";

/**
 * AccountSection Component
 * Account information form
 */
export default function AccountSection({
  user,
  accountForm,
  setAccountForm,
  isSaving,
  onSave,
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#286378] mb-6">اطلاعات حساب</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            شماره موبایل
          </label>
          <input
            type="text"
            value={user?.phone || ""}
            disabled
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نام
          </label>
          <input
            type="text"
            placeholder="نام خود را وارد کنید"
            value={accountForm.name}
            onChange={(e) =>
              setAccountForm({ ...accountForm, name: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#286378] focus:ring-4 focus:ring-[#A2CFFF]/25 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ایمیل
          </label>
          <input
            type="email"
            placeholder="ایمیل خود را وارد کنید"
            value={accountForm.email}
            onChange={(e) =>
              setAccountForm({ ...accountForm, email: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#286378] focus:ring-4 focus:ring-[#A2CFFF]/25 outline-none transition-all"
          />
        </div>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-6 py-3 bg-gradient-to-r from-[#286378] to-[#43909A] text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>در حال ذخیره...</span>
            </>
          ) : (
            <span>ذخیره تغییرات</span>
          )}
        </button>
      </div>
    </div>
  );
}

