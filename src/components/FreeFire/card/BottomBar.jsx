import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// BottomBar — fixed bottom bar that slides in when an item is selected
//
// Props:
//   item    object   — selected pack { amount, price, name? }
//   onBuy   fn       — called when "Proceed to Pay" is tapped
// ─────────────────────────────────────────────────────────────────────────────
export default function BottomBar({ item, onBuy }) {
  if (!item) return null;

  return (
    <>
      {/* ── Keyframe for slide-up animation ── */}
      <style>{`
        @keyframes barSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid #f0f0f0',
        boxShadow: '0 -6px 32px rgba(0,0,0,0.10)',
        padding: '14px 20px',
        /* Safe area padding for phones with home indicator */
        paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
        animation: 'barSlideUp 0.28s ease',
      }}>
        <div style={{
          maxWidth: 480, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16,
        }}>

          {/* Left — price info */}
          <div>
            <div style={{
              fontSize: 9, fontWeight: 700, color: '#aaa',
              textTransform: 'uppercase', letterSpacing: 2, lineHeight: 1,
            }}>Total Payable</div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <span style={{
                fontSize: 28, fontWeight: 900, color: '#111',
                fontStyle: 'italic', fontFamily: 'monospace', letterSpacing: -1,
              }}>₹{item.price}</span>

              <span style={{
                fontSize: 9, fontWeight: 800, color: '#dc2626',
                background: '#fef2f2', padding: '2px 7px', borderRadius: 6,
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>Secure</span>
            </div>

            {/* Item label */}
            <div style={{ fontSize: 10, color: '#aaa', fontWeight: 600, marginTop: 1 }}>
              {item.amount ? `${item.amount} Diamonds` : item.name}
            </div>
          </div>

          {/* Right — CTA button */}
          <button
            onClick={onBuy}
            style={{
              background: '#dc2626', color: '#fff', border: 'none',
              borderRadius: 18, padding: '16px 28px',
              fontSize: 12, fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: 1.5,
              cursor: 'pointer',
              boxShadow: '0 6px 22px rgba(220,38,38,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              display: 'flex', alignItems: 'center', gap: 8,
              whiteSpace: 'nowrap',
            }}
            onMouseDown={e => {
              e.currentTarget.style.transform = 'scale(0.95)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(220,38,38,0.25)';
            }}
            onMouseUp={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(220,38,38,0.35)';
            }}
            onTouchStart={e => {
              e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onTouchEnd={e => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Proceed to Pay
            <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>
          </button>
        </div>
      </div>
    </>
  );
}