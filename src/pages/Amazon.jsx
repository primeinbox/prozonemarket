import React, { useState, useEffect } from "react";
import {
  amazonCategories,
  amazonDeals,
  lightningDeals,
} from "../data/amazon";

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#FF9900" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const PrimeIcon = () => (
  <svg width="38" height="14" viewBox="0 0 80 28" fill="none">
    <rect width="80" height="28" rx="4" fill="#00A8E0" />
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="sans-serif">
      prime
    </text>
  </svg>
);

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const BoltIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#FF9900" stroke="none">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const DeliveryIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

function ProductCard({ deal }) {
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(deal.couponCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const saved = deal.originalPrice - deal.discountedPrice;

  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {deal.tag && (
        <div
          className="px-3 py-1 text-xs font-bold text-white tracking-wide"
          style={{ backgroundColor: deal.tagColor }}
        >
          {deal.tag}
        </div>
      )}

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ backgroundColor: "#FFF8EE" }}
          >
            {deal.image}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug line-clamp-2">
              {deal.name}
            </p>
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ opacity: s <= Math.round(deal.rating) ? 1 : 0.25 }}>
                    <StarIcon />
                  </span>
                ))}
              </div>
              <span className="text-xs text-[#007185] dark:text-sky-400">
                {deal.rating} ({(deal.reviews / 1000).toFixed(0)}K)
              </span>
              {deal.prime && (
                <span className="ml-1">
                  <PrimeIcon />
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ₹{deal.discountedPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-sm line-through text-gray-400">
            ₹{deal.originalPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-sm font-semibold text-[#CC0C39] dark:text-red-400">
            {deal.discount}% off
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 px-2 py-0.5 rounded-full">
            Save ₹{saved.toLocaleString("en-IN")}
          </span>
          {deal.stock && (
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
              {deal.stock}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <DeliveryIcon />
          <span>
            <span className="font-medium text-gray-700 dark:text-gray-300">FREE delivery</span>{" "}
            {deal.deliveryDate}
          </span>
        </div>

        {deal.couponCode && (
          <div className="flex items-center gap-2 bg-[#FFF8EE] dark:bg-amber-900/20 border border-dashed border-[#FF9900] rounded-xl px-3 py-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Coupon code</p>
              <p className="font-mono text-sm font-bold text-gray-800 dark:text-amber-300 tracking-wider">
                {deal.couponCode}
              </p>
              {deal.couponOff && (
                <p className="text-xs text-[#CC0C39] dark:text-red-400 font-medium mt-0.5">
                  + {deal.couponOff}
                </p>
              )}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border"
              style={{
                backgroundColor: copied ? "#FF990018" : "transparent",
                borderColor: copied ? "#FF9900" : "#d1d5db",
                color: copied ? "#FF9900" : "#6b7280",
              }}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? "Done" : "Copy"}
            </button>
          </div>
        )}

        <button
          onClick={handleCart}
          className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95 border"
          style={{
            backgroundColor: added ? "#232F3E" : "#FF9900",
            borderColor: added ? "#232F3E" : "#e68a00",
            color: added ? "#FF9900" : "#111",
          }}
        >
          <CartIcon />
          {added ? "Added to Cart!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

function LightningDealCard({ deal }) {
  const barColor =
    deal.claimed > 80 ? "#CC0C39" : deal.claimed > 50 ? "#FF9900" : "#007185";

  return (
    <div className="flex-shrink-0 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="bg-[#232F3E] px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <BoltIcon />
          <span className="text-xs font-bold text-[#FF9900]">Lightning Deal</span>
        </div>
        <span className="text-xs text-white font-mono">{deal.endsIn}</span>
      </div>
      <div className="p-3">
        <div className="w-12 h-12 rounded-lg bg-[#FFF8EE] flex items-center justify-center text-2xl mx-auto mb-2">
          {deal.image}
        </div>
        <p className="text-xs font-medium text-gray-800 dark:text-gray-100 text-center line-clamp-2 mb-2 leading-snug">
          {deal.name}
        </p>
        <div className="flex items-baseline justify-center gap-1.5 mb-2">
          <span className="text-base font-bold text-gray-900 dark:text-white">
            ₹{deal.discountedPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-xs line-through text-gray-400">
            ₹{deal.originalPrice.toLocaleString("en-IN")}
          </span>
        </div>
        <span className="block text-center text-xs font-bold mb-1.5" style={{ color: barColor }}>
          {deal.discount}% off
        </span>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{ width: `${deal.claimed}%`, backgroundColor: barColor }}
          />
        </div>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          {deal.claimed}% claimed
        </p>
      </div>
    </div>
  );
}

export default function Amazon() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [search, setSearch] = useState("");

  let filtered = amazonDeals.filter((d) => {
    const catMatch = activeCategory === "All" || d.category === activeCategory;
    const searchMatch =
      search.trim() === "" ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  if (sortBy === "price_asc") filtered = [...filtered].sort((a, b) => a.discountedPrice - b.discountedPrice);
  if (sortBy === "price_desc") filtered = [...filtered].sort((a, b) => b.discountedPrice - a.discountedPrice);
  if (sortBy === "discount") filtered = [...filtered].sort((a, b) => b.discount - a.discount);
  if (sortBy === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-[#EAEDED] dark:bg-gray-950">
      {/* Navbar */}
      <div className="bg-[#232F3E] sticky top-0 z-20 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-[#FF9900] font-black text-2xl tracking-tighter">amazon</span>
            <span className="text-[#FF9900] text-xs self-end mb-0.5">.in</span>
          </div>
          <div className="flex-1 flex items-center bg-white rounded-lg overflow-hidden border-2 border-[#FF9900]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands..."
              className="flex-1 px-3 py-2 text-sm text-gray-800 outline-none bg-white"
            />
            <button className="px-3 py-2 bg-[#FF9900] hover:bg-[#e68a00] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-white text-xs font-medium">
            <CartIcon />
            <span>Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 space-y-6">
        {/* Lightning Deals */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BoltIcon />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Lightning Deals</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">Ends soon</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {lightningDeals.map((ld) => (
              <LightningDealCard key={ld.id} deal={ld} />
            ))}
          </div>
        </section>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-wrap">
            {amazonCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                  activeCategory === cat
                    ? "bg-[#FF9900] border-[#FF9900] text-[#111]"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-[#FF9900] hover:text-[#FF9900]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none flex-shrink-0"
          >
            <option value="default">Sort: Featured</option>
            <option value="discount">Highest Discount</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
          Showing <span className="font-semibold text-gray-700 dark:text-gray-200">{filtered.length}</span> results
          {activeCategory !== "All" && ` in "${activeCategory}"`}
          {search && ` for "${search}"`}
        </p>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
            <p className="text-5xl mb-3">🔍</p>
            <p className="font-semibold text-gray-700 dark:text-gray-300">No products found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((deal) => (
              <ProductCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>

      {/* Footer strip */}
      <div className="mt-10 bg-[#232F3E] py-4 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Amazon.in — Demo UI · Prices are illustrative
        </p>
      </div>
    </div>
  );
}