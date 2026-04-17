import React, { useState } from "react";
import { flipkartVouchers, flipkartCategories } from "../data/flipkart";

const BRAND_COLOR = "#2874F0";
const BRAND_COLOR_LIGHT = "#EEF4FF";
const BRAND_COLOR_DARK = "#1a5ccc";

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const TagIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const tagColors = {
  "Best Seller": { bg: "#FFF7E6", text: "#B45309", border: "#FDE68A" },
  "Trending":    { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  "Premium":     { bg: "#F5F3FF", text: "#6D28D9", border: "#DDD6FE" },
  "New":         { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
  "Limited":     { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA" },
  "Exclusive":   { bg: "#FDF4FF", text: "#7E22CE", border: "#E9D5FF" },
  "Student Deal":{ bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
  "Flash Deal":  { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
};

const FlipkartVoucherCard = ({ voucher }) => {
  const [copied, setCopied] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const isFree = voucher.type === "free";
  const showCode = isFree || unlocked;

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tagStyle = voucher.tag ? tagColors[voucher.tag] || { bg: "#F3F4F6", text: "#374151", border: "#D1D5DB" } : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #E5E7EB",
        background: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s, transform 0.2s",
        position: "relative",
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(40,116,240,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Top accent */}
      <div style={{ height: "5px", background: BRAND_COLOR }} />

      {/* Tag badge */}
      {voucher.tag && (
        <div style={{
          position: "absolute",
          top: "16px",
          right: "12px",
          fontSize: "10px",
          fontWeight: 600,
          padding: "3px 8px",
          borderRadius: "20px",
          background: tagStyle.bg,
          color: tagStyle.text,
          border: `1px solid ${tagStyle.border}`,
          letterSpacing: "0.02em",
        }}>
          {voucher.tag}
        </div>
      )}

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingRight: voucher.tag ? "80px" : "0" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "12px",
            background: BRAND_COLOR_LIGHT,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", flexShrink: 0,
          }}>
            {voucher.logo}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: "14px", color: "#111827", lineHeight: "1.3", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {voucher.title}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
              <TagIcon />
              <span style={{ fontSize: "11px", color: "#6B7280" }}>{voucher.category}</span>
            </div>
          </div>
        </div>

        {/* Discount strip */}
        <div style={{
          background: BRAND_COLOR_LIGHT,
          borderRadius: "10px",
          padding: "10px 14px",
          borderLeft: `3px solid ${BRAND_COLOR}`,
        }}>
          <div style={{ fontSize: "17px", fontWeight: 700, color: BRAND_COLOR, lineHeight: 1.2 }}>
            {voucher.discount}
          </div>
          <div style={{ fontSize: "11px", color: "#4B5563", marginTop: "3px", lineHeight: 1.4 }}>
            {voucher.description}
          </div>
        </div>

        {/* Details */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
          {voucher.minOrder && (
            <span style={{ fontSize: "11px", color: "#6B7280" }}>
              Min order: <span style={{ color: "#111827", fontWeight: 500 }}>{voucher.minOrder}</span>
            </span>
          )}
          <span style={{ fontSize: "11px", color: "#6B7280", display: "flex", alignItems: "center", gap: "4px" }}>
            <CalendarIcon />
            Expires {voucher.expiry}
          </span>
        </div>

        {/* Price badge for paid */}
        {!isFree && !unlocked && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{
              fontSize: "11px", fontWeight: 600,
              padding: "3px 10px", borderRadius: "20px",
              background: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A",
            }}>
              Unlock at ₹{voucher.price}
            </span>
          </div>
        )}

        {/* Code / Unlock */}
        <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px dashed #E5E7EB" }}>
          {showCode ? (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{
                flex: 1, padding: "8px 12px", borderRadius: "8px",
                border: "1.5px dashed #93C5FD", background: "#F0F7FF",
              }}>
                <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", color: "#1D4ED8" }}>
                  {voucher.code}
                </span>
              </div>
              <button
                onClick={handleCopy}
                style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  padding: "8px 12px", borderRadius: "8px",
                  border: copied ? `1px solid ${BRAND_COLOR}` : "1px solid #D1D5DB",
                  background: copied ? BRAND_COLOR_LIGHT : "transparent",
                  color: copied ? BRAND_COLOR : "#6B7280",
                  fontSize: "12px", fontWeight: 500, cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setUnlocked(true)}
              style={{
                width: "100%", padding: "10px 0", borderRadius: "10px",
                background: BRAND_COLOR, color: "white",
                border: "none", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = BRAND_COLOR_DARK}
              onMouseLeave={e => e.currentTarget.style.background = BRAND_COLOR}
            >
              <LockIcon /> Unlock for ₹{voucher.price}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Flipkart = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = flipkartVouchers.filter(v => {
    const catMatch = activeCategory === "All" || v.category === activeCategory;
    const tabMatch = activeTab === "all" || (activeTab === "free" ? v.type === "free" : v.type === "paid");
    const searchMatch = search === "" ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase()) ||
      v.code.toLowerCase().includes(search.toLowerCase());
    return catMatch && tabMatch && searchMatch;
  });

  const freeCount = flipkartVouchers.filter(v => v.type === "free").length;
  const paidCount = flipkartVouchers.filter(v => v.type === "paid").length;

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB" }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #E5E7EB",
        padding: "16px",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
            {/* Flipkart wordmark block */}
            <div style={{
              background: BRAND_COLOR,
              borderRadius: "10px",
              padding: "6px 14px 8px",
              display: "flex", flexDirection: "column", alignItems: "flex-start",
            }}>
              <span style={{ color: "white", fontWeight: 700, fontSize: "15px", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                flipkart
              </span>
              <span style={{ color: "#FFD700", fontSize: "9px", fontWeight: 500, letterSpacing: "0.05em" }}>
                ★ Voucher Hub
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", color: "#374151", fontWeight: 500 }}>
                {flipkartVouchers.length} offers available
              </div>
              <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", background: "#DCFCE7", color: "#166534", fontWeight: 500 }}>
                  {freeCount} Free
                </span>
                <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", background: "#FFFBEB", color: "#92400E", fontWeight: 500 }}>
                  {paidCount} Paid
                </span>
              </div>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search vouchers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: "8px 14px", borderRadius: "20px", border: "1px solid #D1D5DB",
                fontSize: "13px", color: "#374151", outline: "none", width: "200px",
                background: "#F9FAFB",
              }}
            />
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "4px", background: "#F3F4F6", padding: "4px", borderRadius: "10px", width: "fit-content", marginBottom: "12px" }}>
            {[{ key: "all", label: "All" }, { key: "free", label: "Free" }, { key: "paid", label: "Paid" }].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "6px 16px", borderRadius: "7px", border: "none",
                  fontSize: "13px", fontWeight: 500, cursor: "pointer",
                  background: activeTab === tab.key ? "white" : "transparent",
                  color: activeTab === tab.key ? "#111827" : "#6B7280",
                  boxShadow: activeTab === tab.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category chips */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
            {flipkartCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0, padding: "5px 14px", borderRadius: "20px",
                  border: activeCategory === cat ? "none" : "1px solid #D1D5DB",
                  background: activeCategory === cat ? BRAND_COLOR : "white",
                  color: activeCategory === cat ? "white" : "#4B5563",
                  fontSize: "12px", fontWeight: 500, cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 16px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎟️</div>
            <div style={{ fontSize: "15px", color: "#374151", fontWeight: 500 }}>No vouchers found</div>
            <div style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "4px" }}>Try a different filter or search</div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}>
            {filtered.map(v => <FlipkartVoucherCard key={v.id} voucher={v} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Flipkart;