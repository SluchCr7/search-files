"use client";

import React from "react";
import { DocumentRecord, SortOption } from "../types";

interface SearchResultsProps {
  results: DocumentRecord[];
  appliedDbFilters: string[];
  appliedCriteriaTitles: { id: number; text: string }[];
  searchKeyword: string;
  sortBy: SortOption;
  currentPage: number;
  itemsPerPage: number;
  favorites: Set<number>;
  onRemoveDbFilter: (db: string) => void;
  onRemoveCriteria: (id: number) => void;
  onClearKeyword: () => void;
  onSortChange: (sort: SortOption) => void;
  onPageChange: (page: number) => void;
  onOpenDocument: (id: number) => void;
  onDownloadDoc: (title: string) => void;
  onToggleFavorite: (id: number) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  appliedDbFilters,
  appliedCriteriaTitles,
  searchKeyword,
  sortBy,
  currentPage,
  itemsPerPage,
  favorites,
  onRemoveDbFilter,
  onRemoveCriteria,
  onClearKeyword,
  onSortChange,
  onPageChange,
  onOpenDocument,
  onDownloadDoc,
  onToggleFavorite,
}) => {
  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentSlice = results.slice(startIdx, startIdx + itemsPerPage);

  // دالة تظليل كلمة البحث
  const renderHighlighted = (text: string) => {
    if (!searchKeyword || searchKeyword.trim().length < 2) {
      return text;
    }
    const escaped = searchKeyword.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchKeyword.trim().toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <section id="searchResultsSection">
      <div className="card" id="resultsMainCard">
        {/* شريط معلومات النتائج والفرز */}
        <div className="flex items-center justify-between flex-wrap gap-3.5 mb-4.5 pb-3.5 border-b border-[var(--border)]">
          <div className="text-[1.05rem] font-bold text-[var(--primary)] flex items-center gap-2">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[var(--accent)]"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span>نتائج البحث: </span>
            <span className="text-[var(--accent)] font-bold">{totalItems} وثيقة</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <label htmlFor="sortOrderSelect" className="text-[0.85rem] font-semibold text-[var(--text-muted)]">
              ترتيب النتائج:
            </label>
            <select
              id="sortOrderSelect"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="h-[38px] px-2.5 border border-[var(--border)] rounded-[var(--radius-md)] text-[0.88rem] bg-[var(--surface)] text-[var(--text)]"
            >
              <option value="relevance">الأكثر صلة بالموضوع</option>
              <option value="newest">الأحدث تاريخاً</option>
              <option value="oldest">الأقدم تاريخاً</option>
            </select>
          </div>
        </div>

        {/* معايير البحث المطبقة كـ Tags قابلة للحذف */}
        <div className="flex flex-wrap gap-2 items-center mb-4.5" id="activeFilterTagsBar">
          <span className="text-[0.82rem] text-[var(--text-muted)] font-semibold">
            المعايير المطبقة:
          </span>
          <div className="inline-flex gap-1.5 flex-wrap">
            {appliedDbFilters.map((db) => (
              <span
                key={db}
                className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-[var(--accent-soft)] text-[var(--accent)] rounded-[var(--radius-sm)] text-[0.82rem] font-semibold"
              >
                <span>{db}</span>
                <button
                  type="button"
                  onClick={() => onRemoveDbFilter(db)}
                  className="cursor-pointer bg-transparent border-0 text-inherit hover:text-[var(--danger)] font-bold"
                  title="إزالة"
                >
                  ✕
                </button>
              </span>
            ))}

            {appliedCriteriaTitles.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-[var(--accent-soft)] text-[var(--accent)] rounded-[var(--radius-sm)] text-[0.82rem] font-semibold"
              >
                <span>{c.text}</span>
                <button
                  type="button"
                  onClick={() => onRemoveCriteria(c.id)}
                  className="cursor-pointer bg-transparent border-0 text-inherit hover:text-[var(--danger)] font-bold"
                  title="إزالة"
                >
                  ✕
                </button>
              </span>
            ))}

            {searchKeyword && (
              <span className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-[#FEF3C7] text-[#92400E] rounded-[var(--radius-sm)] text-[0.82rem] font-semibold">
                <span>كلمة: &quot;{searchKeyword}&quot;</span>
                <button
                  type="button"
                  onClick={onClearKeyword}
                  className="cursor-pointer bg-transparent border-0 text-inherit hover:text-[var(--danger)] font-bold"
                  title="مسح"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        </div>

        {/* قائمة بطاقات النتائج */}
        <div id="resultsListContainer">
          {totalItems === 0 ? (
            <div className="text-center py-12 px-5 text-[var(--text-muted)]">
              <div className="text-5xl mb-3 opacity-60">🔍</div>
              <h3 className="text-[1.2rem] text-[var(--primary)] font-bold mb-1.5">
                لا توجد نتائج مطابقة لبحثك
              </h3>
              <p className="text-[0.9rem]">
                جرب تقليل الكلمات المفتاحية، أو اختيار قواعد بيانات إضافية، أو مراجعة شاشة المساعدة للاطلاع على نصائح البحث.
              </p>
            </div>
          ) : (
            currentSlice.map((doc) => {
              const isFav = favorites.has(doc.id);
              return (
                <article
                  key={doc.id}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 mb-4 hover:shadow-md hover:border-[var(--accent)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 py-1 px-2.5 bg-[var(--accent-soft)] text-[var(--accent)] rounded-[var(--radius-sm)] text-[0.8rem] font-bold">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                      <span>{doc.database}</span>
                    </span>

                    <div className="flex items-center gap-4 text-[0.84rem] text-[var(--text-muted)]">
                      <span><strong>رقم:</strong> {doc.number}</span>
                      <span><strong>التاريخ:</strong> {doc.date}</span>
                      <span><strong>الصفحات:</strong> {doc.pages} ص</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => onOpenDocument(doc.id)}
                    className="text-[1.15rem] font-bold text-[var(--primary)] leading-normal cursor-pointer hover:text-[var(--accent)] transition-colors"
                  >
                    {renderHighlighted(doc.title)}
                  </h3>

                  <p className="text-[0.92rem] text-[#4A5568] leading-relaxed">
                    {renderHighlighted(doc.snippet)}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] flex-wrap gap-2.5">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => onOpenDocument(doc.id)}
                        className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-[var(--radius-md)] text-[0.85rem] font-semibold cursor-pointer border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--accent-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-150"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>عرض الوثيقة</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDownloadDoc(doc.title)}
                        className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-[var(--radius-md)] text-[0.85rem] font-semibold cursor-pointer border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--accent-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-150"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>تحميل PDF</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleFavorite(doc.id)}
                      className={`inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-[var(--radius-md)] text-[0.85rem] font-semibold cursor-pointer border transition-all duration-150 ${
                        isFav
                          ? "bg-[#FEF3C7] border-[#F59E0B] text-[#B45309]"
                          : "bg-[var(--surface)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--accent-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      }`}
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill={isFav ? "#F59E0B" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                      <span>{isFav ? "في المفضلة" : "حفظ في المفضلة"}</span>
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* شريط الترقيم والتنقل (Pagination) */}
        {totalItems > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between flex-wrap gap-3 mt-6 pt-4 border-t border-[var(--border)]">
            <div className="text-[0.85rem] text-[var(--text-muted)]">
              عرض {startIdx + 1} - {Math.min(startIdx + itemsPerPage, totalItems)} من أصل {totalItems} نتيجة
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="min-w-[38px] h-[38px] px-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface)] text-[var(--text)] text-[0.88rem] font-semibold cursor-pointer inline-flex items-center justify-center hover:bg-[var(--accent-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              >
                السابق
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => onPageChange(pageNum)}
                      className={`min-w-[38px] h-[38px] px-2 border rounded-[var(--radius-md)] text-[0.88rem] font-semibold cursor-pointer inline-flex items-center justify-center transition-all duration-150 ${
                        currentPage === pageNum
                          ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                          : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--accent-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="min-w-[38px] h-[38px] px-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface)] text-[var(--text)] text-[0.88rem] font-semibold cursor-pointer inline-flex items-center justify-center hover:bg-[var(--accent-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
