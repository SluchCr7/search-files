"use client";

import React from "react";
import { ALL_DOCUMENTS } from "../data/mockData";

interface FavoritesModalProps {
  isOpen: boolean;
  favorites: Set<number>;
  onClose: () => void;
  onOpenDocument: (id: number) => void;
  onRemoveFavorite: (id: number) => void;
  onClearAll: () => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  favorites,
  onClose,
  onOpenDocument,
  onRemoveFavorite,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const favList = ALL_DOCUMENTS.filter((d) => favorites.has(d.id));

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-[var(--surface)] rounded-[var(--radius-xl)] max-w-[680px] w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 bg-[var(--primary)] text-white flex items-center justify-between">
          <div className="text-[1.15rem] font-bold">
            الوثائق المحفوظة في المفضلة ({favorites.size})
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-full cursor-pointer hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {favList.length === 0 ? (
            <div className="text-center py-10 px-5 text-[var(--text-muted)]">
              <div className="text-4xl mb-2">⭐</div>
              <h4 className="font-bold text-[1.05rem]">قائمة المفضلة فارغة حالياً</h4>
              <p className="text-[0.85rem] mt-1">
                يمكنك حفظ أي وثيقة أثناء البحث بالضغط على زر &quot;حفظ في المفضلة&quot;.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {favList.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3.5 border-b border-[var(--border)] gap-2.5 flex-wrap hover:bg-[var(--bg)] transition-colors"
                >
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-bold text-[var(--primary)] text-[0.95rem]">
                      {doc.title}
                    </div>
                    <div className="text-[0.8rem] text-[var(--text-muted)] mt-1 flex gap-2 flex-wrap">
                      <span>{doc.database}</span>
                      <span>•</span>
                      <span>رقم: {doc.number}</span>
                      <span>•</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenDocument(doc.id);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      عرض
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveFavorite(doc.id)}
                      className="btn btn-ghost-danger btn-sm"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-[var(--bg)] border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-2.5">
          {favorites.size > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="btn btn-ghost-danger btn-sm"
            >
              تفريغ المفضلة بالكامل
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm ml-auto"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
