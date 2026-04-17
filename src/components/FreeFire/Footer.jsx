import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Footer — reusable on all pages (login page, topup page, confirm page, etc.)
// Usage: import Footer from './Footer'; then <Footer />
// ─────────────────────────────────────────────────────────────────────────────

export default function Footer({ style = {} }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '18px 16px 20px',
      ...style,
    }}>
      <p style={{
        fontSize: 11, color: '#c0c0c0',
        fontWeight: 400, marginBottom: 8,
      }}>
        © Garena International. All rights reserved.
      </p>

      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}>
        {['FAQ', 'Help Center', 'Terms', 'Privacy'].map((item, i, arr) => (
          <React.Fragment key={item}>
            <span
              style={{
                fontSize: 11, color: '#b0b0b0', fontWeight: 500,
                padding: '0 7px', cursor: 'pointer',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.target.style.color = '#dc2626'}
              onMouseLeave={e => e.target.style.color = '#b0b0b0'}
            >
              {item}
            </span>
            {i < arr.length - 1 && (
              <span style={{ color: '#ddd', fontSize: 11 }}>|</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}