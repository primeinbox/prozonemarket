import React from 'react';

export default function Header() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: '#ffffff',
      borderBottom: '1px solid #f0f0f0',
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      padding: '10px 16px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>

      {/* Left — Garena logo + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Logo — plain, no background wrapper */}
        <img
          src="/images/garena_logo.png"
          alt="Garena"
          style={{ height: 28, objectFit: 'contain', display: 'block' }}
        />

        {/* Thin divider */}
        <div style={{ width: 1, height: 26, background: '#e8e8e8', flexShrink: 0 }} />

        {/* Title */}
        <div style={{ lineHeight: 1.25 }}>
          <div style={{
            fontSize: 11, fontWeight: 900,
            color: '#dc2626',                  /* ← red text */
            textTransform: 'uppercase', letterSpacing: 0.8,
          }}>
            Official Top Up
          </div>
          <div style={{
            fontSize: 9, fontWeight: 600, color: '#aaa',
            textTransform: 'uppercase', letterSpacing: 2,
          }}>
            Center
          </div>
        </div>
      </div>

      {/* Right — FF avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'linear-gradient(135deg, #dc2626, #ea580c)',
        padding: 2, flexShrink: 0,
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%',
          background: '#111', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img
            src="/images/ff_icon.png"
            alt="FF"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML =
                '<span style="color:#fff;font-size:11px;font-weight:900">FF</span>';
            }}
          />
        </div>
      </div>
    </header>
  );
}