import React from 'react';
import { diamondPacks, memberships } from '../../../data/ff/content';

// ── Diamond SVG Icon ──────────────────────────────────────────────────────────
function DiamondIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <polygon points="14,3 25,11 14,25 3,11" fill="#e8f4fd" stroke="#4fc3f7" strokeWidth="1"/>
      <polygon points="14,3 25,11 14,15" fill="#81d4fa"/>
      <polygon points="14,3 3,11 14,15" fill="#b3e5fc"/>
      <polygon points="14,15 25,11 14,25" fill="#4fc3f7"/>
      <polygon points="14,15 3,11 14,25" fill="#29b6f6"/>
      <line x1="3" y1="11" x2="25" y2="11" stroke="#4dd0e1" strokeWidth="0.8"/>
      <line x1="14" y1="3" x2="14" y2="25" stroke="#81d4fa" strokeWidth="0.5" strokeDasharray="2,2"/>
    </svg>
  );
}

// ── Selected Checkmark Badge ──────────────────────────────────────────────────
function CheckBadge() {
  return (
    <div style={{
      position: 'absolute', top: 0, right: 0,
      width: 22, height: 22,
      background: '#c0392b',
      borderTopRightRadius: 13,
      borderBottomLeftRadius: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2,
    }}>
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <polyline
          points="2,5.5 4.5,8 9,3"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ── Diamond Card ──────────────────────────────────────────────────────────────
function DiamondCard({ item, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(item)}
      style={{
        position: 'relative',
        background: isSelected ? '#fff5f4' : '#fff',
        border: isSelected ? '1.5px solid #c0392b' : '0.5px solid #e8e8e8',
        borderRadius: 14,
        padding: '12px 8px 10px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        transform: isSelected ? 'scale(0.97)' : 'scale(1)',
        textAlign: 'center',
        outline: 'none',
        width: '100%',
      }}
    >
      {/* Selected checkmark — top right */}
      {isSelected && <CheckBadge />}

      {/* Bonus badge — top left */}
      {item.bonus ? (
        <div style={{
          position: 'absolute', top: 0, left: 0,
          background: item.bonus === 'Hot' ? '#e74c3c'
                    : item.bonus === 'Popular' ? '#f39c12'
                    : '#c0392b',
          color: '#fff',
          fontSize: 7, fontWeight: 600,
          padding: '3px 7px',
          borderTopLeftRadius: 13,
          borderBottomRightRadius: 10,
          textTransform: 'uppercase', letterSpacing: 0.8,
        }}>{item.bonus}</div>
      ) : null}

      {/* Diamond icon */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
        <DiamondIcon size={28} />
      </div>

      {/* Amount */}
      <div style={{
        fontSize: 15, fontWeight: 600, color: '#111', lineHeight: 1,
      }}>{item.amount}</div>

      {/* Label */}
      <div style={{
        fontSize: 8, color: '#aaa',
        textTransform: 'uppercase', letterSpacing: 1, margin: '2px 0 7px',
      }}>Diamonds</div>

      {/* Price */}
      <div style={{
        fontSize: 11, fontWeight: 600, color: '#c0392b',
        background: 'rgba(192,57,43,0.07)',
        borderRadius: 6, padding: '4px 0',
        fontFamily: 'monospace',
      }}>₹{item.price}</div>
    </button>
  );
}

// ── Membership Card ───────────────────────────────────────────────────────────
function MembershipCard({ item, isSelected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(item)}
      style={{
        position: 'relative',
        flexShrink: 0,
        width: 110,
        background: isSelected ? '#fff5f4' : '#fff',
        border: isSelected ? '1.5px solid #c0392b' : '0.5px solid #e8e8e8',
        borderRadius: 14,
        padding: 10,
        cursor: 'pointer',
        transition: 'all 0.15s',
        transform: isSelected ? 'scale(0.97)' : 'scale(1)',
      }}
    >
      {/* Selected checkmark — top right */}
      {isSelected && <CheckBadge />}

      {/* Image */}
      <div style={{
        width: '100%', height: 64,
        borderRadius: 10, overflow: 'hidden',
        marginBottom: 8,
        background: '#f5f5f5',
      }}>
        <img
          src={item.img}
          alt={item.name}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
          }}
          onError={e => {
            e.target.style.display = 'none';
            e.target.parentNode.style.background =
              'linear-gradient(135deg, #1a1a2e, #c0392b)';
          }}
        />
      </div>

      {/* Name */}
      <div style={{
        fontSize: 9, fontWeight: 600, color: '#222',
        textTransform: 'uppercase', letterSpacing: 0.4,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        marginBottom: 4,
      }}>{item.name}</div>

      {/* Price */}
      <div style={{
        fontSize: 13, fontWeight: 700, color: '#c0392b',
        fontFamily: 'monospace',
      }}>₹{item.price}</div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function TopUpGrid({ selected, onSelect }) {
  return (
    <div style={{ padding: '24px 16px 20px' }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        border: '0.5px solid #f0f0f0',
        boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
        padding: '14px 16px 20px',
        marginBottom: 16,
      }}>

        {/* ── Section Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 28, height: 28, background: '#c0392b', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 13, fontWeight: 600, flexShrink: 0,
          }}>2</div>
          <h2 style={{
            fontSize: 13, fontWeight: 600, color: '#111',
            margin: 0, textTransform: 'uppercase', letterSpacing: 0.6,
          }}>Select Top-Up Amount</h2>
        </div>

        {/* ── Diamonds Label ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <div  />
          <span style={{
            fontSize: 10, fontWeight: 700, color: '#0288d1',
            textTransform: 'uppercase', letterSpacing: 1.2,
          }}>◆ Diamonds</span>
        </div>

        {/* ── 3-col Diamond Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 8,
          marginBottom: 20,
        }}>
          {diamondPacks.map(item => (
            <DiamondCard
              key={item.id}
              item={item}
              isSelected={selected?.id === item.id}
              onSelect={onSelect}
            />
          ))}
        </div>

        {/* ── Memberships Label ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: '#c0392b',
            textTransform: 'uppercase', letterSpacing: 1.2,
          }}>🎟️ Memberships & Passes</span>
        </div>

        {/* ── Horizontal Swipe Row ── */}
        <div style={{
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          paddingBottom: 4,
          // hide scrollbar
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}>
          {memberships.map(item => (
            <MembershipCard
              key={item.id}
              item={item}
              isSelected={selected?.id === item.id}
              onSelect={onSelect}
            />
          ))}
        </div>

      </div>
    </div>
  );
}