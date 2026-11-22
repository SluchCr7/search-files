"use client";

import React from "react";
import { ActiveTab } from "../types";

interface TabsNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const TabsNav: React.FC<TabsNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav className="bg-[var(--surface)] border-b border-[var(--border)]" id="mainTabsNav">
      <div className="max-w-[1280px] mx-auto px-5 flex gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => onTabChange("simple")}
          className={`py-3.5 px-5 text-[0.98rem] font-semibold cursor-pointer inline-flex items-center gap-2.5 transition-all duration-150 border-b-3 whitespace-nowrap ${
            activeTab === "simple"
              ? "text-[var(--primary)] border-[var(--primary)] font-bold bg-[#E8F0F7]/40"
              : "text-[var(--text-muted)] border-transparent hover:text-[var(--primary)] hover:bg-[#E8F0F7]/20"
          }`}
          id="tabSimpleBtn"
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
          <span>بحث بسيط</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("advanced")}
          className={`py-3.5 px-5 text-[0.98rem] font-semibold cursor-pointer inline-flex items-center gap-2.5 transition-all duration-150 border-b-3 whitespace-nowrap ${
            activeTab === "advanced"
              ? "text-[var(--primary)] border-[var(--primary)] font-bold bg-[#E8F0F7]/40"
              : "text-[var(--text-muted)] border-transparent hover:text-[var(--primary)] hover:bg-[#E8F0F7]/20"
          }`}
          id="tabAdvancedBtn"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>بحث متقدم</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("gazette")}
          className={`py-3.5 px-5 text-[0.98rem] font-semibold cursor-pointer inline-flex items-center gap-2.5 transition-all duration-150 border-b-3 whitespace-nowrap ${
            activeTab === "gazette"
              ? "text-[var(--primary)] border-[var(--primary)] font-bold bg-[#E8F0F7]/40"
              : "text-[var(--text-muted)] border-transparent hover:text-[var(--primary)] hover:bg-[#E8F0F7]/20"
          }`}
          id="tabGazetteBtn"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span>أعداد الجريدة الرسمية (خط زمني)</span>
          <span className="text-[0.75rem] bg-[var(--accent-soft)] text-[var(--accent)] px-2 py-0.5 rounded-full font-semibold">
            متسلسل
          </span>
        </button>
      </div>
    </nav>
  );
};
