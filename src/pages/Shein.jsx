import React, { useState } from "react";
import { sheinVouchers, sheinCategories } from "../data/shein";

const BRAND_COLOR = "#E91E8C";
const BRAND_LIGHT = "#FFF0F7";
const BRAND_DARK = "#C2166E";
const BRAND_GRADIENT = "linear-gradient(135deg, #E91E8C 0%, #FF6BB5 100%)";

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

const badgeStyles = {
  hot:     { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA" },
  new:     { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
  flash:   { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  special: { bg: "#FDF4FF", text: "#7E22CE", border: "#E9D5FF" },
  premium: { bg: "#FFF7ED", text: "#9A3412", border: "#FED7AA" },
};

const SheinVoucherCard = ({ voucher }) => {
  const [copied, setCopied] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const isFree = voucher.type === "free";
  const showCode = isFree || unlocked;

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bs = voucher.badge && voucher.badgeType ? badgeStyles[voucher.badgeType] : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #FCE4F1",
        background: "white",
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 1px 4px rgba(233,30,140,0.06)",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(233,30,140,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(233,30,140,0.06)"; }}
    >
      {/* Top gradient bar */}
      <div style={{ height: "5px", background: BRAND_GRADIENT }} />

      {/* Badge */}
      {voucher.badge && bs && (
        <div style={{
          position: "absolute",
          top: "14px",
          right: "12px",
          fontSize: "10px",
          fontWeight: 600,
          padding: "3px 8px",
          borderRadius: "20px",
          background: bs.bg,
          color: bs.text,
          border: `1px solid ${bs.border}`,
        }}>
          {voucher.badge}
        </div>
      )}

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingRight: voucher.badge ? "90px" : "0" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "50%",
            background: BRAND_LIGHT,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", flexShrink: 0,
            border: "1.5px solid #FCE4F1",
          }}>
            {voucher.logo}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: "14px", color: "#1a1a1a", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {voucher.title}
            </div>
            <div style={{ fontSize: "11px", color: BRAND_COLOR, marginTop: "2px", fontWeight: 500 }}>
              {voucher.category}
            </div>
          </div>
        </div>

        {/* Discount block */}
        <div style={{
          background: BRAND_LIGHT,
          borderRadius: "12px",
          padding: "12px 14px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "70px", height: "70px", borderRadius: "50%", background: "rgba(233,30,140,0.06)" }} />
          <div style={{ position: "absolute", bottom: "-10px", right: "30px", width: "40px", height: "40px", borderRadius: "50%", background: "rgba(233,30,140,0.05)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "20px", fontWeight: 800, color: BRAND_COLOR, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
              {voucher.discount}
            </div>
            <div style={{ fontSize: "11px", color: "#6B4C59", marginTop: "4px", lineHeight: 1.4 }}>
              {voucher.description}
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px" }}>
          {voucher.minOrder && (
            <span style={{ fontSize: "11px", color: "#6B7280" }}>
              Min: <span style={{ color: "#374151", fontWeight: 500 }}>{voucher.minOrder}</span>
            </span>
          )}
          <span style={{ fontSize: "11px", color: "#6B7280", display: "flex", alignItems: "center", gap: "4px" }}>
            <CalendarIcon />
            Expires {voucher.expiry}
          </span>
        </div>

        {/* Paid label */}
        {!isFree && !unlocked && (
          <div>
            <span style={{
              fontSize: "11px", fontWeight: 600,
              padding: "3px 10px", borderRadius: "20px",
              background: "#FDF4FF", color: "#7E22CE", border: "1px solid #E9D5FF",
            }}>
              Unlock at ₹{voucher.price}
            </span>
          </div>
        )}

        {/* Code / Unlock */}
        <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1.5px dashed #FCE4F1" }}>
          {showCode ? (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{
                flex: 1, padding: "8px 12px", borderRadius: "8px",
                border: "1.5px dashed #F9A8D4",
                background: BRAND_LIGHT,
              }}>
                <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", color: BRAND_COLOR }}>
                  {voucher.code}
                </span>
              </div>
              <button
                onClick={handleCopy}
                style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  padding: "8px 12px", borderRadius: "8px", cursor: "pointer",
                  border: copied ? `1px solid ${BRAND_COLOR}` : "1px solid #F9A8D4",
                  background: copied ? BRAND_LIGHT : "white",
                  color: copied ? BRAND_COLOR : "#9CA3AF",
                  fontSize: "12px", fontWeight: 500,
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
                background: BRAND_GRADIENT, color: "white",
                border: "none", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "6px",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <LockIcon /> Unlock for ₹{voucher.price}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Shein = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = sheinVouchers.filter(v => {
    const catMatch = activeCategory === "All" || v.category === activeCategory;
    const tabMatch = activeTab === "all" || (activeTab === "free" ? v.type === "free" : v.type === "paid");
    const searchMatch = search === "" ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase()) ||
      v.code.toLowerCase().includes(search.toLowerCase());
    return catMatch && tabMatch && searchMatch;
  });

  const freeCount = sheinVouchers.filter(v => v.type === "free").length;
  const paidCount = sheinVouchers.filter(v => v.type === "paid").length;

  return (
    <div style={{ minHeight: "100vh", background: "#FDF2F8" }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #FCE4F1",
        padding: "16px",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
            {/* SHEIN brand block */}
            <div style={{
              background: BRAND_GRADIENT,
              borderRadius: "10px",
              padding: "7px 16px",
              display: "flex", flexDirection: "column", alignItems: "flex-start",
            }}>
              <span style={{ color: "white", fontWeight: 800, fontSize: "16px", letterSpacing: "0.04em", lineHeight: 1.2 }}>
                SHEIN
              </span>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.06em" }}>
                VOUCHER STORE
              </span>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", color: "#374151", fontWeight: 500 }}>
                {sheinVouchers.length} fashion deals
              </div>
              <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", background: "#DCFCE7", color: "#166534", fontWeight: 500 }}>
                  {freeCount} Free
                </span>
                <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", background: "#FDF4FF", color: "#7E22CE", fontWeight: 500 }}>
                  {paidCount} Members
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
                padding: "8px 14px", borderRadius: "20px",
                border: "1px solid #F9A8D4",
                fontSize: "13px", color: "#374151", outline: "none", width: "200px",
                background: "#FFF0F7",
              }}
            />
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "4px", background: "#FCE4F1", padding: "4px", borderRadius: "10px", width: "fit-content", marginBottom: "12px" }}>
            {[{ key: "all", label: "All" }, { key: "free", label: "Free" }, { key: "paid", label: "Members" }].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "6px 16px", borderRadius: "7px", border: "none",
                  fontSize: "13px", fontWeight: 500, cursor: "pointer",
                  background: activeTab === tab.key ? "white" : "transparent",
                  color: activeTab === tab.key ? BRAND_COLOR : "#9D4B79",
                  boxShadow: activeTab === tab.key ? "0 1px 3px rgba(233,30,140,0.12)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category chips */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
            {sheinCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0, padding: "5px 14px", borderRadius: "20px",
                  border: activeCategory === cat ? "none" : "1px solid #F9A8D4",
                  background: activeCategory === cat ? BRAND_COLOR : "white",
                  color: activeCategory === cat ? "white" : "#9D4B79",
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
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🛍️</div>
            <div style={{ fontSize: "15px", color: "#374151", fontWeight: 500 }}>No vouchers found</div>
            <div style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "4px" }}>Try a different filter or search</div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}>
            {filtered.map(v => <SheinVoucherCard key={v.id} voucher={v} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shein;