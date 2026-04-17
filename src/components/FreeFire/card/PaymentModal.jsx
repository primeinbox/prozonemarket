import React, { useState, useEffect, useRef } from 'react';
import { UPI_ID, TIMER_SECONDS } from '../../../data/ff/content';

// ─────────────────────────────────────────────────────────────────────────────
// PaymentModal — dark bottom-sheet with:
//   • countdown timer (auto-closes at 0)
//   • dynamic QR code via api.qrserver.com
//   • UPI ID copy button
//   • transaction ID input (required)
//   • success screen after submit
//
// Props:
//   isOpen   bool
//   onClose  fn
//   card     object|null — selected item { price, amount, name }
// ─────────────────────────────────────────────────────────────────────────────
export default function PaymentModal({ isOpen, onClose, card }) {
  const [txnId,     setTxnId]     = useState('');
  const [copied,    setCopied]    = useState(false);
  const [secs,      setSecs]      = useState(TIMER_SECONDS);
  const [submitted, setSubmitted] = useState(false);
  const [txnFocus,  setTxnFocus]  = useState(false);
  const intervalRef = useRef(null);

  // Reset + start timer every time modal opens
  useEffect(() => {
    if (!isOpen) {
      clearInterval(intervalRef.current);
      return;
    }
    setSecs(TIMER_SECONDS);
    setTxnId('');
    setSubmitted(false);

    intervalRef.current = setInterval(() => {
      setSecs(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          onClose();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isOpen]);

  if (!isOpen || !card) return null;

  // ── Timer display ──
  const mins = Math.floor(secs / 60);
  const sec  = String(secs % 60).padStart(2, '0');

  // ── QR URL — encodes actual UPI deep-link ──
  const upiData = `upi://pay?pa=${UPI_ID}&am=${card.price}&cu=INR&tn=FreeFire-TopUp`;
  const qrUrl   = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(upiData)}`;

  // ── Copy UPI ID ──
  const copyUpi = () => {
    navigator.clipboard?.writeText(UPI_ID).catch(() => {
      // Fallback for environments without clipboard API
      const el = document.createElement('input');
      el.value = UPI_ID;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Submit ──
  const handleSubmit = () => {
    if (!txnId.trim() || txnId.trim().length < 6) {
      alert('Please enter a valid Transaction ID (at least 6 characters)');
      return;
    }
    clearInterval(intervalRef.current);
    setSubmitted(true);
    // Auto-close after 3s
    setTimeout(() => { onClose(); setSubmitted(false); }, 3000);
  };

  // ── Item label helper ──
  const itemLabel = card.amount ? `${card.amount} Diamonds` : (card.name || '');

  return (
    <>
      <style>{`
        @keyframes modalSlideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes timerPulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
        @keyframes successPop {
          0%   { transform: scale(0.6); opacity: 0; }
          70%  { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        onClick={e => e.target === e.currentTarget && onClose()}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}
      >
        {/* ── Sheet ── */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#0d0d0d',
            width: '100%', maxWidth: 440,
            borderRadius: '28px 28px 0 0',
            border: '1px solid rgba(255,255,255,0.07)',
            borderBottom: 'none',
            padding: '0 22px 40px',
            paddingBottom: 'max(40px, env(safe-area-inset-bottom, 40px))',
            position: 'relative',
            animation: 'modalSlideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
            maxHeight: '96vh',
            overflowY: 'auto',
          }}
        >

          {/* Drag pill */}
          <div style={{
            width: 40, height: 4, borderRadius: 2,
            background: 'rgba(255,255,255,0.1)',
            margin: '14px auto 24px',
          }} />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 20, right: 18,
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)', fontSize: 14,
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, transition: 'background 0.15s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
          >✕</button>

          {/* ── SUCCESS SCREEN ── */}
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '30px 0 20px' }}>
              <div style={{
                fontSize: 64, marginBottom: 16,
                animation: 'successPop 0.4s ease',
              }}>✅</div>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 900, marginBottom: 8 }}>
                Order Submitted!
              </div>
              <div style={{ color: '#555', fontSize: 13, lineHeight: 1.6 }}>
                Transaction ID: <span style={{ color: '#aaa', fontFamily: 'monospace' }}>{txnId}</span>
              </div>
              <div style={{ color: '#555', fontSize: 12, marginTop: 8 }}>
                Diamonds will be credited within 5–10 minutes.
              </div>
            </div>

          ) : (
            <>
              {/* ── Timer ── */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(220,38,38,0.1)',
                border: '1px solid rgba(220,38,38,0.25)',
                color: '#f87171',
                padding: '5px 14px', borderRadius: 99,
                fontSize: 10, fontWeight: 800,
                letterSpacing: 1.5, textTransform: 'uppercase',
                marginBottom: 18,
              }}>
                <span style={{
                  width: 7, height: 7, background: '#dc2626',
                  borderRadius: '50%', display: 'inline-block',
                  animation: 'timerPulse 1s infinite',
                }} />
                Expires in {mins}:{sec}
              </div>

              {/* ── Title ── */}
              <h2 style={{
                color: '#fff', fontSize: 13, fontWeight: 900,
                textTransform: 'uppercase', letterSpacing: 2.5,
                fontStyle: 'italic', margin: '0 0 20px',
              }}>Secure UPI Payment</h2>

              {/* ── QR Code ── */}
              <div style={{ textAlign: 'center', marginBottom: 18 }}>
                <div style={{
                  display: 'inline-block',
                  background: '#fff', padding: 14, borderRadius: 22,
                  boxShadow: '0 0 40px rgba(255,255,255,0.05)',
                }}>
                  <img
                    src={qrUrl}
                    alt="Scan to Pay"
                    style={{ width: 170, height: 170, display: 'block' }}
                  />
                </div>
                <div style={{
                  color: '#555', fontSize: 10, marginTop: 8,
                  textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600,
                }}>Scan with any UPI app</div>
              </div>

              {/* ── Amount ── */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{
                  color: '#fff', fontSize: 44, fontWeight: 900,
                  fontFamily: 'monospace', letterSpacing: -2, lineHeight: 1,
                }}>₹{card.price}</div>
                <div style={{
                  color: '#555', fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4,
                }}>{itemLabel}</div>
              </div>

              {/* ── UPI ID row ── */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: '12px 16px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: 12,
              }}>
                <div>
                  <div style={{
                    fontSize: 9, color: '#555', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 3,
                  }}>Pay to UPI ID</div>
                  <div style={{
                    color: '#ddd', fontSize: 13,
                    fontFamily: 'monospace', fontWeight: 600,
                  }}>{UPI_ID}</div>
                </div>

                <button
                  onClick={copyUpi}
                  style={{
                    fontSize: 10, fontWeight: 900, border: 'none',
                    padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: copied ? '#16a34a' : '#ffffff',
                    color: copied ? '#fff' : '#000',
                  }}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              {/* ── Transaction ID input ── */}
              <input
                type="text"
                value={txnId}
                onChange={e => setTxnId(e.target.value)}
                placeholder="Enter Transaction / UTR ID"
                onFocus={() => setTxnFocus(true)}
                onBlur={() => setTxnFocus(false)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${txnFocus ? 'rgba(220,38,38,0.6)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 14, padding: '15px 16px',
                  color: '#fff', fontSize: 13, fontWeight: 700,
                  textAlign: 'center', letterSpacing: 1.5,
                  fontFamily: 'monospace',
                  outline: 'none', marginBottom: 14,
                  transition: 'border-color 0.2s',
                  textTransform: 'uppercase',
                }}
              />

              {/* ── Instruction note ── */}
              <div style={{
                fontSize: 10, color: '#444', fontWeight: 600,
                textAlign: 'center', marginBottom: 16,
                lineHeight: 1.5,
              }}>
                After paying, enter the 12-digit UTR/Transaction ID from your UPI app
              </div>

              {/* ── Submit button ── */}
              <button
                onClick={handleSubmit}
                style={{
                  width: '100%', border: 'none',
                  borderRadius: 18, padding: '17px',
                  fontSize: 12, fontWeight: 900,
                  textTransform: 'uppercase', letterSpacing: 2,
                  cursor: txnId ? 'pointer' : 'not-allowed',
                  transition: 'all 0.25s',
                  background: txnId ? '#dc2626' : '#1c1c1c',
                  color: txnId ? '#fff' : '#3a3a3a',
                  boxShadow: txnId ? '0 6px 28px rgba(220,38,38,0.32)' : 'none',
                }}
                onMouseDown={e => { if (txnId) e.currentTarget.style.transform = 'scale(0.97)'; }}
                onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                ✓ Confirm Payment
              </button>

              {/* ── Security note ── */}
              <div style={{
                textAlign: 'center', marginTop: 16,
                fontSize: 9, color: '#333',
                fontWeight: 700, letterSpacing: 2,
                textTransform: 'uppercase',
              }}>
                🔒 256-bit SSL Encrypted & Secured
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}