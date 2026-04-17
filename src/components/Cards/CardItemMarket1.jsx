// CardItem.jsx
import React from 'react';

const NET_LOGO  = { 'Mastercard Gold':'M', 'RuPay':'R', 'VISA Classic':'V', 'VISA Gold':'V', 'VISA Platinum':'V', 'Mastercard':'M' };
const NET_COLOR = { 'Mastercard Gold':'#f59e0b', 'RuPay':'#22c55e', 'VISA Classic':'#60a5fa', 'VISA Gold':'#f59e0b', 'VISA Platinum':'#c4b5fd', 'Mastercard':'#f97316' };

const CardItemMarket1 = ({ card, onBuy }) => {
  const logo  = NET_LOGO[card.type]  || 'C';
  const color = NET_COLOR[card.type] || '#aaa';

  return (
    <div style={{ borderRadius:14, overflow:'hidden', background:'#0d0d1f', border:'1px solid #1e1e35' }}>

      {/* Top — purple gradient */}
      <div style={{ background:'linear-gradient(135deg,#1a1a4a 0%,#12123a 50%,#0f0f2e 100%)', padding:'12px 12px 14px', position:'relative', minHeight:90 }}>
        {/* shine line */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)' }} />

        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
          {/* Network logo */}
          <div style={{ width:26, height:26, borderRadius:6, background:`${color}11`, border:`1px solid ${color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color }}>
            {logo}
          </div>
          {/* Badges */}
          <div style={{ display:'flex', gap:4, flexWrap:'wrap', justifyContent:'flex-end' }}>
            {card.refundable && (
              <span style={{ background:'#22c55e22', border:'1px solid #22c55e55', color:'#4ade80', fontSize:8, fontWeight:700, padding:'2px 6px', borderRadius:4, letterSpacing:.5 }}>Refundable</span>
            )}
            <span style={{ display:'flex', alignItems:'center', gap:3, background:'rgba(0,0,0,.35)', border:'1px solid rgba(255,255,255,.1)', color:'#fff', fontSize:8, fontWeight:600, padding:'2px 7px', borderRadius:4 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'#f97316' }} />
              In Stock
            </span>
          </div>
        </div>

        <div style={{ fontSize:10, fontWeight:500, color:'rgba(255,255,255,.4)', marginBottom:3, letterSpacing:.5 }}>{card.type}</div>
        <div style={{ fontFamily:"'Rajdhani', sans-serif", fontSize:26, fontWeight:700, color:'#fff', letterSpacing:1, lineHeight:1 }}>
          {card.num}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ padding:'10px 12px 12px', background:'#0d0d1f' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4 }}>
          <span style={{ fontSize:9.5, color:'#444', fontWeight:500 }}>Limit</span>
          <span style={{ fontSize:12, fontWeight:700, color:'#aaa' }}>{card.limit}</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
          <span style={{ fontSize:9.5, color:'#444', fontWeight:500 }}>Expiry</span>
          <span style={{ fontSize:12, fontWeight:700, color:'#aaa' }}>{card.expiry}</span>
        </div>

        <div style={{ marginBottom:10 }}>
          <span style={{ fontFamily:"'Rajdhani', sans-serif", fontSize:22, fontWeight:700, color:'#f97316', letterSpacing:.5 }}>₹{card.price}</span>
        </div>

        <button
          onClick={() => onBuy(card)}
          onMouseDown={e => e.currentTarget.style.transform='scale(.96)'}
          onMouseUp={e => e.currentTarget.style.transform='scale(1)'}
          style={{ width:'100%', background:'linear-gradient(135deg,#f97316,#ea580c)', border:'none', borderRadius:9, padding:10, fontSize:12, fontWeight:800, color:'#fff', cursor:'pointer', fontFamily:"'Space Grotesk', sans-serif", letterSpacing:.5, transition:'transform .1s' }}
        >Buy Now</button>
      </div>
    </div>
  );
};

export default CardItemMarket1;