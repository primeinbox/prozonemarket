import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, Flame, SlidersHorizontal,
  CreditCard, Tag, Gamepad2, ShoppingCart, ShoppingBag, Shirt,
  ChevronRight, Star, Zap, Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Data imports ──────────────────────────────────────────────────────────────
import { categories }       from "../data/categories";
import { market1 }          from "../data/cards/market1";
import { market2 }          from "../data/cards/market2";
import { diamondPacks, memberships } from "../data/ff/content";
import { amazonDeals, lightningDeals } from "../data/amazon";
import { flipkartVouchers } from "../data/flipkart";
import { sheinVouchers }    from "../data/shein";
import { vouchers }         from "../data/vouch";

// ── Icon map for categories ───────────────────────────────────────────────────
const CAT_ICONS = {
  Cards:    CreditCard,
  Vouchers: Tag,
  FreeFire: Gamepad2,
  Amazon:   ShoppingCart,
  Flipkart: ShoppingBag,
  Shein:    Shirt,
};

// ── Flatten all data into unified search index ────────────────────────────────
const buildIndex = () => [
  // Categories (landing cards)
  ...categories.map((c) => ({
    id:       `cat-${c.name}`,
    source:   "category",
    title:    c.name,
    subtitle: c.tag,
    meta:     c.desc,
    route:    c.route,
    accent:   c.accent,
    iconBg:   c.iconBg,
    Icon:     CAT_ICONS[c.name] || Package,
    badge:    null,
    price:    null,
  })),

  // Market1 cards
  ...market1.map((c) => ({
    id:       `m1-${c.id}`,
    source:   "cards",
    title:    c.type,
    subtitle: `•••• ${c.num}`,
    meta:     `Limit ${c.limit} · Exp ${c.expiry}`,
    route:    "/cards",
    accent:   "#F97316",
    iconBg:   "#FFF2E8",
    Icon:     CreditCard,
    badge:    null,
    price:    c.price,
  })),

  // Market2 cards
  ...market2.slice(0, 40).map((c) => ({
    id:       `m2-${c.id}`,
    source:   "cards",
    title:    `${c.type} Card`,
    subtitle: c.name,
    meta:     `Limit ${c.limit} · ${c.status}`,
    route:    "/cards",
    accent:   "#F97316",
    iconBg:   "#FFF2E8",
    Icon:     CreditCard,
    badge:    c.status !== "SOLD OUT" ? c.status : "Sold Out",
    price:    c.price,
  })),

  // FreeFire diamond packs
  ...diamondPacks.map((d) => ({
    id:       `ff-d-${d.id}`,
    source:   "freefire",
    title:    `${d.amount} Diamonds`,
    subtitle: "FreeFire Top-Up",
    meta:     d.bonus ? `${d.bonus} Pack` : "Diamond Pack",
    route:    "/freefire",
    accent:   "#06AED4",
    iconBg:   "#ECFCFF",
    Icon:     Gamepad2,
    badge:    d.bonus || null,
    price:    d.price,
  })),

  // FreeFire memberships
  ...memberships.map((m) => ({
    id:       `ff-m-${m.id}`,
    source:   "freefire",
    title:    m.name,
    subtitle: "FreeFire Pass",
    meta:     "Membership & Access",
    route:    "/freefire",
    accent:   "#06AED4",
    iconBg:   "#ECFCFF",
    Icon:     Gamepad2,
    badge:    null,
    price:    m.price,
  })),

  // Amazon deals
  ...amazonDeals.map((a) => ({
    id:       `amz-${a.id}`,
    source:   "amazon",
    title:    a.name,
    subtitle: a.category,
    meta:     `${a.discount}% off · ${a.couponCode}`,
    route:    "/amazon",
    accent:   "#D97706",
    iconBg:   "#FFFBEB",
    Icon:     ShoppingCart,
    badge:    a.tag,
    price:    a.discountedPrice,
  })),

  // Amazon lightning deals
  ...lightningDeals.map((l) => ({
    id:       `amz-ld-${l.id}`,
    source:   "amazon",
    title:    l.name,
    subtitle: "Lightning Deal",
    meta:     `${l.discount}% off · Ends ${l.endsIn}`,
    route:    "/amazon",
    accent:   "#D97706",
    iconBg:   "#FFFBEB",
    Icon:     Zap,
    badge:    "⚡ Flash",
    price:    l.discountedPrice,
  })),

  // Flipkart vouchers
  ...flipkartVouchers.map((f) => ({
    id:       `fk-${f.id}`,
    source:   "flipkart",
    title:    f.title,
    subtitle: f.category,
    meta:     f.description,
    route:    "/flipkart",
    accent:   "#2563EB",
    iconBg:   "#EFF6FF",
    Icon:     ShoppingBag,
    badge:    f.tag,
    price:    f.type === "paid" ? f.price : null,
  })),

  // Shein vouchers
  ...sheinVouchers.map((s) => ({
    id:       `shein-${s.id}`,
    source:   "shein",
    title:    s.title,
    subtitle: s.category,
    meta:     s.description,
    route:    "/shein",
    accent:   "#DB2777",
    iconBg:   "#FFF0F7",
    Icon:     Shirt,
    badge:    s.badge,
    price:    s.type === "paid" ? s.price : null,
  })),

  // General vouchers
  ...vouchers.map((v) => ({
    id:       `vch-${v.id}`,
    source:   "vouchers",
    title:    `${v.brand} — ${v.discount}`,
    subtitle: v.category,
    meta:     v.description,
    route:    "/voucher",
    accent:   "#7C3AED",
    iconBg:   "#F5F0FF",
    Icon:     Tag,
    badge:    v.type === "paid" ? "Paid" : "Free",
    price:    v.type === "paid" ? v.price : null,
  })),
];

const SEARCH_INDEX = buildIndex();

// ── Filter tabs ───────────────────────────────────────────────────────────────
const FILTERS = [
  { label: "All",      source: null },
  { label: "Cards",    source: "cards" },
  { label: "Gaming",   source: "freefire" },
  { label: "Amazon",   source: "amazon" },
  { label: "Flipkart", source: "flipkart" },
  { label: "Shein",    source: "shein" },
  { label: "Vouchers", source: "vouchers" },
];

const TRENDING = [
  { label: "FreeFire Diamonds", source: "freefire", accent: "#06AED4" },
  { label: "Amazon Deals",      source: "amazon",   accent: "#D97706" },
  { label: "Flipkart Voucher",  source: "flipkart", accent: "#2563EB" },
  { label: "Shein Credits",     source: "shein",    accent: "#DB2777" },
  { label: "Prepaid Cards",     source: "cards",    accent: "#F97316" },
];

// ── Result Card ───────────────────────────────────────────────────────────────
const ResultCard = ({ item, index }) => {
  const navigate = useNavigate();
  const { Icon } = item;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(item.route)}
      className="bg-white rounded-[18px] p-3.5 cursor-pointer
                 border border-black/[0.055]
                 shadow-[0_1px_4px_rgba(0,0,0,0.05)]
                 hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)]
                 transition-shadow duration-200 flex flex-col gap-2"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: item.iconBg }}
        >
          <Icon size={17} color={item.accent} strokeWidth={1.8} />
        </div>

        {/* Badge */}
        {item.badge && (
          <span
            className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0"
            style={{ background: item.iconBg, color: item.accent }}
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[9.5px] font-semibold uppercase tracking-[0.07em] text-[#8E8E93] mb-0.5">
          {item.subtitle}
        </p>
        <p className="text-[13px] font-bold text-[#1d1d1f] leading-tight line-clamp-2 mb-1">
          {item.title}
        </p>
        <p className="text-[11px] text-[#8E8E93] leading-relaxed line-clamp-2">
          {item.meta}
        </p>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-1 border-t border-black/[0.04]">
        {item.price ? (
          <span className="text-[12px] font-bold" style={{ color: item.accent }}>
            ₹{item.price.toLocaleString("en-IN")}
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-green-600">Free</span>
        )}
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: item.iconBg }}
        >
          <ChevronRight size={10} strokeWidth={2.5} style={{ color: item.accent }} />
        </div>
      </div>
    </motion.div>
  );
};

// ── Category Card (same as Landing) ──────────────────────────────────────────
const CatCard = ({ cat, i }) => {
  const navigate = useNavigate();
  const Icon = CAT_ICONS[cat.name] || Package;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.96 }}
      onClick={() => navigate(cat.route)}
      className="bg-white rounded-[18px] p-3.5 cursor-pointer
                 border border-black/[0.055]
                 shadow-[0_1px_4px_rgba(0,0,0,0.05)]
                 hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)]
                 transition-shadow duration-200"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5"
        style={{ background: cat.iconBg, color: cat.accent }}
      >
        <Icon size={17} strokeWidth={1.8} />
      </div>
      <p className="text-[9.5px] font-semibold uppercase tracking-[0.07em] text-[#8E8E93] mb-1.5">
        {cat.tag}
      </p>
      <h3 className="text-[14px] font-bold text-[#1d1d1f] tracking-tight mb-1">
        {cat.name}
      </h3>
      <p className="text-[11px] text-[#8E8E93] leading-relaxed mb-3">
        {cat.desc}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-[11.5px] font-semibold" style={{ color: cat.accent }}>
          Explore
        </span>
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: cat.iconBg }}
        >
          <ChevronRight size={10} strokeWidth={2.5} style={{ color: cat.accent }} />
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Search Page ──────────────────────────────────────────────────────────
const SearchPage = () => {
  const [query,  setQuery]  = useState("");
  const [filter, setFilter] = useState(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q && filter === null) return [];

    return SEARCH_INDEX.filter((item) => {
      const matchSource = filter === null || item.source === filter;
      const matchQuery  = !q || (
        item.title.toLowerCase().includes(q)    ||
        item.subtitle.toLowerCase().includes(q) ||
        item.meta.toLowerCase().includes(q)
      );
      return matchSource && matchQuery;
    }).slice(0, 60);
  }, [query, filter]);

  const isSearching = query.trim().length > 0 || filter !== null;

  const handleTrend = (t) => setFilter(t.source);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">

      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-10 bg-[#F5F5F7]/90 backdrop-blur-xl pt-5 pb-3 px-4">
        <div className="max-w-md mx-auto">

          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[22px] font-extrabold tracking-tight text-[#1d1d1f] mb-3"
          >
            Find your <span className="text-[#0071e3]">store</span>
          </motion.h1>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="flex items-center gap-2.5 bg-white rounded-2xl px-4 py-3
                       border border-black/[0.06] shadow-sm mb-3"
          >
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cards, vouchers, diamonds, deals..."
              className="flex-1 text-sm outline-none bg-transparent text-[#1d1d1f]
                         placeholder:text-gray-300"
              autoComplete="off"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={() => setQuery("")}
                  className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X size={11} className="text-gray-500" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTERS.map(({ label, source }) => {
              const active = filter === source;
              return (
                <motion.button
                  key={label}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setFilter(active ? null : source)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11.5px]
                              font-semibold border transition-all duration-200 ${
                    active
                      ? "bg-[#0071e3] border-[#0071e3] text-white"
                      : "bg-white border-gray-200 text-gray-500"
                  }`}
                >
                  {label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="px-4 pt-4 max-w-md mx-auto pb-28">

        {/* Default view — no search, no filter */}
        <AnimatePresence>
          {!isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
            >
              {/* Trending */}
              <div className="mb-6">
                <div className="flex items-center gap-1.5 mb-3">
                  <Flame size={13} className="text-orange-400" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-gray-400">
                    Trending
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING.map((t, i) => (
                    <motion.button
                      key={t.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleTrend(t)}
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl
                                 text-[12px] font-medium text-gray-700 border border-gray-100
                                 transition-colors active:bg-gray-50"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: t.accent }}
                      />
                      {t.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* All categories */}
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-gray-400 mb-3">
                All categories
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {categories.map((cat, i) => (
                  <CatCard key={cat.name} cat={cat} i={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search / filter results */}
        <AnimatePresence mode="wait">
          {isSearching && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Result count + clear */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-gray-400">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
                <button
                  onClick={() => { setQuery(""); setFilter(null); }}
                  className="text-[11px] text-[#0071e3] font-semibold"
                >
                  Clear all
                </button>
              </div>

              {results.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center
                                  justify-content mx-auto mb-4 justify-center">
                    <Search size={22} className="text-gray-300" />
                  </div>
                  <p className="font-bold text-[15px] text-gray-700 mb-1">
                    Kuch nahi mila
                  </p>
                  <p className="text-sm text-gray-400">
                    Try: Diamonds, Amazon, Visa, Voucher...
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {results.map((item, i) => (
                    <ResultCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SearchPage;