"use client";

import { CreditCard, Package, Truck, CheckCircle2 } from "lucide-react";

/**
 * OrderProgressStepper Component
 * Displays order progress with steps
 */
export default function OrderProgressStepper({ status, paymentStatus }) {
  const firstStepLabel = paymentStatus === "unpaid" ? "در انتظار پرداخت" : "تأیید سفارش";

  const steps = [
    {
      key: "payment",
      label: firstStepLabel,
      icon: CreditCard,
      orderIndex: 0,
    },
    {
      key: "processing",
      label: "در حال پردازش",
      icon: Package,
      orderIndex: 1,
    },
    {
      key: "shipped",
      label: "ارسال شده",
      icon: Truck,
      orderIndex: 2,
    },
    {
      key: "delivered",
      label: "تحویل داده شده",
      icon: CheckCircle2,
      orderIndex: 3,
    },
  ];

  const getCurrentStepIndex = () => {
    if (paymentStatus === "unpaid") return 0;
    if (status === "pending" && paymentStatus === "paid") return 0;
    if (status === "processing") return 1;
    if (status === "shipped") return 2;
    if (status === "delivered") return 3;
    return 0;
  };

  const getStepStatus = (step) => {
    if (status === "cancelled") return "cancelled";

    const currentIndex = getCurrentStepIndex();
    const stepIndex = step.orderIndex;

    if (paymentStatus === "unpaid") {
      return stepIndex === 0 ? "active" : "pending";
    }

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  const getProgressPercentage = () => {
    if (paymentStatus === "unpaid") return 0;
    const currentIndex = getCurrentStepIndex();
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">وضعیت سفارش</h3>
      <div className="flex items-center justify-between relative">
        {/* Connecting Lines */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0">
          <div
            className="h-full bg-[#286378] transition-all duration-500"
            style={{
              width: `${getProgressPercentage()}%`,
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step) => {
          const stepStatus = getStepStatus(step);
          const StepIcon = step.icon;
          const isCompleted = stepStatus === "completed";
          const isActive = stepStatus === "active";
          const isCancelled = stepStatus === "cancelled";

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCancelled
                    ? "bg-red-100 border-2 border-red-300"
                    : isCompleted
                    ? "bg-[#286378] border-2 border-[#286378] shadow-lg"
                    : isActive
                    ? "bg-[#286378] border-2 border-[#286378] shadow-lg ring-4 ring-[#286378]/20"
                    : "bg-gray-100 border-2 border-gray-300"
                }`}
              >
                <StepIcon
                  className={`w-6 h-6 transition-colors duration-300 ${
                    isCancelled
                      ? "text-red-600"
                      : isCompleted || isActive
                      ? "text-white"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <p
                className={`mt-3 text-xs font-medium text-center max-w-[80px] transition-colors duration-300 ${
                  isCancelled
                    ? "text-red-600"
                    : isCompleted || isActive
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

