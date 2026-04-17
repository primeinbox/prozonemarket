import { useState, useEffect } from "react";

const categories = [
  {
    name: "Cards",
    route: "/cards",
    accent: "#f97316",
    tag: "Gift & Prepaid",
    desc: "Redeem digital gift cards across top platforms. Instant delivery, zero hassle.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="3"/>
        <path d="M2 10h20"/>
      </svg>
    ),
  },
  {
    name: "Vouchers",
    route: "/voucher",
    accent: "#a78bfa",
    tag: "Coupons & Deals",
    desc: "Exclusive discount vouchers for shopping, food, travel, and entertainment.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <path d="M9 12h6M9 16h4"/>
      </svg>
    ),
  },
  {
    name: "FreeFire",
    route: "/freefire",
    accent: "#22d3ee",
    tag: "Gaming Top-Up",
    desc: "Top up diamonds instantly. Power up your squad and dominate the battlefield.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    name: "Amazon",
    route: "/amazon",
    accent: "#f59e0b",
    tag: "E-Commerce",
    desc: "Amazon balance top-ups and gift cards. Shop millions of products instantly.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    name: "Flipkart",
    route: "/flipkart",
    accent: "#60a5fa",
    tag: "SuperCoins & More",
    desc: "Flipkart gift vouchers for fashion, electronics, and daily essentials.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
  {
    name: "Shein",
    route: "/shein",
    accent: "#f472b6",
    tag: "Fashion & Style",
    desc: "Shein credits for trendy fashion. Thousands of styles, updated daily.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
      </svg>
    ),
  },
];

const Particle = ({ style }) => (
  <div
    style={{
      position: "absolute",
      width: 2,
      height: 2,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.15)",
      ...style,
    }}
  />
);

const Landing = () => {
  const [hovered, setHovered] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const nav = (route) => {
    window.location.href = route;
  };

  const particles = [
    { top: "12%", left: "8%" },
    { top: "28%", left: "92%" },
    { top: "55%", left: "5%" },
    { top: "72%", left: "85%" },
    { top: "88%", left: "20%" },
    { top: "40%", left: "96%" },
    { top: "6%", left: "65%" },
    { top: "93%", left: "55%" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080810",
        color: "#e8e8f0",
        fontFamily: "'Sora', 'Nunito', system-ui, sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Nunito:wght@300;400;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.4; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes floatDot {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        .card-wrap {
          cursor: pointer;
          border-radius: 18px;
          transition: transform 0.28s cubic-bezier(.22,.68,0,1.2);
        }
        .card-wrap:hover { transform: translateY(-5px) scale(1.015); }

        .card-inner {
          border-radius: 18px;
          background: #0e0e1c;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 22px 20px 18px;
          height: 100%;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s ease;
        }
        .card-wrap:hover .card-inner {
          border-color: rgba(255,255,255,0.13);
        }

        .card-glow {
          position: absolute;
          top: -40px; right: -40px;
          width: 100px; height: 100px;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        .card-wrap:hover .card-glow { opacity: 0.22; }

        .tag-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 9px;
          border-radius: 99px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.4);
          margin-bottom: 10px;
        }

        .arrow-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px; height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          transition: background 0.2s, border-color 0.2s;
        }
        .card-wrap:hover .arrow-btn {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.18);
        }

        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #a78bfa 40%, #f472b6 60%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .secure-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #4ade80;
          position: relative;
        }
        .secure-dot::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: #4ade80;
          animation: pulseRing 1.8s ease-out infinite;
        }

        .float-particle {
          animation: floatDot 3s ease-in-out infinite;
        }

        .grid-item-enter {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.5s ease forwards;
        }
      `}</style>

      {/* Ambient background orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-10%", left: "20%",
          width: 340, height: 340, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)",
        }}/>
        <div style={{
          position: "absolute", bottom: "5%", right: "10%",
          width: 280, height: 280, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)",
        }}/>
        <div style={{
          position: "absolute", top: "45%", left: "-5%",
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(244,114,182,0.05) 0%, transparent 70%)",
        }}/>
        {particles.map((p, i) => (
          <Particle key={i} style={{ ...p, animationDelay: `${i * 0.4}s` }} />
        ))}
      </div>

      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 60,
        background: "rgba(8,8,16,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky", top: 0, zIndex: 100,
        animation: "fadeUp 0.4s ease both",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Logo mark */}
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #a78bfa, #f472b6)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.08em", color: "#fff" }}>
            prozone<span style={{ color: "#a78bfa" }}>MARKET</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div className="secure-dot"/>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#4ade80", letterSpacing: "0.1em" }}>
            SECURE
          </span>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        textAlign: "center",
        padding: "52px 24px 36px",
        position: "relative", zIndex: 1,
        animation: "fadeUp 0.5s ease 0.1s both",
      }}>
        {/* Eyebrow */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 14px", borderRadius: 99,
          background: "rgba(167,139,250,0.08)",
          border: "1px solid rgba(167,139,250,0.2)",
          marginBottom: 18,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#a78bfa" }} className="float-particle"/>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#a78bfa", textTransform: "uppercase" }}>
            Digital Marketplace
          </span>
        </div>

        <h2 style={{
          fontSize: "clamp(26px, 7vw, 38px)",
          fontWeight: 700,
          lineHeight: 1.15,
          marginBottom: 14,
        }}>
          <span className="shimmer-text">Buy. Redeem. Play.</span>
          <br/>
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.75em", fontWeight: 400 }}>
            All your digital needs, one place.
          </span>
        </h2>

        <p style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.35)",
          maxWidth: 320,
          margin: "0 auto",
          lineHeight: 1.7,
          fontWeight: 300,
        }}>
          Instant delivery · Verified sellers · Secure transactions
        </p>
      </section>

      {/* Category Grid */}
      <section style={{
        padding: "0 18px 100px",
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          maxWidth: 480,
          margin: "0 auto",
        }}>
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              className="card-wrap grid-item-enter"
              style={{ animationDelay: `${0.15 + i * 0.07}s` }}
              onClick={() => nav(cat.route)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="card-inner">
                {/* Glow orb */}
                <div className="card-glow" style={{ background: cat.accent }}/>

                {/* Icon */}
                <div style={{
                  display: "inline-flex",
                  padding: 9,
                  borderRadius: 12,
                  background: `${cat.accent}14`,
                  border: `1px solid ${cat.accent}28`,
                  color: cat.accent,
                  marginBottom: 12,
                  transition: "background 0.3s",
                }}>
                  {cat.icon}
                </div>

                {/* Tag */}
                <div className="tag-badge">{cat.tag}</div>

                {/* Name */}
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 6,
                  letterSpacing: "-0.01em",
                }}>
                  {cat.name}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: 11.5,
                  color: "rgba(255,255,255,0.35)",
                  lineHeight: 1.65,
                  fontWeight: 300,
                  marginBottom: 16,
                }}>
                  {cat.desc}
                </p>

                {/* Bottom row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: cat.accent,
                    opacity: 0.7,
                  }}>
                    Explore
                  </span>
                  <div className="arrow-btn">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>

                {/* Subtle corner accent */}
                <div style={{
                  position: "absolute",
                  bottom: 0, right: 0,
                  width: 60, height: 60,
                  background: `radial-gradient(circle at bottom right, ${cat.accent}10, transparent 70%)`,
                  borderRadius: "0 0 18px 0",
                  pointerEvents: "none",
                }}/>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Nav bar */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "12px 16px 18px",
        background: "rgba(8,8,16,0.92)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        zIndex: 100,
      }}>
        {[
          {
            label: "Home",
            active: true,
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
          },
          {
            label: "Search",
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
          },
          {
            label: "Orders",
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
          },
          {
            label: "Account",
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
          },
        ].map((item) => (
          <button
            key={item.label}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer",
              color: item.active ? "#a78bfa" : "rgba(255,255,255,0.28)",
              transition: "color 0.2s",
              padding: "4px 10px",
            }}
          >
            {item.icon}
            <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.06em" }}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Landing;