"use client";

import React, { useEffect } from "react";

export interface ToastMessage {
  id: number;
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemoveToast: (id: number) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => onRemoveToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: () => void }> = ({
  toast,
  onRemove,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <div className="pointer-events-auto bg-[var(--primary)] text-white py-3 px-5 rounded-[var(--radius-md)] shadow-xl text-[0.9rem] font-semibold flex items-center gap-2.5 border-r-4 border-[var(--accent)] animate-in fade-in slide-in-from-right-5 duration-200">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 14 14" />
      </svg>
      <span>{toast.text}</span>
    </div>
  );
};
