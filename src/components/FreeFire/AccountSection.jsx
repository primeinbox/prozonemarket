import React, { useState } from 'react';

// ── Login Form ────────────────────────────────────────────────────────────────
function LoginForm({ uid, setUid, onLogin }) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: '#111', overflow: 'hidden', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid #e8e8e8',
        }}>
          <img
            src="/images/ff_icon.png"
            alt="Free Fire"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => {
              e.target.style.display = 'none';
              e.target.parentNode.style.background = '#dc2626';
              e.target.parentNode.innerHTML =
                '<span style="color:#fff;font-size:13px;font-weight:900">FF</span>';
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#111', marginBottom: 2 }}>
            Player ID (UID)
          </div>
          <div style={{ fontSize: 11, color: '#999', fontWeight: 500 }}>
            You can find your UID in the game profile
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="tel"
          value={uid}
          onChange={e => setUid(e.target.value.replace(/\D/g, ''))}
          placeholder="Player ID (UID)"
          maxLength={12}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, minWidth: 0,
            background: '#fafafa',
            border: `1.5px solid ${focused ? '#dc2626' : '#ebebeb'}`,
            borderRadius: 10, padding: '12px 14px',
            fontSize: 14, fontWeight: 500,
            fontFamily: 'inherit', outline: 'none',
            transition: 'border-color 0.2s', color: '#111',
          }}
        />
        <button
          onClick={onLogin}
          style={{
            background: '#dc2626', color: '#fff', border: 'none',
            borderRadius: 10, padding: '12px 22px',
            fontSize: 14, fontWeight: 800,
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Login
        </button>
      </div>
    </div>
  );
}

// ── Profile Row ───────────────────────────────────────────────────────────────
function ProfileRow({ uid, onLogout }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        overflow: 'hidden', flexShrink: 0,
        border: '2px solid #f0f0f0',
        background: '#dc2626',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img
          src="/images/ff_icon.png" alt="avatar"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => {
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = '<span style="color:#fff;font-size:18px">🔥</span>';
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 10, color: '#aaa', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2,
        }}>Player ID</div>
        <div style={{
          fontSize: 15, fontWeight: 900, color: '#111',
          fontFamily: 'monospace', letterSpacing: 0.5,
        }}>{uid}</div>
      </div>
      <button
        onClick={onLogout}
        style={{
          fontSize: 12, fontWeight: 800, color: '#dc2626',
          background: 'transparent', border: 'none',
          cursor: 'pointer', padding: '6px 0',
          display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        ↔ Change
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AccountSection({
  uid, setUid, isLoggedIn, setIsLoggedIn, onLogout,
}) {
  const handleLogin = () => {
    if (uid.length < 6) {
      alert('Please enter a valid Player ID (minimum 6 digits)');
      return;
    }
    localStorage.setItem('ff_uid', uid);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('ff_uid');
    setIsLoggedIn(false);
    setUid('');
    if (onLogout) onLogout();
  };

  return (
    <div style={{ padding: '10px 12px 0' }}>
      <div style={{
        background: '#fff',
        borderRadius: 14,
        border: '1px solid #efefef',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        padding: '14px',
      }}>
        {/* "1  Account" header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
          <div style={{
            width: 26, height: 26, background: '#dc2626', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, color: '#fff', fontSize: 13, fontStyle: 'italic',
            flexShrink: 0,
          }}>1</div>
          <h2 style={{
            fontSize: 14, fontWeight: 900, color: '#111',
            margin: 0, textTransform: 'uppercase', letterSpacing: 0.5,
          }}>Account</h2>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#f5f5f5', margin: '0 -14px 14px' }} />

        {isLoggedIn
          ? <ProfileRow uid={uid} onLogout={handleLogout} />
          : <LoginForm uid={uid} setUid={setUid} onLogin={handleLogin} />
        }
      </div>
    </div>
  );
}