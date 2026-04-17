import React, { useState } from 'react';
import Header from '../components/FreeFire/Header';
import Hero from '../components/FreeFire/Hero';
import AccountSection from '../components/FreeFire/AccountSection';
import TopUpGrid from '../components/FreeFire/card/TopUpGrid';
import BottomBar from '../components/FreeFire/card/BottomBar';
import PaymentModal from '../components/FreeFire/card/PaymentModal';
import Footer from '../components/FreeFire/Footer';

// ─────────────────────────────────────────────────────────────────────────────
// FreeFire.js — root controller
//
// Footer logic:
//   • Login page  → shows below AccountSection card
//   • After login → shows below TopUpGrid (after all diamond packs)
// ─────────────────────────────────────────────────────────────────────────────

export default function FreeFire() {
  const savedUid = localStorage.getItem('ff_uid') || '';

  const [uid,         setUid]         = useState(savedUid);
  const [isLoggedIn,  setIsLoggedIn]  = useState(!!savedUid);
  const [selected,    setSelected]    = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => setSelected(null);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f5f5f5;
          -webkit-tap-highlight-color: transparent;
        }
        input, button { font-family: inherit; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f5f5f5', paddingBottom: 120 }}>

        {/* ① Top bar */}
        <Header />

        {/* ② Hero banner */}
        <Hero />

        {/* ③ Account section */}
        <AccountSection
          uid={uid}
          setUid={setUid}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          onLogout={handleLogout}
        />

        {/* ④ Top-up grid — only after login */}
        {isLoggedIn ? (
          <>
            <div style={{ animation: 'fadeInUp 0.35s ease both' }}>
              <style>{`
                @keyframes fadeInUp {
                  from { opacity: 0; transform: translateY(16px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
              `}</style>
              <TopUpGrid selected={selected} onSelect={setSelected} />
            </div>

            {/* ⑤ Footer — below TopUpGrid after login */}
            <Footer />
          </>
        ) : (
          /* ⑤ Footer — below AccountSection on login page */
          <Footer />
        )}

        {/* ⑥ Bottom bar */}
        {isLoggedIn && selected && (
          <BottomBar item={selected} onBuy={() => setIsModalOpen(true)} />
        )}

        {/* ⑦ Payment modal */}
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          card={selected}
        />
      </div>
    </>
  );
}