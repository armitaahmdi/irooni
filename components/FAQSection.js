"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "زمان تحویل سفارش چقدر است و ارسال چگونه انجام می‌شود؟",
      gradient: "from-blue-50 to-blue-100/50",
      borderColor: "border-blue-200/60",
      iconColor: "text-blue-600",
      answer: (
        <div className="space-y-3">
          <p>
            زمان تحویل سفارش بسته به شهر و نوع ارسال متفاوت است، اما معمولاً بین ۱ تا ۳ روز کاری طول می‌کشد.
          </p>
          <p>
            سفارش‌ها پس از ثبت، حداکثر تا ۲۴ ساعت پردازش و توسط پیک یا پست ارسال می‌شوند.
          </p>
          <p>
            در هنگام ارسال، کد رهگیری برای شما پیامک می‌شود تا بتوانید وضعیت مرسوله را پیگیری کنید.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      question: "آیا امکان بازگشت و مرجوع کردن کالا وجود دارد؟ شرایط آن چیست؟",
      gradient: "from-green-50 to-green-100/50",
      borderColor: "border-green-200/60",
      iconColor: "text-green-600",
      answer: (
        <div className="space-y-3">
          <p>
            بله، شما می‌توانید تا ۷ روز پس از دریافت کالا درخواست مرجوعی ثبت کنید.
          </p>
          <p className="font-semibold text-gray-800">مرجوعی شامل موارد زیر می‌شود:</p>
          <ul className="list-disc list-inside space-y-2 mr-4 text-gray-700">
            <li>مغایرت کالا با عکس یا توضیحات</li>
            <li>آسیب‌دیدگی در هنگام ارسال</li>
            <li>غیر اصل بودن یا نقص فنی</li>
          </ul>
          <p>
            برای ثبت درخواست، کافی است از طریق پشتیبانی واتساپ یا پنل کاربری اقدام کنید.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      question: "روش‌های پرداخت چگونه است و آیا پرداخت در محل دارید؟",
      gradient: "from-purple-50 to-purple-100/50",
      borderColor: "border-purple-200/60",
      iconColor: "text-purple-600",
      answer: (
        <div className="space-y-3">
          <p className="font-semibold text-gray-800">شما می‌توانید پرداخت خود را از طریق روش‌های زیر انجام دهید:</p>
          <ul className="list-disc list-inside space-y-2 mr-4 text-gray-700">
            <li>پرداخت آنلاین با تمام کارت‌های عضو شتاب</li>
            <li>پرداخت در محل (برای برخی شهرها فعال است)</li>
            <li>پرداخت با کیف پول در صورت عضویت در سایت</li>
          </ul>
          <p>
            پرداخت آنلاین کاملاً امن است و از درگاه‌های معتبر بانکی استفاده می‌کنیم.
          </p>
        </div>
      ),
    },
    {
      id: 4,
      question: "چگونه از اصل بودن و کیفیت کالا مطمئن باشم؟",
      gradient: "from-orange-50 to-orange-100/50",
      borderColor: "border-orange-200/60",
      iconColor: "text-orange-600",
      answer: (
        <div className="space-y-3">
          <p>
            تمام کالاهای موجود در فروشگاه دارای ضمانت اصالت و عدم مغایرت هستند.
          </p>
          <p className="font-semibold text-gray-800">این یعنی:</p>
          <ul className="list-disc list-inside space-y-2 mr-4 text-gray-700">
            <li>کالای دریافت‌شده دقیقاً مطابق عکس و توضیحات است</li>
            <li>بسته‌بندی استاندارد و سالم ارسال می‌شود</li>
            <li>در صورت هرگونه مغایرت، امکان مرجوعی رایگان وجود دارد</li>
          </ul>
          <p>
            ما کیفیت محصولات را قبل از ارسال به‌صورت کامل بررسی می‌کنیم.
          </p>
        </div>
      ),
    },
    {
      id: 5,
      question: "هزینه ارسال سفارش چقدر است؟ آیا ارسال رایگان دارید؟",
      gradient: "from-teal-50 to-teal-100/50",
      borderColor: "border-teal-200/60",
      iconColor: "text-teal-600",
      answer: (
        <div className="space-y-3">
          <p>
            هزینه ارسال بسته به مقصد و وزن کالا متفاوت است.
          </p>
          <p className="font-semibold text-gray-800">
            اما برای خریدهای بیش از ۳ میلیون تومان، ارسال کاملاً رایگان خواهد بود.
          </p>
          <p>
            برای خریدهای کمتر، هزینه ارسال هنگام نهایی‌سازی سفارش به شما نمایش داده می‌شود.
          </p>
        </div>
      ),
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* عنوان بخش */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12">
          <div className="flex-1 h-px bg-gray-300 hidden sm:block"></div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#286378]/10 to-[#43909A]/10 rounded-xl flex items-center justify-center border border-[#286378]/20">
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#286378]" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-[#286378] tracking-tight">
              سوالات متداول
            </h2>
          </div>
          <div className="flex-1 h-px bg-gray-300 hidden sm:block"></div>
        </div>

        {/* لیست سوالات */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`group relative bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 border-2 ${faq.borderColor} hover:border-opacity-80 overflow-hidden`}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${faq.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0`}
              ></div>

              {/* سوال */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-right gap-3 sm:gap-4 hover:bg-transparent transition-colors duration-200 relative z-10"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 bg-gradient-to-br ${faq.gradient} rounded-xl flex items-center justify-center border ${faq.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                    <span className={`text-sm sm:text-base font-bold ${faq.iconColor}`}>
                      {index + 1}
                    </span>
                  </div>
                  <span className="flex-1 text-sm sm:text-base md:text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-[#286378] flex-shrink-0 transition-all duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* جواب */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className={`px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 text-gray-700 text-sm sm:text-base leading-relaxed border-t ${faq.borderColor} relative z-10`}>
                  <div className={`bg-gradient-to-br ${faq.gradient} rounded-xl p-4 sm:p-5 -mx-2 sm:-mx-3 mt-2 sm:mt-0`}>
                    {faq.answer}
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-white/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
