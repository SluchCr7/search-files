"use client";

import React, { useState, useMemo } from "react";
import { MOCK_GAZETTE_ISSUES } from "../data/mockData";
import { GazetteIssue } from "../types";

interface GazetteTimelineProps {
  onOpenDocument: (docId: number) => void;
  onDownloadDoc: (title: string) => void;
  onShowToast: (msg: string) => void;
}

export const GazetteTimeline: React.FC<GazetteTimelineProps> = ({
  onOpenDocument,
  onDownloadDoc,
  onShowToast,
}) => {
  const [isAscending, setIsAscending] = useState(true); // الافتراضي: تصاعدي من الأقدم إلى الأحدث
  const [visibleCount, setVisibleCount] = useState(15);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  // الفرز والتجميع
  const { sortedYears, yearGroups, totalCount } = useMemo(() => {
    const list = [...MOCK_GAZETTE_ISSUES];
    if (isAscending) {
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.number - b.number);
    } else {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.number - a.number);
    }

    const groups: Record<number, GazetteIssue[]> = {};
    list.forEach((item) => {
      if (!groups[item.year]) groups[item.year] = [];
      groups[item.year].push(item);
    });

    const years = Object.keys(groups).map(Number);
    if (isAscending) {
      years.sort((a, b) => a - b);
    } else {
      years.sort((a, b) => b - a);
    }

    return { sortedYears: years, yearGroups: groups, totalCount: list.length };
  }, [isAscending]);

  const uniqueYears = useMemo(() => {
    return Array.from(new Set(MOCK_GAZETTE_ISSUES.map((g) => g.year))).sort((a, b) => a - b);
  }, []);

  const handleToggleOrder = () => {
    const next = !isAscending;
    setIsAscending(next);
    onShowToast(`تم تبديل الترتيب إلى: ${next ? "الأقدم أولاً (الافتراضي)" : "الأحدث أولاً"}`);
  };

  const scrollToYear = (year: number) => {
    setActiveYear(year);
    const el = document.getElementById(`year-header-${year}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  let renderedCount = 0;

  return (
    <section id="gazetteTabPanel">
      <div className="card" id="gazetteTimelineCard">
        {/* البانر العلوي */}
        <div className="bg-gradient-to-r from-[var(--primary)] to-[#202732] text-white p-5 rounded-[var(--radius-md)] mb-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-[1.25rem] font-bold mb-1">
              أعداد الجريدة الرسمية - أرشيف متسلسل
            </h3>
            <p className="text-[0.86rem] text-[#CBD5E1]">
              سلسلة الأعداد التاريخية والحديثة مرتبة تلقائياً{" "}
              <strong>من الأقدم إلى الأحدث</strong> حسب رقم العدد وتاريخ النشر
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleOrder}
            className="flex items-center gap-2 bg-white/12 hover:bg-white/20 transition-colors py-2 px-3.5 rounded-[var(--radius-md)] text-[0.85rem] cursor-pointer"
            id="btnToggleGazetteOrder"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span>
              {isAscending
                ? "الترتيب: الأقدم ← الأحدث (الافتراضي)"
                : "الترتيب: الأحدث ← الأقدم"}
            </span>
          </button>
        </div>

        {/* شريط القفز السريع للسنوات (Year Jump) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3.5 mb-6 border-b border-[var(--border)]">
          <span className="text-[0.85rem] font-bold text-[var(--text-muted)] whitespace-nowrap ml-1.5">
            القفز السريع للسنة:
          </span>
          {uniqueYears.map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => scrollToYear(yr)}
              className={`py-1.5 px-3.5 border rounded-full text-[0.84rem] font-semibold cursor-pointer whitespace-nowrap transition-all duration-150 ${
                activeYear === yr
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "bg-[var(--bg)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--accent)] hover:text-white"
              }`}
            >
              {yr}
            </button>
          ))}
        </div>

        {/* بنية الخط الزمني العمودي (Vertical Timeline) */}
        <div className="relative pr-7.5">
          {/* الخط الرأسي */}
          <div className="absolute top-2.5 bottom-5 right-[11px] w-[2px] bg-[var(--accent)]/35 pointer-events-none" />

          {sortedYears.map((year) => {
            const issuesInYear = yearGroups[year] || [];
            return (
              <div key={year} className="mb-7.5 relative">
                {/* رأس السنة */}
                <div
                  id={`year-header-${year}`}
                  className="sticky top-[75px] z-10 inline-flex items-center gap-2 bg-[var(--primary)] text-white py-1.5 px-4 rounded-full text-[0.88rem] font-bold mb-4 shadow-sm translate-x-2.5"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>
                    أعداد عام {year} ({issuesInYear.length} أعداد)
                  </span>
                </div>

                {/* أعداد السنة */}
                {issuesInYear.map((item) => {
                  if (renderedCount >= visibleCount) return null;
                  renderedCount++;

                  return (
                    <div key={item.id} className="relative mb-4.5">
                      {/* العقدة الدائرية في الخط الزمني */}
                      <div className="absolute -right-[23px] top-4.5 w-3.5 h-3.5 rounded-full bg-[var(--surface)] border-[3px] border-[var(--accent)] z-2" />

                      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap hover:border-[var(--accent)] hover:shadow-sm transition-all duration-150">
                        <div className="flex items-center gap-3.5 flex-wrap">
                          <span className="text-[1.1rem] font-extrabold text-[var(--primary)] inline-flex items-center gap-1.5">
                            <span>العدد:</span>
                            <span className="text-[var(--accent)]">{item.number}</span>
                          </span>

                          <div className="flex items-center gap-5 flex-wrap text-[var(--text-muted)] text-[0.88rem]">
                            <span>📅 {item.date}</span>
                            <span>📄 {item.pages} صفحة</span>
                            <span className="font-medium text-[var(--text)]">
                              {item.title}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenDocument(item.id)}
                            className="btn btn-secondary btn-sm"
                          >
                            👁️ عرض العدد
                          </button>
                          <button
                            type="button"
                            onClick={() => onDownloadDoc(`عدد الجريدة الرسمية رقم ${item.number}`)}
                            className="btn btn-primary btn-sm"
                          >
                            📥 تحميل
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* زر تحميل المزيد */}
        {visibleCount < totalCount && (
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => {
                setVisibleCount((prev) => prev + 15);
                onShowToast("تم تحميل المزيد من أعداد الجريدة الرسمية");
              }}
              className="btn btn-secondary"
              id="btnLoadMoreGazettes"
            >
              <span>عرض المزيد من الأعداد</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
