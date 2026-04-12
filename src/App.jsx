import React, { useState, useEffect, useRef } from 'react';
import { cards } from './data';
import CardItem from './components/CardItem';
import PaymentModal from './components/PaymentModal';

const CATEGORIES = ['All','Mastercard Gold','RuPay','VISA Classic','VISA Gold','VISA Platinum','Mastercard'];
const NAMES = ['Aman','Neon','Vikram','Rahul','Arjun','Dev','Sahil','Kabir','Rohan','Ankit','Harsh','Yash','Nikhil','Gaurav','Tushar','Varun','Shubham','Deepak','Faiz','Kunal'];
const LIVE_MSGS = [
  n => `${n}: working card mil gaya 🔥`,
  n => `${n}: VISA Gold secured bhai 💳`,
  n => `${n}: bhai limit itni zyada?? legit hai 😭`,
  n => `${n}: payment smooth tha, recommend 🙌`,
  n => `${n}: Mastercard Gold chahiye, kab aayega?`,
  n => `${n}: RuPay wala try kiya, worked! ✅`,
  n => `${n}: restock kab hoga bhai? 😤`,
  n => `${n}: ₹600 mein itna limit? insane 🤑`,
  n => `${n}: CVV bhi milega kya? 😭`,
  n => `${n}: Amex secured bhai 🤑`,
  n => `${n}: ye site trusted hai? first time hu 🤔`,
  n => `${n}: Gold le lu ya Elite? suggest karo`,
  n => `${n}: bhai restock kab hoga? 😤`,
  n => `${n}: admin bhai DM karo urgent 🔥`,
  n => `${n}: UPI se payment accept hoti hai? ✅`,
  n => `${n}: card declined nahi hua, legit hai 🫡`,
  n => `${n}: dosto ko bhi refer kiya, best site 🙌`,
  n => `${n}: Visa Platinum is 🔥 bhai, recommend!`,
  n => `${n}: ₹1200 worth tha yaar, maza aa gaya`,
  n => `${n}: 2 left bola tha, abhi bhi hai? 👁️`,
];
const PURCHASE_CARDS = ['Mastercard Gold','VISA Platinum','RuPay Card','VISA Gold','Mastercard'];
const PURCHASE_MSGS = [
  (n,c) => `Successfully secured ${c}`,
  (n,c) => `${c} checkout complete ✅`,
  (n,c) => `just grabbed ${c} 🔥`,
  (n,c) => `payment done for ${c}`,
  (n,c) => `${c} — confirmed! 💳`,
];
const AV_COLORS = [
  { bg:'#f9731622', border:'#f9731640', color:'#f97316' },
  { bg:'#7c3aed22', border:'#7c3aed40', color:'#a78bfa' },
  { bg:'#0f766e22', border:'#0f766e40', color:'#2dd4bf' },
  { bg:'#dc262622', border:'#dc262640', color:'#dc2626' },
  { bg:'#1d4ed822', border:'#1d4ed840', color:'#60a5fa' },
];
const rand = arr => arr[Math.floor(Math.random() * arr.length)];

// ── Live Bar ──────────────────────────────────────────────────────
const LiveBar = () => {
  const [msg, setMsg] = useState({ name: 'Gaurav', text: 'working card mil gaya 🔥' });
  const [visible, setVisible] = useState(true);
  const idxRef = useRef(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        const name = rand(NAMES);
        const full = LIVE_MSGS[idxRef.current % LIVE_MSGS.length](name);
        const text = full.replace(`${name}: `, '');
        idxRef.current++;
        setMsg({ name, text });
        setVisible(true);
      }, 300);
    }, 3500);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ margin:'9px 12px 0', background:'#0f0f18', border:'1px solid #1a1a2e', borderRadius:10, padding:'9px 12px', display:'flex', alignItems:'center', gap:8, fontSize:11.5, overflow:'hidden', minHeight:38 }}>
      <span style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e', flexShrink:0 }} />
      <span style={{ color:'#777', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(8px)', transition:'opacity .3s,transform .3s', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
        <strong style={{ color:'#fff' }}>{msg.name}:</strong> {msg.text}
      </span>
    </div>
  );
};

// ── Purchase Toast ─────────────────────────────────────────────────
const PurchaseToast = ({ toast }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 50);
    const t2 = setTimeout(() => setShow(false), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div style={{ background:'#0f0f18', border:'1px solid #1a1a2e', borderLeft:'3px solid #f97316', borderRadius:10, padding:'10px 12px', display:'flex', alignItems:'center', gap:10, transform:show?'translateY(0)':'translateY(80px)', opacity:show?1:0, transition:'transform .35s cubic-bezier(.34,1.56,.64,1),opacity .35s' }}>
      <div style={{ width:33, height:33, borderRadius:'50%', background:toast.col.bg, border:`1px solid ${toast.col.border}`, color:toast.col.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, flexShrink:0 }}>
        {toast.name[0]}
      </div>
      <div>
        <div style={{ fontSize:12, fontWeight:700, color:'#fff', marginBottom:1 }}>{toast.name} just purchased</div>
        <div style={{ fontSize:10, color:'#555' }}>{toast.msg}</div>
      </div>
    </div>
  );
};

const ToastManager = () => {
  const [toasts, setToasts] = useState([]);
  const addToast = () => {
    const name = rand(NAMES), cname = rand(PURCHASE_CARDS), col = rand(AV_COLORS);
    const msg = rand(PURCHASE_MSGS)(name, cname);
    const id = Date.now();
    setToasts(prev => [...prev.slice(-1), { id, name, msg, col }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5200);
  };
  useEffect(() => {
    const t = setTimeout(() => {
      addToast();
      const s = () => { const d = 5000 + Math.random()*7000; setTimeout(() => { addToast(); s(); }, d); };
      s();
    }, 2000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ position:'fixed', bottom:14, left:12, right:12, zIndex:50, display:'flex', flexDirection:'column', gap:8, pointerEvents:'none' }}>
      {toasts.map(t => <PurchaseToast key={t.id} toast={t} />)}
    </div>
  );
};

// ── Main App ───────────────────────────────────────────────────────
const App = () => {
  const [modalData, setModalData]     = useState({ isOpen: false, card: null });
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch]           = useState('');

  const openPayment  = card => setModalData({ isOpen: true, card });
  const closePayment = ()   => setModalData({ isOpen: false, card: null });

  const filtered = cards.filter(c => {
    const matchFilter = activeFilter === 'All' || c.type === activeFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      c.type?.toLowerCase().includes(q) ||
      c.num?.includes(q) ||
      String(c.price).includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f', fontFamily:"'Space Grotesk', sans-serif" }}>

      {/* Header */}
      <div style={{ position:'sticky', top:0, zIndex:10, background:'#0d0d14', borderBottom:'1px solid #1a1a2e', padding:'13px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontFamily:"'Rajdhani', sans-serif", fontSize:22, fontWeight:700, letterSpacing:2, color:'#fff' }}>
          prozone<span style={{ color:'#dc2626' }}>CARDS</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:5, border:'1px solid #14532d55', background:'#052e1644', padding:'4px 10px', borderRadius:20, fontSize:9, fontWeight:700, color:'#22c55e', letterSpacing:1 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e' }} />
          SECURE SERVER
        </div>
      </div>

      <LiveBar />

      {/* Section header */}
      <div style={{ padding:'14px 14px 6px', display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontSize:16, fontWeight:700, color:'#fff' }}>All Cards</span>
        <span style={{ background:'#1a1a2e', border:'1px solid #2a2a4a', color:'#8888aa', fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:99 }}>
          {filtered.length}
        </span>
      </div>

      {/* Search */}
      <div style={{ padding:'0 12px 10px', position:'relative' }}>
        <span style={{ position:'absolute', left:22, top:'50%', transform:'translateY(-50%)', color:'#3a3a5a', fontSize:14, pointerEvents:'none' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search cards..."
          style={{ width:'100%', background:'#12121e', border:'1px solid #1e1e35', borderRadius:10, padding:'10px 12px 10px 36px', color:'#fff', fontSize:13, fontFamily:"'Space Grotesk', sans-serif", outline:'none', WebkitAppearance:'none' }}
          onFocus={e => e.target.style.borderColor='#4a4a8a'}
          onBlur={e => e.target.style.borderColor='#1e1e35'}
        />
      </div>

      {/* Filter tabs */}
      <div style={{ padding:'0 12px 12px', display:'flex', gap:7, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            style={{ flexShrink:0, fontSize:11, fontWeight:600, padding:'6px 12px', borderRadius:99, border:'1px solid', borderColor:activeFilter===cat?'#f97316':'#1e1e35', background:activeFilter===cat?'#f97316':'#12121e', color:activeFilter===cat?'#fff':'#666', cursor:'pointer', whiteSpace:'nowrap', fontFamily:"'Space Grotesk', sans-serif", transition:'all .2s' }}
          >{cat}</button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ padding:'0 12px 110px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {filtered.length === 0
          ? <div style={{ gridColumn:'1/-1', textAlign:'center', color:'#333', padding:'40px 0', fontSize:13 }}>No cards found 🔍</div>
          : filtered.map(card => <CardItem key={card.id} card={card} onBuy={openPayment} />)
        }
      </div>

      <PaymentModal isOpen={modalData.isOpen} onClose={closePayment} card={modalData.card} />
      <ToastManager />
    </div>
  );
};

export default App;