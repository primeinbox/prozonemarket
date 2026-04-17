import React from 'react';

export default function Hero() {
  return (
    <div style={{
      position: 'relative',
      height: 190,
      background: '#0a0a0a',
      overflow: 'hidden',
    }}>

      {/* Banner image */}
      <img
        src="/images/ff_banner.png"
        alt="Free Fire Banner"
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center top',
          opacity: 0.9, display: 'block',
        }}
        onError={e => {
          e.target.style.display = 'none';
          e.target.parentNode.style.background =
            'linear-gradient(135deg,#1a0000 0%,#7f1d1d 50%,#dc2626 100%)';
        }}
      />

      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background:
          'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
      }} />

      {/* DIAMONDS DISCOUNT — large background text like Image 1 */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        zIndex: 2, padding: '10px 12px',
        lineHeight: 1.05,
        pointerEvents: 'none',
      }}>
        <div style={{
          fontSize: 46, fontWeight: 900, fontStyle: 'italic',
          color: 'rgba(255,255,255,0.18)',
          letterSpacing: '-1px',
          textTransform: 'uppercase',
          userSelect: 'none',
        }}>
          DIAMONDS
        </div>
        <div style={{
          fontSize: 46, fontWeight: 900, fontStyle: 'italic',
          color: 'rgba(255,255,255,0.18)',
          letterSpacing: '-1px',
          textTransform: 'uppercase',
          userSelect: 'none',
        }}>
          DISCOUNT
        </div>
      </div>

      {/* Bottom content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        zIndex: 3,
        padding: '0 12px 14px',
        display: 'flex', alignItems: 'flex-end', gap: 12,
      }}>

        {/* Game icon + HOT badge */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 54, height: 54, borderRadius: 12,
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
            background: '#111',
          }}>
            <img
              src="/images/ff_icon.png"
              alt="Free Fire"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => {
                e.target.style.display = 'none';
                e.target.parentNode.style.background =
                  'linear-gradient(135deg,#dc2626,#ff4500)';
                e.target.parentNode.style.display = 'flex';
                e.target.parentNode.style.alignItems = 'center';
                e.target.parentNode.style.justifyContent = 'center';
                e.target.parentNode.innerHTML =
                  '<span style="color:#fff;font-size:18px;font-weight:900">FF</span>';
              }}
            />
          </div>
          {/* HOT tag */}
          <div style={{
            position: 'absolute', top: -7, left: -5,
            background: '#dc2626', color: '#fff',
            fontSize: 8, fontWeight: 900,
            padding: '2px 5px', borderRadius: 4,
            letterSpacing: 0.5, lineHeight: 1.4,
          }}>
            HOT
          </div>
        </div>

        {/* Title + secure badge */}
        <div style={{ paddingBottom: 2 }}>
          <div style={{
            color: '#fff', fontSize: 20, fontWeight: 900, fontStyle: 'italic',
            letterSpacing: '-0.3px', lineHeight: 1,
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            marginBottom: 6,
          }}>
            Free Fire
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff', fontSize: 10, fontWeight: 600,
            padding: '3px 10px', borderRadius: 20,
          }}>
            <span style={{ fontSize: 11 }}>🛡️</span>
            100% Secure Payment
          </div>
        </div>
      </div>
    </div>
  );
}