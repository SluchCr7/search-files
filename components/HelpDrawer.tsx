"use client";

import React, { useState } from "react";

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset: (keyword: string, dbName: string, fromYear?: number, toYear?: number) => void;
  onSwitchToGazette: () => void;
  onStartTour: () => void;
}

export const HelpDrawer: React.FC<HelpDrawerProps> = ({
  isOpen,
  onClose,
  onApplyPreset,
  onSwitchToGazette,
  onStartTour,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "كيف يمكنني تحميل نصوص التشريعات بصيغة PDF؟",
      a: "يمكنك الضغط على زر 'تحميل' المتوفر في بطاقة كل نتيجة، أو الضغط على 'عرض' للاطلاع على الوثيقة كاملة ثم النقر على زر تحميل أو طباعة الوثيقة.",
    },
    {
      q: "ما الفرق بين البحث البسيط والبحث المتقدم؟",
      a: "البحث البسيط يتيح لك البحث السريع بالكلمات عبر قواعد البيانات المحددة. بينما يتيح البحث المتقدم بناء معادلات شرطية دقيقة بتحديد الحقول (العنوان، النص، الأطراف) وتطبيق الروابط المنطقية (و / أو / ليس).",
    },
    {
      q: "كيف أصل لعدد معين من الجريدة الرسمية؟",
      a: "يمكنك كتابة رقم العدد في خانة البحث مع تحديد قاعدة 'عدد الجريدة الرسمية'، أو الانتقال إلى تبويب 'أعداد الجريدة الرسمية' واستخدام شريط قفز السنوات للوصول للعدد وتاريخه مباشرة.",
    },
    {
      q: "هل يتم حفظ الوثائق المفضلة بين الجلسات؟",
      a: "نعم، يتم حفظ قائمة مفضلاتك محلياً في متصفحك، ويمكنك الوصول إليها بالنقر على أيقونة المفضلة أعلى الصفحة في أي وقت.",
    },
    {
      q: "كيف يعمل ترتيب أعداد الجريدة الرسمية؟",
      a: "النظام يعتمد الترتيب التصاعدي المنطقي (من الأقدم إلى الأحدث تاريخاً ورقماً) كخيار افتراضي ليسهل تتبع تطور القوانين، مع إمكانية التبديل إلى الأحدث بنقرة زر.",
    },
  ];

  return (
    <>
      {/* خلفية معتمة */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-900/50 z-50 transition-all duration-300 backdrop-blur-xs ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      />

      {/* لوحة Drawer منزلقة من اليسار */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-[520px] max-w-[90vw] bg-[var(--surface)] z-50 shadow-2xl flex flex-col transition-transform duration-350 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="لوحة مساعدة الباحث"
      >
        <div className="p-5 sm:p-6 bg-[var(--primary)] text-white flex items-center justify-between">
          <div className="text-[1.15rem] font-bold flex items-center gap-2.5">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>دليل ومساعدة الباحث القانوني</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-full cursor-pointer hover:bg-white/10 transition-colors"
            aria-label="إغلاق اللوحة"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {/* زر الجولة التعريفية */}
          <div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartTour();
              }}
              className="w-full py-3.5 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white border-0 rounded-[var(--radius-md)] text-[0.96rem] font-bold cursor-pointer flex items-center justify-center gap-2.5 shadow-sm transition-all duration-150"
              id="btnStartInteractiveTour"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>ابدأ الجولة التعريفية التفاعلية</span>
            </button>
          </div>

          {/* 1. دليل سريع */}
          <div>
            <h3 className="text-[1.02rem] font-bold text-[var(--primary)] mb-3 flex items-center gap-2 border-b-2 border-[var(--accent-soft)] pb-1.5">
              <span>1. الدليل السريع للبحث (خطوات مرقمة)</span>
            </h3>
            <ol className="flex flex-col gap-2.5 list-none">
              <li className="flex gap-3 bg-[var(--bg)] p-3 rounded-[var(--radius-md)] border-r-3 border-[var(--accent)] text-[0.88rem]">
                <span className="font-extrabold text-[var(--accent)] text-base">١</span>
                <div>
                  <strong>حدد قواعد البيانات:</strong> اختر قاعدة بيانات واحدة أو أكثر من الشرائح المتاحة (مثل الجريدة الرسمية أو الاتفاقيات).
                </div>
              </li>
              <li className="flex gap-3 bg-[var(--bg)] p-3 rounded-[var(--radius-md)] border-r-3 border-[var(--accent)] text-[0.88rem]">
                <span className="font-extrabold text-[var(--accent)] text-base">٢</span>
                <div>
                  <strong>أدخل الكلمات المفتاحية:</strong> اكتب كلمات دقيقة مثل &quot;قانون العمل&quot;، أو رقم الوثيقة، أو اسم الطرف المتعاقد.
                </div>
              </li>
              <li className="flex gap-3 bg-[var(--bg)] p-3 rounded-[var(--radius-md)] border-r-3 border-[var(--accent)] text-[0.88rem]">
                <span className="font-extrabold text-[var(--accent)] text-base">٣</span>
                <div>
                  <strong>البحث المتقدم للعمليات المركبة:</strong> استخدم معايير المطابقة وروابط (و / أو / ليس) لتخصيص الشروط وحصر النتائج بدقة.
                </div>
              </li>
              <li className="flex gap-3 bg-[var(--bg)] p-3 rounded-[var(--radius-md)] border-r-3 border-[var(--accent)] text-[0.88rem]">
                <span className="font-extrabold text-[var(--accent)] text-base">٤</span>
                <div>
                  <strong>استعراض وتنزيل الوثائق:</strong> اضغط &quot;عرض&quot; لقراءة النص الأصلي الكامل، أو &quot;تحميل&quot; أو حفظها في &quot;المفضلة&quot;.
                </div>
              </li>
            </ol>
          </div>

          {/* 2. شرح معايير البحث والروابط المنطقية */}
          <div>
            <h3 className="text-[1.02rem] font-bold text-[var(--primary)] mb-3 flex items-center gap-2 border-b-2 border-[var(--accent-soft)] pb-1.5">
              <span>2. شرح معايير البحث والروابط المنطقية</span>
            </h3>
            <table className="w-full border-collapse text-[0.84rem] mt-2">
              <thead>
                <tr className="bg-[var(--accent-soft)] text-[var(--primary)] font-bold">
                  <th className="border border-[var(--border)] p-2">المعيار</th>
                  <th className="border border-[var(--border)] p-2">المعنى والتطبيق</th>
                  <th className="border border-[var(--border)] p-2">مثال عملي</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[var(--border)] p-2 font-bold">يحتوي</td>
                  <td className="border border-[var(--border)] p-2">يجد أي وثيقة تشتمل على الكلمة في أي موقع</td>
                  <td className="border border-[var(--border)] p-2">&quot;ضريبة&quot; تجد قانون ضريبة الدخل وتعديلاته</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] p-2 font-bold">يساوي</td>
                  <td className="border border-[var(--border)] p-2">مطابقة تامة وكاملة للنص دون زيادة أو نقصان</td>
                  <td className="border border-[var(--border)] p-2">رقم الوثيقة &quot;2005/14&quot; بالتمام</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] p-2 font-bold">يبدأ بـ</td>
                  <td className="border border-[var(--border)] p-2">يجد الوثائق التي تبدأ عبارتها بالحروف المحددة</td>
                  <td className="border border-[var(--border)] p-2">&quot;اتفاقية&quot; تجد اتفاقية التجارة الحرة</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] p-2 font-bold">ينتهي بـ</td>
                  <td className="border border-[var(--border)] p-2">يجد الوثائق المنتهية بلفظ معين</td>
                  <td className="border border-[var(--border)] p-2">&quot;المساهمة المحدودة&quot; في أسماء الشركات</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] p-2 font-bold">و (AND)</td>
                  <td className="border border-[var(--border)] p-2">اشتراط تحقق كافة الكلمات والبنود معاً</td>
                  <td className="border border-[var(--border)] p-2">&quot;الاستثمار&quot; و &quot;الصناعة&quot; معاً</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] p-2 font-bold">أو (OR)</td>
                  <td className="border border-[var(--border)] p-2">يكفي تحقق أحد الشرطين لإظهار النتيجة</td>
                  <td className="border border-[var(--border)] p-2">&quot;مرسوم&quot; أو &quot;إرادة ملكية&quot;</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] p-2 font-bold">ليس (NOT)</td>
                  <td className="border border-[var(--border)] p-2">استبعاد تام لأي وثيقة تحتوي على اللفظ المستثنى</td>
                  <td className="border border-[var(--border)] p-2">&quot;الشركات&quot; ليس &quot;الملغاة&quot;</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 3. نصائح للبحث الفعال */}
          <div>
            <h3 className="text-[1.02rem] font-bold text-[var(--primary)] mb-3 flex items-center gap-2 border-b-2 border-[var(--accent-soft)] pb-1.5">
              <span>3. نصائح ذهبية للباحث</span>
            </h3>
            <ul className="pr-5 text-[0.86rem] text-[#4A5568] flex flex-col gap-2 list-disc">
              <li>
                <strong>الكلمات المفتاحية القصيرة:</strong> يفضل البحث بأصل الكلمة أو الاسم المجرد (مثال: &quot;جمارك&quot; بدلاً من &quot;إجراءات التخليص الجمركي المعتمدة&quot;).
              </li>
              <li>
                <strong>مراعاة الهمزات والألفاظ البديلة:</strong> جرب الكلمة مع الهمزة وبدونها (&quot;الأردن&quot; و &quot;الاردن&quot;)، أو التاء المربوطة والهاء.
              </li>
              <li>
                <strong>تحديد النطاق الزمني:</strong> تضييق البحث بسنة صدور القرار أو نطاق زمني (مثلاً 2010 إلى 2020) يسرع وصولك للنص النهائي.
              </li>
              <li>
                <strong>أعداد الجريدة الرسمية المتسلسلة:</strong> انتقل لتبويب الجريدة الرسمية لتصفح الأعداد من الأقدم للأحدث مع فواصل السنوات.
              </li>
            </ul>
          </div>

          {/* 4. أمثلة بحث جاهزة قابلة للنقر */}
          <div>
            <h3 className="text-[1.02rem] font-bold text-[var(--primary)] mb-3 flex items-center gap-2 border-b-2 border-[var(--accent-soft)] pb-1.5">
              <span>4. أمثلة بحث جاهزة (اضغط للتطبيق الفوري)</span>
            </h3>

            <div
              onClick={() => onApplyPreset("اتفاقية", "الاتفاقيات الثقافية", 2010, 2020)}
              className="bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-md)] p-3 mb-2 cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all duration-150 flex flex-col gap-1"
            >
              <div className="font-bold text-[var(--accent)] text-[0.9rem] flex items-center justify-between">
                <span>اتفاقيات التبادل الثقافي (2010 - 2020)</span>
                <span className="text-[0.75rem]">تطبيق ❯</span>
              </div>
              <div className="text-[0.8rem] text-[var(--text-muted)]">
                يبحث عن كلمة &quot;اتفاقية&quot; في قاعدة الاتفاقيات الثقافية بين 2010 و 2020.
              </div>
            </div>

            <div
              onClick={() => onApplyPreset("قانون الشركات", "وثائق حكومية")}
              className="bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-md)] p-3 mb-2 cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all duration-150 flex flex-col gap-1"
            >
              <div className="font-bold text-[var(--accent)] text-[0.9rem] flex items-center justify-between">
                <span>قانون الشركات والأنظمة المرتبطة</span>
                <span className="text-[0.75rem]">تطبيق ❯</span>
              </div>
              <div className="text-[0.8rem] text-[var(--text-muted)]">
                يبحث عن تشريعات وقوانين الشركات في قاعدة الوثائق الحكومية.
              </div>
            </div>

            <div
              onClick={() => onApplyPreset("خطاب العرش السامي", "خطابات الملك عبد الله الثاني ابن الحسين")}
              className="bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-md)] p-3 mb-2 cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all duration-150 flex flex-col gap-1"
            >
              <div className="font-bold text-[var(--accent)] text-[0.9rem] flex items-center justify-between">
                <span>خطابات العرش السامي في افتتاح مجلس الأمة</span>
                <span className="text-[0.75rem]">تطبيق ❯</span>
              </div>
              <div className="text-[0.8rem] text-[var(--text-muted)]">
                يبحث في خطابات جلالة الملك عبد الله الثاني ابن الحسين.
              </div>
            </div>

            <div
              onClick={onSwitchToGazette}
              className="bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-md)] p-3 mb-2 cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all duration-150 flex flex-col gap-1"
            >
              <div className="font-bold text-[var(--accent)] text-[0.9rem] flex items-center justify-between">
                <span>تصفح أعداد الجريدة الرسمية لعام 2005 تصاعدياً</span>
                <span className="text-[0.75rem]">انتقال ❯</span>
              </div>
              <div className="text-[0.8rem] text-[var(--text-muted)]">
                ينقلك مباشرة للخط الزمني مع ترتيب تصاعدي من العدد 4800.
              </div>
            </div>
          </div>

          {/* 5. الأسئلة الشائعة */}
          <div>
            <h3 className="text-[1.02rem] font-bold text-[var(--primary)] mb-3 flex items-center gap-2 border-b-2 border-[var(--accent-soft)] pb-1.5">
              <span>5. الأسئلة الشائعة (FAQ)</span>
            </h3>
            <div className="flex flex-col gap-2">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-[var(--border)] rounded-[var(--radius-md)] overflow-hidden"
                >
                  <div
                    onClick={() => toggleFaq(idx)}
                    className="p-3 sm:p-4 bg-[var(--surface)] hover:bg-[var(--bg)] font-semibold text-[0.9rem] cursor-pointer flex items-center justify-between select-none"
                  >
                    <span className={activeFaq === idx ? "text-[var(--accent)] font-bold" : ""}>
                      {faq.q}
                    </span>
                    <span className="text-sm">{activeFaq === idx ? "▴" : "▾"}</span>
                  </div>
                  {activeFaq === idx && (
                    <div className="p-3 sm:p-4 text-[0.85rem] text-[#4A5568] bg-[#FAFCFE] border-t border-[var(--border)] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
