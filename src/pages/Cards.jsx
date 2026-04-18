import React, { useState, useEffect, useRef } from "react";

import CardItemMarket1 from "../components/Cards/CardItemMarket1";
import CardItemMarket2 from "../components/Cards/CardItemMarket2";

import { market1 } from "../data/cards/market1";
import { market2 } from "../data/cards/market2";
import PaymentModal from "../components/PaymentModal";

const CATEGORIES = ["All","Mastercard Gold","RuPay","VISA Classic","VISA Gold","VISA Platinum","Mastercard"];
const NAMES = ["Aman","Neon","Vikram","Rahul","Arjun","Dev","Sahil","Kabir","Rohan","Ankit","Harsh","Yash","Nikhil","Gaurav","Tushar","Varun","Shubham","Deepak","Faiz","Kunal"];
const LIVE_MSGS = [
  (n) => `${n}: working card mil gaya 🔥`,
  (n) => `${n}: payment smooth tha 🙌`,
  (n) => `${n}: bhai legit hai kya? 👀`,
  (n) => `${n}: restock kab hoga? 😤`,
  (n) => `${n}: card declined nahi hua 🫡`,
  (n) => `${n}: ek aur leke aaya 😎`,
  (n) => `${n}: transaction approved ✅`,
];
const PURCHASE_MSGS = [
  (n, c) => `${n} grabbed ${c}`,
  (n, c) => `${n} secured ${c}`,
  (n, c) => `Checkout complete for ${n}`,
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const parseAmount = (val) => {
  if (!val) return 0;
  return Number(val.replace(/[^0-9]/g, "")); // ₹ $ remove
};
// ─── STYLES ─────────────────────────────────────────────────────────────
const S = {
  app: {
    background: "#060810",
    minHeight: "100vh",
    fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif",
    color: "#e8eaf0",
    paddingBottom: 80,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "13px 16px",
    background: "#060810ee",
    borderBottom: "1px solid #12162a",
    position: "sticky",
    top: 0,
    zIndex: 50,
    backdropFilter: "blur(12px)",
  },
  logoDot: {
    width: 8, height: 8,
    background: "#22c55e",
    borderRadius: "50%",
    boxShadow: "0 0 10px #22c55e99",
    animation: "pulseDot 2s infinite",
  },
  logoText: {
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: 3,
    color: "#fff",
    textTransform: "uppercase",
  },
  marketSwitch: {
    display: "flex",
    gap: 4,
    background: "#0d1020",
    padding: 4,
    borderRadius: 10,
    border: "1px solid #1a1f3a",
  },
  liveBar: {
    margin: "10px 14px 0",
    padding: "9px 14px",
    background: "#0a0e1a",
    border: "1px solid #12162a",
    borderLeft: "3px solid #22c55e",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  liveDot: {
    width: 6, height: 6,
    background: "#22c55e",
    borderRadius: "50%",
  },
  liveLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: "#22c55e",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  statsBar: {
    display: "flex",
    gap: 8,
    padding: "10px 14px 0",
  },
  statChip: {
    flex: 1,
    background: "#0a0e1a",
    border: "1px solid #12162a",
    borderRadius: 8,
    padding: "8px 10px",
    textAlign: "center",
  },
  statNum: { fontSize: 15, fontWeight: 700, color: "#22c55e" },
  statLbl: { fontSize: 10, color: "#445", letterSpacing: 0.5, marginTop: 2 },
  sectionLabel: {
    padding: "14px 14px 8px",
    fontSize: 11,
    fontWeight: 700,
    color: "#3a4060",
    letterSpacing: 2,
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  sectionLine: { flex: 1, height: 1, background: "#12162a" },
  toastZone: {
    position: "fixed",
    bottom: 12, left: 12, right: 12,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    zIndex: 200,
    pointerEvents: "none",
  },
  toast: {
    background: "#0d1020",
    border: "1px solid #1a1f3a",
    borderLeft: "3px solid #22c55e",
    padding: "9px 12px",
    borderRadius: 8,
    fontSize: 12,
    color: "#8892aa",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "#00000088",
    zIndex: 300,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  modalBox: {
    background: "#0a0e1a",
    borderTop: "1px solid #1a1f3a",
    borderRadius: "18px 18px 0 0",
    padding: "20px 18px 36px",
    width: "100%",
    maxWidth: 480,
  },
  modalHandle: {
    width: 36, height: 4,
    background: "#1a1f3a",
    borderRadius: 2,
    margin: "0 auto 18px",
  },
  
};

// ─── LIVE BAR ────────────────────────────────────────────────────────────
const LiveBar = () => {
  const [msg, setMsg] = useState({ name: "Aman", text: "working card mil gaya 🔥" });
  const [visible, setVisible] = useState(true);
  const idx = useRef(0);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        const name = rand(NAMES);
        const full = LIVE_MSGS[idx.current % LIVE_MSGS.length](name);
        idx.current++;
        setMsg({ name, text: full.replace(`${name}: `, "") });
        setVisible(true);
      }, 300);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={S.liveBar}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
        <div style={S.liveDot} className="blink" />
        <span style={S.liveLabel}>Live</span>
      </div>
      <span style={{
        fontSize: 12, color: "#8892aa",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(5px)",
        transition: "all .3s",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        <b style={{ color: "#e8eaf0" }}>{msg.name}:</b> {msg.text}
      </span>
    </div>
  );
};

// ─── TOAST MANAGER ───────────────────────────────────────────────────────
const ToastManager = () => {
  const [toasts, setToasts] = useState([]);

  const add = (custom) => {
    const name = rand(NAMES);
    const allCards = [...market1, ...market2];
    const card = rand(allCards);
    const msg = custom || rand(PURCHASE_MSGS)(name, card.type);
    const id = Date.now() + Math.random();
    setToasts((p) => [...p.slice(-1), { id, msg }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4500);
  };

  useEffect(() => {
    const loop = () => setTimeout(() => { add(); loop(); }, 5000 + Math.random() * 5000);
    const t = setTimeout(() => { add(); loop(); }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={S.toastZone}>
      {toasts.map((t) => (
        <div key={t.id} style={S.toast}>
          <span style={{ color: "#22c55e", marginRight: 6 }}>●</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
};

// ─── CARD ITEM ───────────────────────────────────────────────────────────
const TAG_STYLE = {
  live: { background: "#22c55e18", color: "#22c55e", border: "1px solid #22c55e33" },
  hot:  { background: "#f9731618", color: "#f97316", border: "1px solid #f9731633" },
  fresh:{ background: "#3b82f618", color: "#3b82f6", border: "1px solid #3b82f633" },
};

const CardItem = ({ card, onBuy }) => {
  const isM2 = card.market === "m2";
  const accent = isM2 ? "#f97316" : "#22c55e";

  return (
    <div style={{
      background: "#0a0e1a",
      border: `1px solid #12162a`,
      borderRadius: 14,
      padding: 12,
      display: "flex",
      flexDirection: "column",
      gap: 9,
      position: "relative",
      overflow: "hidden",
      transition: "border-color .2s, transform .2s",
      cursor: "pointer",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = accent + "44"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#12162a"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${accent}44, transparent)`,
      }} />

      {/* type + tag */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: accent, letterSpacing: 1.5, textTransform: "uppercase" }}>
          {card.type}
        </span>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: "3px 7px", borderRadius: 4,
          letterSpacing: 0.5, textTransform: "uppercase",
          ...TAG_STYLE[card.tag],
        }}>
          {card.tag}
        </span>
      </div>

      {/* card visual */}
      <div style={{
        background: "#0d1020",
        border: "1px solid #161b30",
        borderRadius: 8,
        padding: "9px 11px",
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      }}>
        <div style={{ fontSize: 11, color: "#8892aa", letterSpacing: 2, fontWeight: 600 }}>
          **** **** **** {card.num}
        </div>
        <div style={{ fontSize: 10, color: "#3a4060", marginTop: 3 }}>{card.type}</div>
      </div>

      {/* balance */}
      <div style={{ fontSize: 17, fontWeight: 700 }}>
        ₹{card.balance.toLocaleString("en-IN")}
        <span style={{ fontSize: 11, color: "#3a4060", fontWeight: 400, marginLeft: 4 }}>bal</span>
      </div>

      {/* price + id */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: accent }}>₹{card.price}</span>
        <span style={{ fontSize: 10, color: "#2a3050" }}>#{card.id}</span>
      </div>

      {/* buy button */}
      <button
        onClick={() => onBuy(card)}
        style={{
          width: "100%", padding: "9px 0",
          background: accent, border: "none", borderRadius: 9,
          color: "#000", fontFamily: "inherit", fontSize: 11,
          fontWeight: 800, cursor: "pointer", letterSpacing: 0.5,
          textTransform: "uppercase", transition: "opacity .15s",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        Buy Now
      </button>
    </div>
  );
};


// ─── MAIN ────────────────────────────────────────────────────────────────
const Cards = () => {
  const [market, setMarket] = useState("m1");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState({ isOpen: false, card: null });

  const data = market === "m1" ? market1 : market2;
  const filtered = market === "m1"
    ? data.filter(c => {
        const q = search.toLowerCase();
        const fMatch = filter === "All" || c.type === filter;
        const sMatch = !q || c.type.toLowerCase().includes(q);
        return fMatch && sMatch;
      })
    : data;

const normalized = filtered.map(c => ({
  id: c.id,
  type: c.type,

  // last 4 digits ya pura number jo bhi ho data mein
  num: c.num || c.number || "0000",

  // limit field — balance ya limit jo bhi available ho
  limit: c.limit || (c.balance != null ? `₹${Number(c.balance).toLocaleString('en-IN')}` : "N/A"),

  // balance alag rakhna chahte ho toh
  balance: c.balance != null ? Number(c.balance) : parseAmount(c.limit),

  expiry: c.expiry || c.exp || c.validity || "N/A",
  price: c.price,
  tag: c.tag || "live",
  market: market,

  // refundable field — data mein hai toh pass karo, nahi toh false
  refundable: c.refundable || false,
}));

const openPayment = (card) => {
  setModal({ isOpen: true, card });
};

  return (
    <div style={S.app}>
      {/* ── CSS injected for animations ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.2} }
        .blink { animation: blink 1.4s infinite; }
        input::placeholder { color: #3a4060; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { height: 4px; background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1a1f3a; border-radius: 2px; }
      `}</style>

      {/* HEADER */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={S.logoDot} />
          <span style={S.logoText}>Cards</span>
        </div>
        <div style={S.marketSwitch}>
          {["m1", "m2"].map(m => (
            <button key={m} onClick={() => setMarket(m)} style={{
              padding: "5px 14px", border: "none", borderRadius: 7,
              fontFamily: "inherit", fontSize: 11, fontWeight: 700, cursor: "pointer",
              letterSpacing: 0.5, transition: "all .2s",
              background: market === m ? "#22c55e" : "transparent",
              color: market === m ? "#000" : "#666",
            }}>
              Market {m === "m1" ? "1" : "2"}
            </button>
          ))}
        </div>
      </div>

      {/* LIVE BAR */}
      <LiveBar />

      {/* SEARCH + FILTER (M1 only) */}
      {market === "m1" && (
        <div style={{ padding: "12px 14px 0" }}>
          <div style={{ position: "relative", marginBottom: 10 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#3a4060", fontSize: 16 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search cards..."
              style={{
                width: "100%", padding: "10px 12px 10px 38px",
                background: "#0d1020", border: "1px solid #1a1f3a",
                borderRadius: 10, color: "#e8eaf0",
                fontFamily: "inherit", fontSize: 13, outline: "none",
                transition: "border-color .2s",
              }}
              onFocus={e => e.target.style.borderColor = "#22c55e44"}
              onBlur={e => e.target.style.borderColor = "#1a1f3a"}
            />
          </div>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding: "5px 13px", borderRadius: 20,
                fontFamily: "inherit", fontSize: 11, fontWeight: 700,
                whiteSpace: "nowrap", cursor: "pointer",
                transition: "all .2s",
                background: filter === c ? "#22c55e" : "#0d1020",
                color: filter === c ? "#000" : "#556",
                border: filter === c ? "none" : "1px solid #1a1f3a",
              }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STATS */}
      <div style={S.statsBar}>
        {[
          { num: filtered.length, lbl: "Cards" },
          { num: "🟢 Live", lbl: "Status" },
          { num: market === "m1" ? "M1" : "M2", lbl: "Market" },
        ].map((s, i) => (
          <div key={i} style={S.statChip}>
            <div style={S.statNum}>{s.num}</div>
            <div style={S.statLbl}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* SECTION LABEL */}
      <div style={S.sectionLabel}>
        <span>{market === "m1" ? "Market 1 Cards" : "Market 2 Cards"}</span>
        <div style={S.sectionLine} />
      </div>

      {/* GRID — 2 col mobile, 3 col tablet, 4 col desktop (M1 only for 4-col) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: market === "m1"
          ? "repeat(auto-fill, minmax(160px, 1fr))"
          : "repeat(2, 1fr)",
        gap: 10,
        padding: "0 14px",
      }}
        className={market === "m1" ? "m1-grid" : ""}
      >
        <style>{`
          @media (min-width: 900px) {
            .m1-grid { grid-template-columns: repeat(4, 1fr) !important; }
          }
          @media (min-width: 600px) and (max-width: 899px) {
            .m1-grid { grid-template-columns: repeat(3, 1fr) !important; }
          }
        `}</style>

        {filtered.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px", color: "#2a3050", fontSize: 14 }}>
            No cards found 🔍
          </div>
        ) : (
          normalized.map(card => (
  market === "m1"
    ? <CardItemMarket1 key={card.id} card={card} onBuy={openPayment}/>
    : <CardItemMarket2 key={card.id} card={card} onBuy={openPayment}/>
))
        )}
      </div>

      {/* MODAL */}
      <PaymentModal
        isOpen={modal.isOpen}
        card={modal.card}
        onClose={() => setModal({ isOpen: false, card: null })}
      />

      {/* TOASTS */}
      <ToastManager />
    </div>
  );
};

export default Cards;