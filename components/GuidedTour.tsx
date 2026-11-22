"use client";

import React, { useEffect, useState } from "react";
import { TourStep } from "../types";

interface GuidedTourProps {
  isActive: boolean;
  onFinish: () => void;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: "mainTabsNav",
    title: "تبويبات البحث الرئيسية",
    content: "يمكنك التبديل بسهولة بين البحث البسيط، والبحث المتقدم ذي الشروط المتعددة، أو تصفح أعداد الجريدة الرسمية المتسلسلة زمنياً.",
  },
  {
    targetId: "simpleSearchCard",
    title: "اختيار قواعد البيانات",
    content: "اختر واحدة أو أكثر من قواعد البيانات الـ 14 المتاحة عبر النقر على الشرائح (Chips). لن يتفعل زر البحث إلا بعد تحديد قاعدة بيانات واحدة على الأقل.",
  },
  {
    targetId: "simpleSearchInput",
    title: "حقل البحث الذكي",
    content: "اكتب كلمات البحث، أو رقم الوثيقة أو السنة، ثم اضغط Enter أو زر 'بحث' لاستخراج النتائج المباشرة.",
  },
  {
    targetId: "searchResultsSection",
    title: "شاشة نتائج البحث",
    content: "تعرض النتائج مع مقتطفات ملونة للكلمات المطابقة، وخيارات الفرز، وأزرار العرض الكامل والتحميل والحفظ في المفضلة.",
  },
  {
    targetId: "fabOpenHelp",
    title: "زر مساعدة الباحث الدائم",
    content: "في أي وقت، اضغط على زر 'مساعدة الباحث' العائم للحصول على أمثلة جاهزة، وشرح العمليات المنطقية، والأسئلة الشائعة.",
  },
];

export const GuidedTour: React.FC<GuidedTourProps> = ({ isActive, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stylePos, setStylePos] = useState<{
    spotTop: number;
    spotLeft: number;
    spotWidth: number;
    spotHeight: number;
    tipTop: number;
    tipLeft: number;
  } | null>(null);

  useEffect(() => {
    if (!isActive) {
      setStylePos(null);
      return;
    }

    const step = TOUR_STEPS[currentStep];
    const target = document.getElementById(step.targetId);

    if (!target) {
      onFinish();
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "center" });

    const timer = setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      let tipTop = rect.bottom + scrollTop + 14;
      let tipLeft = rect.left + scrollLeft + rect.width / 2 - 160;

      if (tipLeft < 10) tipLeft = 10;
      if (tipLeft + 320 > window.innerWidth) tipLeft = window.innerWidth - 330;
      if (tipTop + 180 > scrollTop + window.innerHeight) {
        tipTop = rect.top + scrollTop - 180;
      }

      setStylePos({
        spotTop: rect.top + scrollTop - 6,
        spotLeft: rect.left + scrollLeft - 6,
        spotWidth: rect.width + 12,
        spotHeight: rect.height + 12,
        tipTop,
        tipLeft,
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [isActive, currentStep, onFinish]);

  if (!isActive || !stylePos) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <>
      {/* الضوء المسلط (Spotlight) */}
      <div
        className="absolute rounded-[var(--radius-md)] pointer-events-none transition-all duration-300"
        style={{
          boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.7)",
          top: `${stylePos.spotTop}px`,
          left: `${stylePos.spotLeft}px`,
          width: `${stylePos.spotWidth}px`,
          height: `${stylePos.spotHeight}px`,
          zIndex: 999,
        }}
      />

      {/* صندوق الشرح التوضيحي (Tooltip Card) */}
      <div
        className="absolute z-[1000] bg-[var(--surface)] rounded-[var(--radius-lg)] p-5 w-[320px] shadow-2xl border border-[var(--border)] flex flex-col gap-3"
        style={{
          top: `${stylePos.tipTop}px`,
          left: `${stylePos.tipLeft}px`,
        }}
      >
        <div className="font-bold text-[var(--primary)] text-base">
          {step.title}
        </div>
        <div className="text-[0.88rem] text-[var(--text-muted)] leading-relaxed">
          {step.content}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[0.8rem] text-[var(--accent)] font-bold">
            {currentStep + 1} من {TOUR_STEPS.length}
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="btn btn-secondary btn-sm text-[0.78rem] px-2 py-1 disabled:opacity-40"
            >
              السابق
            </button>
            <button
              type="button"
              onClick={() => {
                if (currentStep < TOUR_STEPS.length - 1) {
                  setCurrentStep((prev) => prev + 1);
                } else {
                  onFinish();
                }
              }}
              className="btn btn-primary btn-sm text-[0.78rem] px-2.5 py-1"
            >
              {currentStep === TOUR_STEPS.length - 1 ? "إنهاء" : "التالي ❯"}
            </button>
            <button
              type="button"
              onClick={onFinish}
              className="btn btn-secondary btn-sm text-[0.78rem] px-2 py-1"
            >
              خروج
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
