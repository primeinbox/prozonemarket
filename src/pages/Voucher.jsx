import React, { useState } from "react";
import { vouchers, categories } from "../data/vouch";

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const TagIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const VoucherCard = ({ voucher }) => {
  const [copied, setCopied] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFree = voucher.type === "free";
  const showCode = isFree || unlocked;

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Top accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: voucher.color }} />

      {/* Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1">
        {isFree ? (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
            FREE
          </span>
        ) : (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
            ₹{voucher.price}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Brand header */}
        <div className="flex items-center gap-3 pr-16">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: `${voucher.color}18` }}
          >
            {voucher.logo}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base leading-tight">
              {voucher.brand}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <TagIcon />
              <span className="text-xs text-gray-500 dark:text-gray-400">{voucher.category}</span>
            </div>
          </div>
        </div>

        {/* Discount highlight */}
        <div className="rounded-xl px-4 py-3 flex items-center justify-between" style={{ backgroundColor: `${voucher.color}12` }}>
          <div>
            <p className="text-lg font-bold leading-tight" style={{ color: voucher.color }}>
              {voucher.discount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
              {voucher.description}
            </p>
          </div>
        </div>

        {/* Details row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {voucher.minOrder && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              Min: {voucher.minOrder}
            </span>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <CalendarIcon />
            Expires {voucher.expiry}
          </span>
        </div>

        {/* Coupon code section */}
        <div className="mt-auto pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
          {showCode ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                <span className="text-sm font-mono font-semibold tracking-widest text-gray-700 dark:text-gray-200 select-all">
                  {voucher.code}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 border"
                style={{
                  backgroundColor: copied ? `${voucher.color}18` : "transparent",
                  borderColor: copied ? voucher.color : "#d1d5db",
                  color: copied ? voucher.color : "#6b7280",
                }}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setUnlocked(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: voucher.color }}
            >
              <LockIcon />
              Unlock for ₹{voucher.price}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Voucher = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("all");

  const filtered = vouchers.filter((v) => {
    const catMatch = activeCategory === "All" || v.category === activeCategory;
    const tabMatch =
      activeTab === "all" || (activeTab === "free" ? v.type === "free" : v.type === "paid");
    return catMatch && tabMatch;
  });

  const freeCount = vouchers.filter((v) => v.type === "free").length;
  const paidCount = vouchers.filter((v) => v.type === "paid").length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Vouchers & Coupons</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{vouchers.length} offers available</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium">
                {freeCount} Free
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium">
                {paidCount} Paid
              </span>
            </div>
          </div>

          {/* Free / Paid tabs */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit mb-3">
            {[
              { key: "all", label: "All" },
              { key: "free", label: "Free" },
              { key: "paid", label: "Paid" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activeTab === tab.key
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                  activeCategory === cat
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎟️</p>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No vouchers found</p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">Try a different filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((voucher) => (
              <VoucherCard key={voucher.id} voucher={voucher} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Voucher;