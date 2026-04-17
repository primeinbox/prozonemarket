// CardItem.jsx
import React from 'react';

const tierConfig = {
  GOLD:    { badge: 'badge-gold',    barColor: 'linear-gradient(90deg,#b8860b,#ffd700,#b8860b)' },
  ELITE:   { badge: 'badge-elite',   barColor: 'linear-gradient(90deg,#6d28d9,#a78bfa,#6d28d9)' },
  LUXURY:  { badge: 'badge-luxury',  barColor: 'linear-gradient(90deg,#0f766e,#2dd4bf,#0f766e)' },
  PREMIUM: { badge: 'badge-premium', barColor: 'linear-gradient(90deg,#1d4ed8,#60a5fa,#1d4ed8)' },
};

const CardItemMarket2 = ({ card, onBuy }) => {
  const isSoldOut = card.status === 'SOLD OUT';
  const tier = tierConfig[card.type?.toUpperCase()] || tierConfig.GOLD;

  return (
    <div
      style={{
        background: '#0f0f0f',
        border: '1px solid #1c1c1c',
        borderRadius: 14,
        padding: 12,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        opacity: isSoldOut ? 0.45 : 1,
        filter: isSoldOut ? 'grayscale(0.6)' : 'none',
        overflow: 'hidden',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Tier color bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 2, background: tier.barColor,
      }} />

      {/* Top row: badge + status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, marginTop: 4 }}>
        <span className={`sc-badge ${tier.badge}`}>{card.type}</span>
        {isSoldOut
          ? <span style={{ fontSize: 9, color: '#555', fontWeight: 700, letterSpacing: 0.5 }}>SOLD OUT</span>
          : <span style={{ fontSize: 9, color: '#ef4444', fontWeight: 700 }}>{card.status}</span>
        }
      </div>

      {/* Name & number */}
      <div style={{ fontSize: 10, fontWeight: 600, color: '#666', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>
        {card.name}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#e8e8e8', letterSpacing: 1, marginBottom: 10, fontFamily: "'Rajdhani', sans-serif" }}>
        {card.number}
      </div>

      {/* Limit / Expiry */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
        background: '#080808', borderRadius: 8, padding: '7px 8px', marginBottom: 10,
      }}>
        <div>
          <div style={{ fontSize: 9, color: '#444', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Limit</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: isSoldOut ? '#ccc' : '#22c55e' }}>{card.limit}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: '#444', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Expiry</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#ccc' }}>{card.expiry}</div>
        </div>
      </div>

      {/* Footer: price + button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div>
          <div style={{ fontSize: 9, color: '#444', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 1 }}>Price</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: "'Rajdhani', sans-serif", lineHeight: 1 }}>
            ₹{card.price}
          </div>
        </div>

        {isSoldOut ? (
          <button style={{
            background: '#1a1a1a', color: '#444', border: '1px solid #222',
            borderRadius: 7, padding: '6px 10px', fontSize: 11, fontWeight: 700,
            cursor: 'not-allowed', textTransform: 'uppercase',
          }}>N/A</button>
        ) : (
          <button
            onClick={() => onBuy(card)}
            style={{
              background: '#fff', color: '#000', border: 'none',
              borderRadius: 7, padding: '6px 14px', fontSize: 11,
              fontWeight: 800, letterSpacing: 1, cursor: 'pointer',
              textTransform: 'uppercase', transition: 'transform 0.1s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >BUY</button>
        )}
      </div>
    </div>
  );
};

export default CardItemMarket2;