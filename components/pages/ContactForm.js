"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

/**
 * ContactForm Component
 * Reusable contact form component
 */
export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-100 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#286378]/5 to-[#43909A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-[#286378]/5 to-[#43909A]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#286378] to-[#43909A] rounded-xl flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">ارسال پیام</h2>
          </div>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#286378] to-[#43909A] rounded-full"></div>
          <p className="text-gray-600 mt-4">فرم زیر را پر کنید و ما در اسرع وقت با شما تماس خواهیم گرفت.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
              نام و نام خانوادگی <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#286378] focus:border-[#286378] transition-all bg-gray-50 focus:bg-white"
              placeholder="نام خود را وارد کنید"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                شماره تماس <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#286378] focus:border-[#286378] transition-all bg-gray-50 focus:bg-white"
                placeholder="09123456789"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                ایمیل <span className="text-gray-400 text-xs">(اختیاری)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#286378] focus:border-[#286378] transition-all bg-gray-50 focus:bg-white"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
              موضوع <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#286378] focus:border-[#286378] transition-all bg-gray-50 focus:bg-white"
              placeholder="موضوع پیام خود را وارد کنید"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
              پیام <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#286378] focus:border-[#286378] transition-all resize-none bg-gray-50 focus:bg-white"
              placeholder="پیام خود را اینجا بنویسید..."
            />
          </div>

          {submitStatus === "success" && (
            <div className="bg-green-50 border-2 border-green-200 text-green-800 px-5 py-4 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">پیام شما با موفقیت ارسال شد!</p>
                <p className="text-sm mt-1">در اسرع وقت با شما تماس خواهیم گرفت.</p>
              </div>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 px-5 py-4 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">خطا در ارسال پیام</p>
                <p className="text-sm mt-1">لطفاً دوباره تلاش کنید.</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#286378] to-[#43909A] text-white font-bold py-4 px-6 rounded-xl hover:from-[#43909A] hover:to-[#286378] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                در حال ارسال...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                ارسال پیام
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

