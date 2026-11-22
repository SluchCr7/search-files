"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ALL_DOCUMENTS } from "../data/mockData";
import { ActiveTab, DocumentRecord, SearchCriteria, SortOption } from "../types";
import { Navbar } from "../components/Navbar";
import { TabsNav } from "../components/TabsNav";
import { SimpleSearch } from "../components/SimpleSearch";
import { AdvancedSearch } from "../components/AdvancedSearch";
import { GazetteTimeline } from "../components/GazetteTimeline";
import { SearchResults } from "../components/SearchResults";
import { HelpDrawer } from "../components/HelpDrawer";
import { GuidedTour } from "../components/GuidedTour";
import { DocumentModal } from "../components/DocumentModal";
import { FavoritesModal } from "../components/FavoritesModal";
import { ToastContainer, ToastMessage } from "../components/Toast";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("simple");
  const [selectedDatabases, setSelectedDatabases] = useState<string[]>([
    "وثائق حكومية",
    "عدد الجريدة الرسمية",
  ]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [advancedCriteria, setAdvancedCriteria] = useState<SearchCriteria[]>([]);

  // نتائج البحث
  const [filteredDocs, setFilteredDocs] = useState<DocumentRecord[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // المفضلة
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // النوافذ والمساعدة
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // إشعارات Toast
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((text: string) => {
    setToasts((prev) => [...prev, { id: Date.now(), text }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // استرجاع المفضلة من التخزين المحلي
  useEffect(() => {
    try {
      const saved = localStorage.getItem("legal_archive_next_favorites");
      if (saved) {
        setFavorites(new Set(JSON.parse(saved)));
      }
    } catch {}
  }, []);

  const saveFavorites = (newFavs: Set<number>) => {
    setFavorites(newFavs);
    try {
      localStorage.setItem("legal_archive_next_favorites", JSON.stringify([...newFavs]));
    } catch {}
  };

  const toggleFavorite = (id: number) => {
    const next = new Set(favorites);
    if (next.has(id)) {
      next.delete(id);
      addToast("تمت إزالة الوثيقة من المفضلة");
    } else {
      next.add(id);
      addToast("تم حفظ الوثيقة في المفضلة بنجاح");
    }
    saveFavorites(next);
  };

  const clearAllFavorites = () => {
    if (confirm("هل أنت متأكد من تفريغ كافة العناصر المحفوظة في المفضلة؟")) {
      const empty = new Set<number>();
      saveFavorites(empty);
      addToast("تم تفريغ قائمة المفضلة بالكامل");
    }
  };

  // تنفيذ البحث البسيط
  const executeSimpleSearch = useCallback(() => {
    if (selectedDatabases.length === 0) {
      addToast("يرجى اختيار قاعدة بيانات واحدة على الأقل");
      return;
    }

    const kw = searchKeyword.trim().toLowerCase();
    const matches = ALL_DOCUMENTS.filter((doc) => {
      // مطابقة قاعدة البيانات
      if (!selectedDatabases.includes(doc.database)) return false;

      // مطابقة كلمة البحث
      if (!kw) return true;
      const haystack = `${doc.title} ${doc.snippet} ${doc.number} ${doc.database}`.toLowerCase();
      return haystack.includes(kw);
    });

    // فرز
    sortResults(matches, sortBy, kw);
    setFilteredDocs(matches);
    setCurrentPage(1);

    // التمرير للنتائج
    const el = document.getElementById("searchResultsSection");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedDatabases, searchKeyword, sortBy, addToast]);

  // تنفيذ البحث المتقدم
  const executeAdvancedSearch = useCallback(() => {
    if (advancedCriteria.length === 0) {
      addToast("يرجى إضافة شرط واحد على الأقل إلى جدول الشروط");
      return;
    }

    let filtered = [...ALL_DOCUMENTS];

    advancedCriteria.forEach((cond) => {
      filtered = filtered.filter((doc) => {
        if (doc.database !== cond.database) {
          return cond.logic === "NOT";
        }

        let matched = true;

        if (cond.keyword) {
          const kw = cond.keyword.toLowerCase();
          let text = `${doc.title} ${doc.snippet} ${doc.number}`.toLowerCase();
          if (cond.field === "title") text = doc.title.toLowerCase();
          if (cond.field === "snippet") text = doc.snippet.toLowerCase();
          if (cond.field === "number") text = doc.number.toLowerCase();

          if (cond.operator === "contains") matched = text.includes(kw);
          else if (cond.operator === "exact") matched = text.trim() === kw;
          else if (cond.operator === "starts") matched = text.trim().startsWith(kw);
          else if (cond.operator === "ends") matched = text.trim().endsWith(kw);
        }

        if (cond.fromYear && doc.year < cond.fromYear) matched = false;
        if (cond.toYear && doc.year > cond.toYear) matched = false;

        return cond.logic === "NOT" ? !matched : matched;
      });
    });

    sortResults(filtered, sortBy, "");
    setFilteredDocs(filtered);
    setCurrentPage(1);
    addToast(`اكتمل البحث المتقدم: عُثر على ${filtered.length} وثيقة`);

    const el = document.getElementById("searchResultsSection");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [advancedCriteria, sortBy, addToast]);

  // دالة الفرز المساعدة
  const sortResults = (list: DocumentRecord[], sort: SortOption, keyword: string) => {
    if (sort === "newest") {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sort === "oldest") {
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      if (keyword) {
        list.sort((a, b) => {
          const aTitle = a.title.toLowerCase().includes(keyword) ? 2 : 1;
          const bTitle = b.title.toLowerCase().includes(keyword) ? 2 : 1;
          return bTitle - aTitle;
        });
      }
    }
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    const updated = [...filteredDocs];
    sortResults(updated, newSort, searchKeyword);
    setFilteredDocs(updated);
  };

  // تشغيل البحث المبدئي عند التحميل
  useEffect(() => {
    executeSimpleSearch();
  }, [executeSimpleSearch]);

  const handleToggleDb = (dbName: string) => {
    setSelectedDatabases((prev) =>
      prev.includes(dbName) ? prev.filter((d) => d !== dbName) : [...prev, dbName]
    );
  };

  const handleSelectAllDbs = () => {
    const all = [
      "وثائق حكومية",
      "الاتفاقيات الثقافية",
      "عدد الجريدة الرسمية",
      "عدد ممتاز",
      "ملحق جريدة رسمية",
      "اعلانات الشركات",
      "علامات تجارية",
      "مذكرات مجلس الأمة",
      "ملحق مذكرات مجلس الأمة",
      "خطابات الملك عبد الله الثاني ابن الحسين",
      "خطابات جلالة الملك الحسين بن طلال",
      "خطابات سمو الأمير الحسن بن طلال",
      "الوثائق الخاصة",
      "أرشيف الصور",
    ];
    setSelectedDatabases(all);
    addToast("تم تحديد كافة قواعد البيانات الـ 14");
  };

  const handleDeselectAllDbs = () => {
    setSelectedDatabases([]);
    addToast("تم إلغاء تحديد قواعد البيانات");
  };

  const handleResetSimple = () => {
    setSearchKeyword("");
    setSelectedDatabases([]);
    setFilteredDocs([]);
    addToast("تم تفريغ الحقول ومسح الاختيارات");
  };

  // أمثلة البحث الجاهزة من لوحة المساعدة
  const handleApplyPreset = (
    kw: string,
    dbName: string,
    fromYear?: number,
    toYear?: number
  ) => {
    setActiveTab("simple");
    setSelectedDatabases([dbName]);
    setSearchKeyword(kw);
    setIsHelpOpen(false);

    // تنفيذ فوري
    setTimeout(() => {
      const matches = ALL_DOCUMENTS.filter((doc) => {
        if (doc.database !== dbName) return false;
        if (fromYear && doc.year < fromYear) return false;
        if (toYear && doc.year > toYear) return false;
        return (doc.title + " " + doc.snippet).toLowerCase().includes(kw.toLowerCase());
      });
      setFilteredDocs(matches);
      setCurrentPage(1);
      addToast(`تم تطبيق مثال البحث: "${kw}" في ${dbName}`);
      const el = document.getElementById("searchResultsSection");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const appliedCriteriaTitles = useMemo(() => {
    if (activeTab !== "advanced") return [];
    return advancedCriteria.map((c) => ({
      id: c.id,
      text: `${c.fieldText}: ${c.keyword || c.operatorText}`,
    }));
  }, [activeTab, advancedCriteria]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-[#1F2630]">
      {/* 1. رأس الصفحة */}
      <Navbar
        favoritesCount={favorites.size}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* 2. شريط التبويبات الرئيسية */}
      <TabsNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. منطقة العمل والبحث */}
      <main className="max-w-[1280px] w-full mx-auto my-6 px-5 flex-1">
        {/* تبويب البحث البسيط */}
        {activeTab === "simple" && (
          <SimpleSearch
            selectedDatabases={selectedDatabases}
            searchKeyword={searchKeyword}
            onToggleDatabase={handleToggleDb}
            onSelectAllDatabases={handleSelectAllDbs}
            onDeselectAllDatabases={handleDeselectAllDbs}
            onKeywordChange={setSearchKeyword}
            onSearch={executeSimpleSearch}
            onReset={handleResetSimple}
          />
        )}

        {/* تبويب البحث المتقدم */}
        {activeTab === "advanced" && (
          <AdvancedSearch
            criteria={advancedCriteria}
            onAddCriteria={(cond) => setAdvancedCriteria((prev) => [...prev, cond])}
            onRemoveCriteria={(id) => {
              setAdvancedCriteria((prev) => prev.filter((c) => c.id !== id));
              addToast("تم حذف الشرط من الجدول");
            }}
            onClearAllCriteria={() => setAdvancedCriteria([])}
            onExecuteSearch={executeAdvancedSearch}
            onShowToast={addToast}
          />
        )}

        {/* تبويب أعداد الجريدة الرسمية المتسلسلة */}
        {activeTab === "gazette" && (
          <GazetteTimeline
            onOpenDocument={(id) => {
              const doc = ALL_DOCUMENTS.find((d) => d.id === id);
              if (doc) setPreviewDoc(doc);
            }}
            onDownloadDoc={(title) => {
              addToast(`جاري تجهيز وتحميل: "${title.slice(0, 30)}..." بصيغة PDF`);
            }}
            onShowToast={addToast}
          />
        )}

        {/* 4. شاشة عرض نتائج البحث والترقيم */}
        {(activeTab === "simple" || activeTab === "advanced") && (
          <SearchResults
            results={filteredDocs}
            appliedDbFilters={activeTab === "simple" ? selectedDatabases : []}
            appliedCriteriaTitles={appliedCriteriaTitles}
            searchKeyword={searchKeyword}
            sortBy={sortBy}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            favorites={favorites}
            onRemoveDbFilter={(db) => {
              setSelectedDatabases((prev) => prev.filter((d) => d !== db));
            }}
            onRemoveCriteria={(id) => {
              setAdvancedCriteria((prev) => prev.filter((c) => c.id !== id));
            }}
            onClearKeyword={() => {
              setSearchKeyword("");
              executeSimpleSearch();
            }}
            onSortChange={handleSortChange}
            onPageChange={(page) => {
              setCurrentPage(page);
              const el = document.getElementById("searchResultsSection");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            onOpenDocument={(id) => {
              const doc = ALL_DOCUMENTS.find((d) => d.id === id);
              if (doc) setPreviewDoc(doc);
            }}
            onDownloadDoc={(title) => {
              addToast(`جاري تجهيز وتحميل الوثيقة: "${title.slice(0, 30)}..." بصيغة PDF`);
            }}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </main>

      {/* 5. زر المساعدة العائم الثابت بالأسفل يساراً */}
      <button
        type="button"
        onClick={() => setIsHelpOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-[var(--primary)] hover:bg-[var(--accent)] text-white py-3 px-5 rounded-full font-bold cursor-pointer flex items-center gap-2.5 shadow-xl hover:-translate-y-0.5 transition-all duration-200 border-2 border-white/20"
        id="fabOpenHelp"
        aria-label="شاشة مساعدة الباحث"
      >
        <span className="w-5.5 h-5.5 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-sm font-bold">
          ؟
        </span>
        <span>مساعدة الباحث</span>
      </button>

      {/* 6. لوحة مساعدة الباحث الجانبية (Drawer من اليسار) */}
      <HelpDrawer
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onApplyPreset={handleApplyPreset}
        onSwitchToGazette={() => {
          setIsHelpOpen(false);
          setActiveTab("gazette");
          addToast("تم الانتقال إلى أعداد الجريدة الرسمية المتسلسلة");
        }}
        onStartTour={() => setIsTourActive(true)}
      />

      {/* 7. الجولة التعريفية التفاعلية */}
      <GuidedTour isActive={isTourActive} onFinish={() => setIsTourActive(false)} />

      {/* 8. نافذة معاينة الوثيقة (Document Preview Modal) */}
      <DocumentModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onDownload={(title) => {
          addToast(`جاري تحميل الوثيقة الرسمية: "${title.slice(0, 30)}..." بصيغة PDF`);
        }}
      />

      {/* 9. نافذة إدارة المفضلة */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        favorites={favorites}
        onClose={() => setIsFavoritesOpen(false)}
        onOpenDocument={(id) => {
          const doc = ALL_DOCUMENTS.find((d) => d.id === id);
          if (doc) setPreviewDoc(doc);
        }}
        onRemoveFavorite={toggleFavorite}
        onClearAll={clearAllFavorites}
      />

      {/* 10. إشعارات Toast */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      {/* 11. التذييل (Footer) */}
      <footer className="bg-[var(--surface)] border-t border-[var(--border)] py-6 px-5 mt-auto text-center text-[0.85rem] text-[var(--text-muted)]">
        <div>
          نظام البحث في أرشيف الوثائق والتشريعات الوطنية © 2026 | مطور بنظام Next.js 16 مع TypeScript و Tailwind CSS وفق أحدث معايير الوصول وسهولة الاستخدام العربية (RTL)
        </div>
      </footer>
    </div>
  );
}
