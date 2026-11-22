"use client";

import React, { useState } from "react";
import { DATABASE_LIST } from "../data/mockData";
import { LogicOperator, SearchCriteria, SearchOperator } from "../types";

interface AdvancedSearchProps {
  criteria: SearchCriteria[];
  onAddCriteria: (condition: SearchCriteria) => void;
  onRemoveCriteria: (id: number) => void;
  onClearAllCriteria: () => void;
  onExecuteSearch: () => void;
  onShowToast: (msg: string) => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  criteria,
  onAddCriteria,
  onRemoveCriteria,
  onClearAllCriteria,
  onExecuteSearch,
  onShowToast,
}) => {
  const [selectedDb, setSelectedDb] = useState("");
  const [field, setField] = useState<"all" | "title" | "snippet" | "number" | "parties">("all");
  const [operator, setOperator] = useState<SearchOperator>("contains");
  const [keyword, setKeyword] = useState("");
  const [toValue, setToValue] = useState("");
  const [fromYear, setFromYear] = useState<string>("");
  const [toYear, setToYear] = useState<string>("");
  const [logic, setLogic] = useState<LogicOperator>("AND");
  const [isSorted, setIsSorted] = useState(false);

  const isFormActive = selectedDb.trim() !== "";

  const handleAddCondition = () => {
    if (!selectedDb) {
      onShowToast("يرجى اختيار قاعدة البيانات أولاً");
      return;
    }

    if (!keyword.trim() && !fromYear && !toYear) {
      onShowToast("يرجى إدخال كلمة بحث أو نطاق زمني للشرط");
      return;
    }

    const fieldMap: Record<string, string> = {
      all: "كافة الحقول (شامل)",
      title: "العنوان الرئيسي",
      snippet: "النص الكامل / المقتطف",
      number: "رقم الوثيقة / العدد",
      parties: "الجهات / الأطراف",
    };

    const opMap: Record<SearchOperator, string> = {
      contains: "يحتوي على",
      exact: "يساوي تماماً",
      starts: "يبدأ بـ",
      ends: "ينتهي بـ",
    };

    const newCondition: SearchCriteria = {
      id: Date.now(),
      database: selectedDb,
      field,
      fieldText: fieldMap[field],
      operator,
      operatorText: opMap[operator],
      keyword: keyword.trim(),
      toValue: toValue.trim() || undefined,
      fromYear: fromYear ? parseInt(fromYear) : null,
      toYear: toYear ? parseInt(toYear) : null,
      logic,
      sort: isSorted,
    };

    onAddCriteria(newCondition);
    onShowToast("تمت إضافة الشرط إلى الجدول بنجاح");
    setKeyword("");
    setToValue("");
  };

  const handleResetAll = () => {
    setSelectedDb("");
    setField("all");
    setOperator("contains");
    setKeyword("");
    setToValue("");
    setFromYear("");
    setToYear("");
    setIsSorted(false);
    onClearAllCriteria();
    onShowToast("تم تفريغ كافة الحقول ومسح جدول الشروط");
  };

  return (
    <section id="advancedTabPanel">
      <div className="card" id="advancedSearchCard">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[1.15rem] font-bold text-[var(--primary)]">
                بناء شروط البحث المتقدم
              </h2>
              <span
                className="tooltip-trigger"
                data-tooltip="اختر قاعدة البيانات أولاً لتفعيل حقول المعايير وإضافة شروط مخصصة"
              >
                i
              </span>
            </div>
            <p className="text-[0.88rem] text-[var(--text-muted)] mt-1">
              قم بتحديد المعايير والربط المنطقي لإجراء بحث دقيق ومركب داخل الأرشيف
            </p>
          </div>
        </div>

        {/* صف حقول الإدخال */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-5">
          {/* 1. قاعدة البيانات */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.88rem] font-semibold text-[var(--primary)] flex items-center gap-1.5">
              <span>قاعدة البيانات</span>
              <span
                className="tooltip-trigger"
                data-tooltip="اختر قاعدة البيانات لتفعيل بقية الحقول"
              >
                i
              </span>
            </label>
            <select
              value={selectedDb}
              onChange={(e) => setSelectedDb(e.target.value)}
              className="form-control"
              id="advDatabaseSelect"
            >
              <option value="">-- اختر قاعدة البيانات أولاً --</option>
              {DATABASE_LIST.map((db) => (
                <option key={db.id} value={db.name}>
                  {db.icon} {db.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. إسم الحقل (معطل حتى اختيار قاعدة البيانات) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.88rem] font-semibold text-[var(--primary)]">
              إسم الحقل
            </label>
            <select
              value={field}
              disabled={!isFormActive}
              onChange={(e) => setField(e.target.value as any)}
              className="form-control"
              id="advFieldSelect"
            >
              <option value="all">كافة الحقول (شامل)</option>
              <option value="title">العنوان الرئيسي</option>
              <option value="snippet">النص الكامل / المقتطف</option>
              <option value="number">رقم الوثيقة / العدد</option>
              <option value="parties">الجهات / الأطراف / الموقعون</option>
            </select>
          </div>

          {/* 3. معيار البحث (معطل حتى اختيار قاعدة البيانات) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.88rem] font-semibold text-[var(--primary)] flex items-center gap-1.5">
              <span>معيار البحث</span>
              <span
                className="tooltip-trigger"
                data-tooltip="حدد كيفية مطابقة كلمة البحث (يحتوي، يساوي، يبدأ بـ، ينتهي بـ)"
              >
                i
              </span>
            </label>
            <select
              value={operator}
              disabled={!isFormActive}
              onChange={(e) => setOperator(e.target.value as SearchOperator)}
              className="form-control"
              id="advOperatorSelect"
            >
              <option value="contains">يحتوي على</option>
              <option value="exact">يساوي تماماً</option>
              <option value="starts">يبدأ بـ</option>
              <option value="ends">ينتهي بـ</option>
            </select>
          </div>

          {/* 4. كلمة البحث (معطل حتى اختيار قاعدة البيانات) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.88rem] font-semibold text-[var(--primary)]">
              كلمة البحث
            </label>
            <input
              type="text"
              value={keyword}
              disabled={!isFormActive}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="أدخل كلمة أو عبارة..."
              className="form-control"
              id="advKeywordInput"
            />
          </div>

          {/* 5. إلى قيمة (اختياري) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.88rem] font-semibold text-[var(--primary)]">
              إلى قيمة (مدى/قيمة ثانية)
            </label>
            <input
              type="text"
              value={toValue}
              disabled={!isFormActive}
              onChange={(e) => setToValue(e.target.value)}
              placeholder="اختياري لمقارنة المدى"
              className="form-control"
              id="advToValueInput"
            />
          </div>

          {/* 6. من سنة */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.88rem] font-semibold text-[var(--primary)]">
              من سنة
            </label>
            <input
              type="number"
              value={fromYear}
              disabled={!isFormActive}
              onChange={(e) => setFromYear(e.target.value)}
              placeholder="مثال: 1990"
              min="1920"
              max="2026"
              className="form-control"
              id="advFromYearInput"
            />
          </div>

          {/* 7. إلى سنة */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.88rem] font-semibold text-[var(--primary)]">
              إلى سنة
            </label>
            <input
              type="number"
              value={toYear}
              disabled={!isFormActive}
              onChange={(e) => setToYear(e.target.value)}
              placeholder="مثال: 2026"
              min="1920"
              max="2026"
              className="form-control"
              id="advToYearInput"
            />
          </div>
        </div>

        {/* أزرار الاختيار المنطقي (Segmented Control) ومفتاح الترتيب وزر الإضافة */}
        <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-[var(--bg)] rounded-[var(--radius-md)] mb-5 border border-[var(--border)]">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-[0.88rem] text-[var(--primary)]">
              الرابط المنطقي للشرط:
            </span>
            <div className="inline-flex bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-1 gap-1">
              {(["AND", "OR", "NOT"] as LogicOperator[]).map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setLogic(op)}
                  className={`py-1.5 px-4 text-[0.88rem] font-semibold rounded-[var(--radius-sm)] cursor-pointer transition-all duration-150 ${
                    logic === op
                      ? "bg-[var(--primary)] text-white shadow-xs"
                      : "text-[var(--text-muted)] hover:text-[var(--primary)]"
                  }`}
                >
                  {op === "AND" ? "و (AND)" : op === "OR" ? "أو (OR)" : "ليس (NOT)"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <span className="font-semibold text-[0.88rem]">ترتيب تصاعدي</span>
              <div className="switch">
                <input
                  type="checkbox"
                  checked={isSorted}
                  onChange={(e) => setIsSorted(e.target.checked)}
                />
                <span className="slider"></span>
              </div>
            </label>

            <button
              type="button"
              onClick={handleAddCondition}
              disabled={!isFormActive}
              className="btn btn-accent btn-sm"
              id="btnAddCriteriaBtn"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>إضافة الشرط إلى الجدول</span>
            </button>
          </div>
        </div>

        {/* جدول الشروط المضافة */}
        <div className="border border-[var(--border)] rounded-[var(--radius-lg)] overflow-x-auto mb-5 bg-[var(--surface)]">
          <table className="w-full border-collapse text-right text-[0.9rem]">
            <thead>
              <tr className="bg-[var(--accent)] text-white font-semibold">
                <th className="p-3 border-l border-white/20 whitespace-nowrap">إسم الحقل</th>
                <th className="p-3 border-l border-white/20 whitespace-nowrap">معيار البحث</th>
                <th className="p-3 border-l border-white/20 whitespace-nowrap">كلمة البحث</th>
                <th className="p-3 border-l border-white/20 whitespace-nowrap">إلى قيمة</th>
                <th className="p-3 border-l border-white/20 whitespace-nowrap">من سنة</th>
                <th className="p-3 border-l border-white/20 whitespace-nowrap">إلى سنة</th>
                <th className="p-3 border-l border-white/20 whitespace-nowrap">شرط</th>
                <th className="p-3 w-[70px] text-center whitespace-nowrap">حذف</th>
              </tr>
            </thead>
            <tbody>
              {criteria.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 px-5 text-center text-[var(--text-muted)]">
                    <div className="text-3xl mb-2 opacity-70">📋</div>
                    <div className="font-semibold text-[0.95rem]">
                      لا يوجد بيانات في جدول الشروط
                    </div>
                    <div className="text-[0.82rem] mt-1">
                      اختر المعايير من الأعلى واضغط على &quot;إضافة الشرط إلى الجدول&quot;
                    </div>
                  </td>
                </tr>
              ) : (
                criteria.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-[var(--accent-soft)] transition-colors border-b border-[var(--border)]"
                  >
                    <td className="p-3 border-l border-[var(--border)]">
                      <strong>{c.fieldText}</strong>{" "}
                      <span className="text-[0.76rem] text-[var(--text-muted)]">
                        ({c.database})
                      </span>
                    </td>
                    <td className="p-3 border-l border-[var(--border)]">
                      <span className="inline-block px-2 py-0.5 rounded text-[0.78rem] font-bold bg-[#EBF5FB] text-[var(--accent)]">
                        {c.operatorText}
                      </span>
                    </td>
                    <td className="p-3 border-l border-[var(--border)]">
                      <strong>{c.keyword || "—"}</strong>
                    </td>
                    <td className="p-3 border-l border-[var(--border)]">
                      {c.toValue || "—"}
                    </td>
                    <td className="p-3 border-l border-[var(--border)]">
                      {c.fromYear || "—"}
                    </td>
                    <td className="p-3 border-l border-[var(--border)]">
                      {c.toYear || "—"}
                    </td>
                    <td className="p-3 border-l border-[var(--border)]">
                      <span className="inline-block px-2 py-0.5 rounded text-[0.78rem] font-bold bg-[var(--accent-soft)] text-[var(--accent)]">
                        {c.logic}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => onRemoveCriteria(c.id)}
                        className="btn btn-ghost-danger btn-sm p-1"
                        title="حذف هذا الشرط"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* أزرار الإجراءات للبحث المتقدم */}
        <div className="flex gap-3 justify-start flex-wrap">
          <button
            type="button"
            onClick={onExecuteSearch}
            className="btn btn-primary"
            id="btnAdvSearchExecute"
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
            <span>بحث متقدم</span>
          </button>

          <button
            type="button"
            onClick={handleResetAll}
            className="btn btn-secondary"
            id="btnAdvResetAll"
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
            <span>تفريغ الحقول ومسح الجدول</span>
          </button>
        </div>
      </div>
    </section>
  );
};
