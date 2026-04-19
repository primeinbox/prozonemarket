import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, TrendingUp, CreditCard, Tag, Gamepad2,
  ShoppingCart, ShoppingBag, Shirt, ChevronRight, Flame,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";

const CATEGORY_ICONS = {
  Cards:    CreditCard,
  Vouchers: Tag,
  FreeFire: Gamepad2,
  Amazon:   ShoppingCart,
  Flipkart: ShoppingBag,
  Shein:    Shirt,
};

const FILTERS = [
  { label: "All",          tag: null },
  { label: "Gift Cards",   tag: "Gift & Prepaid" },
  { label: "Gaming",       tag: "Gaming Top-Up" },
  { label: "Shopping",     tag: "E-Commerce" },
  { label: "Fashion",      tag: "Fashion & Style" },
  { label: "Vouchers",     tag: "Coupons & Deals" },
];

const TRENDING = [
  { label: "FreeFire Diamonds", color: "#06AED4", name: "FreeFire" },
  { label: "Amazon Gift Card",  color: "#D97706", name: "Amazon"   },
  { label: "Flipkart Voucher",  color: "#2563EB", name: "Flipkart" },
  { label: "Shein Credits",     color: "#DB2777", name: "Shein"    },
  { label: "Prepaid Cards",     color: "#F97316", name: "Cards"    },
];

const CategoryCard = ({ cat, index }) => {
  const navigate = useNavigate();
  const Icon = CATEGORY_ICONS[cat.name] || CreditCard;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => navigate(cat.route)}
      className="bg-white rounded-2xl p-4 cursor-pointer border border-black/[0.06] hover:shadow-md transition-shadow duration-200"
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
        style={{ background: cat.iconBg }}
      >
        <Icon size={20} color={cat.accent} strokeWidth={1.8} />
      </div>

      {/* Tag */}
      <p
        className="text-[10px] font-bold uppercase tracking-wider mb-1"
        style={{ color: cat.accent }}
      >
        {cat.tag}
      </p>

      {/* Name */}
      <p className="text-[15px] font-bold tracking-tight text-gray-900 mb-1">
        {cat.name}
      </p>

      {/* Desc */}
      <p className="text-[11.5px] text-gray-400 leading-relaxed">
        {cat.desc}
      </p>

      {/* Arrow */}
      <div className="flex justify-end mt-2">
        <ChevronRight size={14} className="text-gray-300" />
      </div>
    </motion.div>
  );
};

const SearchPage = () => {
  const [query,  setQuery]  = useState("");
  const [filter, setFilter] = useState(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    let list = categories;
    if (filter) list = list.filter((c) => c.tag === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.tag.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, filter]);

  const handleTrend = (item) => {
    const match = categories.find((c) => c.name === item.name);
    if (match) navigate(match.route);
  };

  const isSearching = query.trim().length > 0 || filter !== null;

  return (
    <div className="min-h-screen bg-[#F5F5F7]">

      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-10 bg-[#F5F5F7]/90 backdrop-blur-xl pt-5 pb-3 px-4">
        <div className="max-w-md mx-auto">

          {/* Title */}
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
            className="flex items-center gap-2.5 bg-white rounded-2xl px-4 py-3 border border-black/[0.06] shadow-sm mb-3"
          >
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cards, vouchers, gaming..."
              className="flex-1 text-sm outline-none bg-transparent text-[#1d1d1f] placeholder:text-gray-300"
              autoComplete="off"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setQuery("")}
                  className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <X size={11} className="text-gray-500" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Filter chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
          >
            {FILTERS.map(({ label, tag }) => {
              const active = filter === tag;
              return (
                <motion.button
                  key={label}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(tag)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11.5px] font-semibold border transition-all duration-200 ${
                    active
                      ? "bg-[#0071e3] border-[#0071e3] text-white"
                      : "bg-white border-gray-200 text-gray-500"
                  }`}
                >
                  {label}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="px-4 pt-4 max-w-md mx-auto pb-28">

        {/* Trending section */}
        <AnimatePresence>
          {!isSearching && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex items-center gap-1.5 mb-3">
                <Flame size={13} className="text-orange-400" />
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-gray-400">
                  Trending
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map((item, i) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleTrend(item)}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl text-[12px] font-medium text-gray-700 border border-gray-100 active:bg-gray-50 transition-colors"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: item.color }}
                    />
                    {item.label}
                    <TrendingUp size={11} className="text-gray-300" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results label */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-gray-400">
            {isSearching
              ? `${results.length} result${results.length !== 1 ? "s" : ""}`
              : "All categories"}
          </p>
          {isSearching && (
            <button
              onClick={() => { setQuery(""); setFilter(null); }}
              className="text-[11px] text-[#0071e3] font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Grid / Empty */}
        <AnimatePresence mode="wait">
          {results.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-300" />
              </div>
              <p className="font-bold text-base text-gray-700 mb-1">
                Kuch nahi mila
              </p>
              <p className="text-sm text-gray-400">
                Try karo: Amazon, FreeFire, Voucher...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-2.5"
            >
              {results.map((cat, i) => (
                <CategoryCard key={cat.name} cat={cat} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SearchPage;