// PaymentModal.jsx
import React, { useState, useEffect, useRef } from 'react';

const UPI_ID = "suryadeep01@fam";
const TIMER_SECONDS = 895;
const PROCESSING_SECONDS = 150; // 2.5 min processing wait

const PaymentModal = ({ isOpen, onClose, card }) => {
  const [txnId, setTxnId]       = useState('');
  const [copied, setCopied]     = useState(false);
  const [secs, setSecs]         = useState(TIMER_SECONDS);
  const [phase, setPhase]       = useState('payment'); // 'payment' | 'processing' | 'done'
  const [procSecs, setProcSecs] = useState(PROCESSING_SECONDS);
  const [dots, setDots]         = useState('');

  const timerRef = useRef(null);
  const procRef  = useRef(null);
  const dotsRef  = useRef(null);

  // Reset everything when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      clearInterval(timerRef.current);
      clearInterval(procRef.current);
      clearInterval(dotsRef.current);
      return;
    }
    setTxnId('');
    setPhase('payment');
    setSecs(TIMER_SECONDS);
    setProcSecs(PROCESSING_SECONDS);
    setDots('');

    // Countdown timer
    timerRef.current = setInterval(() => {
      setSecs(s => {
        if (s <= 1) { clearInterval(timerRef.current); onClose(); return 0; }
        return s - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(procRef.current);
      clearInterval(dotsRef.current);
    };
  }, [isOpen]);

  // Animated dots while processing
  useEffect(() => {
    if (phase !== 'processing') { clearInterval(dotsRef.current); return; }
    dotsRef.current = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);
    return () => clearInterval(dotsRef.current);
  }, [phase]);

  if (!isOpen || !card) return null;

  const mins = Math.floor(secs / 60);
  const sec  = String(secs % 60).padStart(2, '0');
  const procMins = Math.floor(procSecs / 60);
  const procSec  = String(procSecs % 60).padStart(2, '0');
  const progress = ((PROCESSING_SECONDS - procSecs) / PROCESSING_SECONDS) * 100;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${UPI_ID}%26am=${card.price}`;

  const copyUpi = () => {
    navigator.clipboard?.writeText(UPI_ID).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSubmit = () => {
    if (!txnId.trim()) {
      document.getElementById('txn-input').style.borderColor = '#dc2626';
      return;
    }

    // Switch to processing phase
    setPhase('processing');
    clearInterval(timerRef.current); // stop countdown during processing

    // Processing countdown
    setProcSecs(PROCESSING_SECONDS);
    procRef.current = setInterval(() => {
      setProcSecs(s => {
        if (s <= 1) {
          clearInterval(procRef.current);
          setPhase('done');
          // Auto close after showing "done" for 3s
          setTimeout(() => onClose(), 3000);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  // ── PROCESSING SCREEN ──────────────────────────────────────────
  if (phase === 'processing' || phase === 'done') {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,.88)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}>
        <div style={{
          background: '#111', border: '1px solid #1e1e1e',
          borderRadius: '22px 22px 0 0',
          padding: '28px 20px 42px',
          width: '100%', maxWidth: 420,
          position: 'relative', textAlign: 'center',
          animation: 'slideUp .25s ease',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          <div style={{ width: 36, height: 4, background: '#2a2a2a', borderRadius: 2, margin: '0 auto 24px' }} />

          {/* Manual close always works */}
          <button onClick={onClose} style={{
            position: 'absolute', top: 18, right: 18,
            background: '#1a1a1a', border: '1px solid #222',
            color: '#888', width: 28, height: 28, borderRadius: '50%',
            fontSize: 14, cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>✕</button>

          {phase === 'processing' ? (
            <>
              {/* Spinner */}
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                border: '3px solid #1e1e1e',
                borderTop: '3px solid #dc2626',
                margin: '0 auto 20px',
                animation: 'spin 1s linear infinite',
              }} />

              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 6, textTransform: 'uppercase', letterSpacing: .5 }}>
                Verifying Payment{dots}
              </div>
              <div style={{ fontSize: 11, color: '#555', marginBottom: 24 }}>
                Do not close this window
              </div>

              {/* TXN ID display */}
              <div style={{
                background: '#0a0a0a', border: '1px solid #1c1c1c',
                borderRadius: 10, padding: '10px 14px', marginBottom: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>TXN ID</span>
                <span style={{ fontSize: 12, color: '#aaa', fontFamily: 'monospace' }}>{txnId}</span>
              </div>

              {/* Progress bar */}
              <div style={{ background: '#1a1a1a', borderRadius: 99, height: 4, marginBottom: 10, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: '#dc2626',
                  borderRadius: 99, width: `${progress}%`,
                  transition: 'width 1s linear',
                }} />
              </div>

              <div style={{ fontSize: 10, color: '#444', letterSpacing: .5 }}>
                Est. time: {procMins}:{procSec} remaining
              </div>

              {/* Status steps */}
              <div style={{ marginTop: 24, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Payment received',     done: true },
                  { label: 'Bank verification',     done: procSecs < 110 },
                  { label: 'Card details preparing', done: procSecs < 60 },
                  { label: 'Delivery ready',         done: false },
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: step.done ? '#22c55e20' : '#1a1a1a',
                      border: `1px solid ${step.done ? '#22c55e60' : '#2a2a2a'}`,
                      fontSize: 9, color: step.done ? '#22c55e' : '#333',
                      transition: 'all .5s ease',
                    }}>
                      {step.done ? '✓' : '○'}
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: step.done ? 600 : 400,
                      color: step.done ? '#ccc' : '#444',
                      transition: 'color .5s ease',
                    }}>{step.label}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // DONE STATE
            <>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: '#22c55e20', border: '2px solid #22c55e60',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', fontSize: 28,
              }}>✓</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#22c55e', marginBottom: 6, textTransform: 'uppercase', letterSpacing: .5 }}>
                Payment Verified!
              </div>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 24 }}>
                Card details will be sent shortly on Telegram
              </div>
              <div style={{
                background: '#0a0a0a', border: '1px solid #1c1c1c',
                borderRadius: 10, padding: '10px 14px',
                fontSize: 12, color: '#aaa', fontFamily: 'monospace',
              }}>TXN: {txnId}</div>
            </>
          )}
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes slideUp { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        `}</style>
      </div>
    );
  }

  // ── PAYMENT SCREEN ─────────────────────────────────────────────
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,.85)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div style={{
        background: '#111', border: '1px solid #1e1e1e',
        borderRadius: '22px 22px 0 0',
        padding: '20px 18px 36px',
        width: '100%', maxWidth: 420,
        position: 'relative', textAlign: 'center',
        animation: 'slideUp .25s ease',
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        <div style={{ width: 36, height: 4, background: '#2a2a2a', borderRadius: 2, margin: '0 auto 18px' }} />

        <button onClick={onClose} style={{
          position: 'absolute', top: 18, right: 18,
          background: '#1a1a1a', border: '1px solid #222',
          color: '#888', width: 28, height: 28, borderRadius: '50%',
          fontSize: 14, cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>✕</button>

        <div style={{
          display: 'inline-block', background: '#dc262620',
          border: '1px solid #dc262640', color: '#ef4444',
          fontSize: 10, fontWeight: 700, padding: '3px 10px',
          borderRadius: 6, marginBottom: 14, letterSpacing: .5,
        }}>⏱ {mins}:{sec}</div>

        <h2 style={{ fontSize: 15, fontWeight: 800, textTransform: 'uppercase', letterSpacing: .5, marginBottom: 16, color: '#fff' }}>
          Visa Signature Secure Payment
        </h2>

        <div style={{ background: '#fff', borderRadius: 14, padding: 14, marginBottom: 14, display: 'flex', justifyContent: 'center' }}>
          <img src={qrUrl} alt="QR Code" style={{ width: 160, height: 160 }} />
        </div>

        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 36, fontWeight: 700, marginBottom: 14, color: '#fff' }}>
          ₹{card.price}
        </div>

        <div style={{
          background: '#0a0a0a', border: '1px solid #1c1c1c',
          borderRadius: 10, padding: '10px 14px', marginBottom: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 12, color: '#aaa', fontFamily: 'monospace' }}>{UPI_ID}</span>
          <span onClick={copyUpi} style={{
            fontSize: 10, fontWeight: 700, color: '#22c55e',
            border: '1px solid #22c55e40', padding: '3px 8px',
            borderRadius: 5, background: '#22c55e10', cursor: 'pointer',
          }}>{copied ? 'COPIED!' : 'COPY'}</span>
        </div>

        <input
          id="txn-input"
          value={txnId}
          onChange={e => setTxnId(e.target.value)}
          placeholder="ENTER TRANSACTION ID"
          style={{
            width: '100%', background: '#0a0a0a',
            border: '1px solid #1e1e1e',
            borderRadius: 10, padding: '13px 14px',
            color: '#fff', fontSize: 13,
            fontFamily: "'Space Grotesk', sans-serif",
            textAlign: 'center', letterSpacing: 1,
            marginBottom: 12, outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = '#dc2626'}
          onBlur={e => e.target.style.borderColor = '#1e1e1e'}
        />

        <button onClick={handleSubmit} style={{
          width: '100%', background: '#dc2626', border: 'none',
          borderRadius: 11, padding: 14,
          fontSize: 14, fontWeight: 800, color: '#fff',
          cursor: 'pointer', letterSpacing: .5,
          fontFamily: "'Space Grotesk', sans-serif",
          textTransform: 'uppercase',
        }}>SUBMIT PAYMENT</button>
      </div>

      <style>{`
        @keyframes slideUp { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default PaymentModal;