"use client";

import React from "react";

interface NavbarProps {
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  favoritesCount,
  onOpenFavorites,
  onOpenHelp,
}) => {
  return (
    <header className="bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3.5 text-inherit">
          <div className="w-11 h-11 rounded-[var(--radius-md)] overflow-hidden shrink-0 shadow-sm">
            <img
              src="/archive-search-icon.svg"
              alt=""
              width="44"
              height="44"
              className="w-full h-full"
            />
          </div>
          <div>
            <h1 className="text-[1.15rem] font-bold text-[var(--primary)] leading-tight">
              أرشيف الوثائق والتشريعات الوطنية
            </h1>
            <p className="text-[0.82rem] text-[var(--text-muted)] font-medium">
              البوابة الرقمية الموحدة للأرشيف والجريدة الرسمية والوثائق الرسمية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* زر المفضلة */}
          <button
            type="button"
            onClick={onOpenFavorites}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--radius-md)] text-[0.88rem] font-semibold cursor-pointer border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--accent-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-150"
            title="عرض الوثائق المحفوظة في المفضلة"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>المفضلة</span>
            <span className="bg-[var(--accent)] text-white rounded-full px-2 py-0.5 text-[0.75rem] font-bold">
              {favoritesCount}
            </span>
          </button>

          {/* زر المساعدة في الهيدر */}
          <button
            type="button"
            onClick={onOpenHelp}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--radius-md)] text-[0.88rem] font-semibold cursor-pointer border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--accent-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-150"
            title="دليل ومساعدة الباحث"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>المساعدة</span>
          </button>
        </div>
      </div>
    </header>
  );
};
