"use client";

import React from "react";
import { DocumentRecord } from "../types";

interface DocumentModalProps {
  document: DocumentRecord | null;
  onClose: () => void;
  onDownload: (title: string) => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  document,
  onClose,
  onDownload,
}) => {
  if (!document) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 sm:p-5 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-[var(--surface)] rounded-[var(--radius-xl)] max-w-[760px] w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 bg-[var(--primary)] text-white flex items-center justify-between">
          <div className="text-[1.15rem] font-bold line-clamp-1">
            {document.title}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-full cursor-pointer hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[var(--bg)] p-4 rounded-[var(--radius-md)] mb-5 border border-[var(--border)]">
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.76rem] text-[var(--text-muted)] font-semibold">
                قاعدة البيانات:
              </span>
              <span className="text-[0.88rem] font-bold text-[var(--primary)]">
                {document.database}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.76rem] text-[var(--text-muted)] font-semibold">
                رقم الوثيقة / العدد:
              </span>
              <span className="text-[0.88rem] font-bold text-[var(--primary)]">
                {document.number}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.76rem] text-[var(--text-muted)] font-semibold">
                تاريخ الإصدار / النشر:
              </span>
              <span className="text-[0.88rem] font-bold text-[var(--primary)]">
                {document.date}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.76rem] text-[var(--text-muted)] font-semibold">
                عدد الصفحات:
              </span>
              <span className="text-[0.88rem] font-bold text-[var(--primary)]">
                {document.pages} صفحة
              </span>
            </div>
          </div>

          <div className="font-bold mb-2 text-[var(--primary)]">
            النص القانوني / مقتطف الأرشيف:
          </div>
          <div className="text-[0.95rem] leading-relaxed text-[var(--text)] bg-[#FAFCFE] p-5 rounded-[var(--radius-md)] border border-dashed border-[var(--border)]">
            <div className="border-b border-[var(--border)] pb-3 mb-3.5">
              <h4 className="text-[var(--primary)] font-bold text-[1.05rem]">
                ديباجة النص الرسمي
              </h4>
              <p className="text-[0.88rem] text-[var(--text-muted)] mt-1">
                وثيقة معتمدة ومحفوظة لدى مركز التوثيق والتشريع الوطني
              </p>
            </div>
            <p className="mb-3.5">
              <strong>النص التفصيلي:</strong> {document.snippet}
            </p>
            <p className="text-[#4A5568] text-[0.92rem] leading-loose">
              بمقتضى الصلاحيات الدستورية والقانونية المنوطة بالجهات ذات الاختصاص، تقرر اعتماد ونشر هذه الوثيقة وفق الأصول والأنظمة المرعية. يعتبر هذا النص نسخة إلكترونية رسمية مطابقة للأصل المحفوظ في السجلات الأرشيفية للجريدة الرسمية والديوان التشريعي.
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-[var(--bg)] border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-2.5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onDownload(document.title)}
              className="btn btn-primary btn-sm"
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
              <span>تحميل الوثيقة (PDF)</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="btn btn-secondary btn-sm"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>طباعة</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
          >
            إغلاق المعاينة
          </button>
        </div>
      </div>
    </div>
  );
};
