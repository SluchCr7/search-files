"use client";

import React from "react";
import { DATABASE_LIST, ALL_DOCUMENTS } from "../data/mockData";

interface SimpleSearchProps {
  selectedDatabases: string[];
  searchKeyword: string;
  onToggleDatabase: (dbName: string) => void;
  onSelectAllDatabases: () => void;
  onDeselectAllDatabases: () => void;
  onKeywordChange: (val: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

export const SimpleSearch: React.FC<SimpleSearchProps> = ({
  selectedDatabases,
  searchKeyword,
  onToggleDatabase,
  onSelectAllDatabases,
  onDeselectAllDatabases,
  onKeywordChange,
  onSearch,
  onReset,
}) => {
  const isSearchDisabled = selectedDatabases.length === 0;

  return (
    <section id="simpleTabPanel">
      <div className="card" id="simpleSearchCard">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-[1.15rem] font-bold text-[var(--primary)]">
              الرجاء اختيار واحد أو أكثر من قاعدة البيانات
            </h2>
            <span
              className="tooltip-trigger"
              data-tooltip="يجب تحديد قاعدة بيانات واحدة على الأقل لتفعيل زر البحث"
            >
              i
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSelectAllDatabases}
              className="bg-transparent border border-[var(--border)] text-[var(--text)] text-[0.82rem] py-1.5 px-3 rounded-[var(--radius-md)] cursor-pointer font-semibold hover:bg-[var(--accent-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-150"
              id="btnSelectAllChips"
            >
              تحديد الكل
            </button>
            <button
              type="button"
              onClick={onDeselectAllDatabases}
              className="bg-transparent border border-[var(--border)] text-[var(--text)] text-[0.82rem] py-1.5 px-3 rounded-[var(--radius-md)] cursor-pointer font-semibold hover:bg-[var(--accent-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-150"
              id="btnDeselectAllChips"
            >
              إلغاء التحديد
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2.5">
          <div className="text-[0.88rem] text-[var(--text-muted)]" id="chipsStatusText">
            المحدد حالياً: <strong className="text-[var(--primary)]">{selectedDatabases.length}</strong> من أصل{" "}
            <strong>14</strong> قاعدة بيانات
          </div>
        </div>

        {/* حزم الاختيار المتعدد (Database Chips) */}
        <div
          className="flex flex-wrap gap-2.5 mb-6"
          id="dbChipsContainer"
          role="group"
          aria-label="قواعد البيانات المتاحة"
        >
          {DATABASE_LIST.map((db) => {
            const isSelected = selectedDatabases.includes(db.name);
            const count = ALL_DOCUMENTS.filter((d) => d.database === db.name).length;

            return (
              <div
                key={db.id}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => onToggleDatabase(db.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggleDatabase(db.name);
                  }
                }}
                className={`inline-flex items-center gap-2 py-2 px-3.5 border rounded-[var(--radius-lg)] text-[0.88rem] font-medium cursor-pointer select-none transition-all duration-150 ${
                  isSelected
                    ? "bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--primary)] font-bold shadow-xs"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:bg-[var(--bg)]"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-[4px] border inline-flex items-center justify-center text-[0.72rem] transition-all duration-150 ${
                    isSelected
                      ? "bg-[var(--accent)] border-[var(--accent)] text-white font-bold"
                      : "border-[var(--text-muted)] bg-white"
                  }`}
                >
                  {isSelected ? "✓" : ""}
                </span>
                <span>
                  {db.icon} {db.name}
                </span>
                <span
                  className={`text-[0.72rem] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                      : "bg-black/5 text-[var(--text-muted)]"
                  }`}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* حقل البحث الكبير والأزرار */}
        <div className="flex gap-3 mb-4.5 items-stretch flex-wrap">
          <div className="flex-1 min-w-[280px] relative flex items-center">
            <div className="absolute right-4 text-[var(--text-muted)] pointer-events-none flex items-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              id="simpleSearchInput"
              value={searchKeyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isSearchDisabled) {
                  onSearch();
                }
              }}
              className="w-full h-[52px] pr-[52px] pl-[46px] border-2 border-[var(--border)] rounded-[var(--radius-lg)] text-[1.05rem] text-[var(--text)] bg-[var(--surface)] focus:border-[var(--accent)] transition-all duration-150"
              placeholder="ابحث بكلمة أو عبارة، رقم الوثيقة، موضوع التشريع أو المعاهدة..."
              aria-label="كلمة البحث"
            />
            {searchKeyword && (
              <button
                type="button"
                onClick={() => onKeywordChange("")}
                className="absolute left-3.5 bg-transparent border-0 text-[var(--text-muted)] hover:text-[var(--danger)] cursor-pointer p-1 rounded-full text-base"
                title="مسح النص"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onSearch}
            disabled={isSearchDisabled}
            className="btn btn-primary"
            id="btnSimpleSearch"
            title={isSearchDisabled ? "يرجى اختيار قاعدة بيانات واحدة على الأقل" : "تنفيذ البحث"}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>بحث</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="btn btn-secondary"
            id="btnSimpleReset"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>تفريغ الحقول</span>
          </button>
        </div>

        {isSearchDisabled && (
          <div className="text-[0.82rem] text-[var(--danger)] mt-1.5 flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>يرجى اختيار قاعدة بيانات واحدة على الأقل للتمكن من البحث</span>
          </div>
        )}
      </div>
    </section>
  );
};
