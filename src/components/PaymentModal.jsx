import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Shield, Clock, Copy, Check, Hash,
  Loader2, CheckCircle2, AlertCircle, Lock,
  Zap, QrCode, Smartphone, ChevronRight, Phone,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { supabase } from "../lib/supabase";

const UPI_ID     = "suryadeep01@fam";
const TIMER_SECS = 600;
const PROC_SECS  = 120;

export default function PaymentModal({ isOpen, onClose, card }) {
  const { user, profile } = useAuth();
  const { addOrder }      = useOrders();

  const [phase,     setPhase]     = useState("init");
  const [txnId,     setTxnId]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [txnErr,    setTxnErr]    = useState(false);
  const [copied,    setCopied]    = useState(false);
  const [timer,     setTimer]     = useState(TIMER_SECS);
  const [procTimer, setProcTimer] = useState(PROC_SECS);
  const [initStep,  setInitStep]  = useState(0);
  const [dots,      setDots]      = useState("");
  const [saveErr,   setSaveErr]   = useState("");

  const timerRef   = useRef(null);
  const procRef    = useRef(null);
  const initRef    = useRef(null);
  const dotsRef    = useRef(null);
  const orderIdRef = useRef(`ORD${Date.now().toString().slice(-8)}`);

  useEffect(() => {
    if (!isOpen) {
      [timerRef, procRef, initRef, dotsRef].forEach(r => clearInterval(r.current));
      return;
    }
    orderIdRef.current = `ORD${Date.now().toString().slice(-8)}`;
    setPhase("init"); setTxnId(""); setPhone(""); setTxnErr(false);
    setCopied(false); setSaveErr("");
    setTimer(TIMER_SECS); setProcTimer(PROC_SECS); setInitStep(0); setDots("");

    let step = 0;
    initRef.current = setInterval(() => {
      step++;
      setInitStep(step);
      if (step >= 4) {
        clearInterval(initRef.current);
        setTimeout(() => {
          setPhase("payment");
          timerRef.current = setInterval(() => {
            setTimer(s => {
              if (s <= 1) { clearInterval(timerRef.current); onClose(); return 0; }
              return s - 1;
            });
          }, 1000);
        }, 400);
      }
    }, 650);

    return () => [timerRef, procRef, initRef, dotsRef].forEach(r => clearInterval(r.current));
  }, [isOpen]);

  useEffect(() => {
    if (phase !== "processing") { clearInterval(dotsRef.current); return; }
    dotsRef.current = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 500);
    return () => clearInterval(dotsRef.current);
  }, [phase]);

  if (!isOpen || !card) return null;

  const qrData     = `upi://pay?pa=${UPI_ID}&pn=SecureStore&am=${card.price}&cu=INR&tn=${encodeURIComponent(card.title || card.type || "Order")}`;
  const qrUrl      = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(qrData)}`;
  const timerLabel = `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`;
  const procProgress = Math.round(((PROC_SECS - procTimer) / PROC_SECS) * 100);

  const INIT_STEPS = [
    "Connecting to payment gateway",
    "Generating secure session",
    "Preparing your QR code",
    "Session ready",
  ];

  const PROC_STEPS = [
    { label: "Payment received",      done: true },
    { label: "Bank verification",     done: procTimer < 90 },
    { label: "Preparing credentials", done: procTimer < 40 },
    { label: "Delivery ready",        done: phase === "done" },
  ];

  const copyUPI = () => {
    navigator.clipboard?.writeText(UPI_ID).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!txnId.trim()) { setTxnErr(true); return; }
    setSaveErr("");
    clearInterval(timerRef.current);

    // ── Save to Supabase ─────────────────────────────────────
    try {
      const txnRecord = {
        id:       `TXN_${Date.now()}_${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        user_id:  user?.id || null,
        username: profile?.username || "guest",
        category: card.category || card.type || "Cards",
        item:     card.title || card.type || card.id,
        amount:   card.price,
        utr_id:   txnId.trim(),
        phone:    phone.trim() || null,
        status:   "pending",
      };

      const { error } = await supabase.from("transactions").insert(txnRecord);
      if (error) throw error;

      // Order bhi save karo
      await addOrder({
        category: card.category || card.type || "Cards",
        item:     card.title || card.type,
        amount:   card.price,
      });
    } catch (err) {
      setSaveErr("Save failed: " + err.message);
      // Processing tab shuru karo even if save fails (UX ke liye)
    }

    setPhase("processing");
    setProcTimer(PROC_SECS);
    procRef.current = setInterval(() => {
      setProcTimer(s => {
        if (s <= 1) { clearInterval(procRef.current); setPhase("done"); return 0; }
        return s - 1;
      });
    }, 1000);
  };

  // ── PHASE: INIT ──────────────────────────────────────────────
  if (phase === "init") {
    return (
      <Backdrop>
        <Sheet>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 4px 4px" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              style={{
                width: 60, height: 60, borderRadius: "50%",
                border: "2.5px solid #e0e7ff", borderTop: "2.5px solid #4f46e5",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
              }}
            >
              <QrCode size={20} color="#4f46e5" />
            </motion.div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 2, textAlign: "center" }}>
              Preparing payment
            </p>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24, textAlign: "center" }}>
              {card.title || card.type} &middot;
              <span style={{ color: "#4f46e5", fontWeight: 700 }}> ₹{card.price}</span>
            </p>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
              {INIT_STEPS.map((label, i) => {
                const done   = i < initStep;
                const active = i === initStep - 1 && initStep < 4;
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: i < initStep || i === 0 ? 1 : 0.3, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <motion.div
                      animate={done ? { background: "#4f46e5" } : { background: "#e0e7ef" }}
                      transition={{ duration: 0.3 }}
                      style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      {done
                        ? <Check size={13} color="white" />
                        : <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{i + 1}</span>
                      }
                    </motion.div>
                    <span style={{ fontSize: 13, color: done ? "#111827" : "#9ca3af", fontWeight: done ? 500 : 400 }}>
                      {label}
                    </span>
                    {active && (
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} style={{ marginLeft: "auto" }}>
                        <Loader2 size={14} color="#4f46e5" />
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <div style={{ width: "100%", height: 4, background: "#e0e7ef", borderRadius: 99, marginTop: 22, overflow: "hidden" }}>
              <motion.div
                animate={{ width: `${(initStep / 4) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ height: "100%", background: "#4f46e5", borderRadius: 99 }}
              />
            </div>
          </div>
          <SecureFooter />
        </Sheet>
      </Backdrop>
    );
  }

  // ── PHASE: PAYMENT ───────────────────────────────────────────
  if (phase === "payment") {
    return (
      <Backdrop onClose={onClose}>
        <Sheet onClose={onClose}>
          {/* Timer */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <motion.div
              animate={timer < 60 ? { scale: [1, 1.06, 1] } : {}}
              transition={{ duration: 0.9, repeat: Infinity }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: timer < 60 ? "#fef2f2" : "#f0fdf4",
                border: `1px solid ${timer < 60 ? "#fecaca" : "#bbf7d0"}`,
                color: timer < 60 ? "#dc2626" : "#16a34a",
                fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 99,
              }}
            >
              <Clock size={12} /> {timerLabel} remaining
            </motion.div>
          </div>

          <p style={{ textAlign: "center", fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 2 }}>
            Complete your payment
          </p>
          <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
            {card.title || card.type} &nbsp;&middot;&nbsp;
            <span style={{ color: "#4f46e5", fontWeight: 700, fontSize: 15 }}>₹{card.price}</span>
          </p>

          {/* QR */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            style={{
              background: "#fff", border: "1.5px solid #e0e7ef", borderRadius: 18,
              padding: "16px 16px 10px",
              display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 14,
            }}
          >
            <img src={qrUrl} alt="UPI QR Code" style={{ width: 172, height: 172, borderRadius: 10 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10 }}>
              <Smartphone size={12} color="#9ca3af" />
              <span style={{ fontSize: 11, color: "#9ca3af" }}>Scan with GPay · PhonePe · Paytm · BHIM</span>
            </div>
          </motion.div>

          {/* UPI ID */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#f8fafc", border: "1px solid #e2e8f0",
            borderRadius: 12, padding: "11px 14px", marginBottom: 14,
          }}>
            <div>
              <p style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3, letterSpacing: 0.5, fontWeight: 600 }}>UPI ID</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1e1b4b", fontFamily: "monospace" }}>{UPI_ID}</p>
            </div>
            <motion.button whileTap={{ scale: 0.88 }} onClick={copyUPI} style={{
              display: "flex", alignItems: "center", gap: 5,
              background: copied ? "#dcfce7" : "#eef2ff",
              border: `1px solid ${copied ? "#86efac" : "#c7d2fe"}`,
              color: copied ? "#16a34a" : "#4f46e5",
              fontSize: 12, fontWeight: 700, padding: "7px 13px", borderRadius: 9, cursor: "pointer",
            }}>
              {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
            </motion.button>
          </div>

          {/* UTR / TXN ID */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: 0.5, display: "block", marginBottom: 7, textTransform: "uppercase" }}>
              Transaction ID / UTR number *
            </label>
            <div style={{
              display: "flex", alignItems: "center",
              border: `1.5px solid ${txnErr ? "#f87171" : "#e2e8f0"}`,
              borderRadius: 12, background: "#fff",
              boxShadow: txnErr ? "0 0 0 3px #fee2e2" : "none", transition: "all 0.2s",
            }}>
              <div style={{ padding: "0 12px", color: "#94a3b8", flexShrink: 0 }}><Hash size={15} /></div>
              <input
                value={txnId}
                onChange={e => { setTxnId(e.target.value); setTxnErr(false); }}
                placeholder="e.g. 412345678901"
                onFocus={e => { e.target.parentElement.style.borderColor = "#6366f1"; e.target.parentElement.style.boxShadow = "0 0 0 3px #e0e7ff"; }}
                onBlur={e => { e.target.parentElement.style.borderColor = txnErr ? "#f87171" : "#e2e8f0"; e.target.parentElement.style.boxShadow = txnErr ? "0 0 0 3px #fee2e2" : "none"; }}
                style={{ flex: 1, padding: "12px 12px 12px 0", background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#111827", fontFamily: "monospace" }}
              />
            </div>
            <AnimatePresence>
              {txnErr && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ fontSize: 11, color: "#ef4444", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
                  <AlertCircle size={11} /> Transaction ID daalna zaroori hai
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Phone (optional) */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: 0.5, display: "block", marginBottom: 7, textTransform: "uppercase" }}>
              Phone Number <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none" }}>(optional)</span>
            </label>
            <div style={{
              display: "flex", alignItems: "center",
              border: "1.5px solid #e2e8f0", borderRadius: 12, background: "#fff",
              transition: "all 0.2s",
            }}>
              <div style={{ padding: "0 12px", color: "#94a3b8", flexShrink: 0 }}><Phone size={15} /></div>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                type="tel"
                maxLength={10}
                onFocus={e => { e.target.parentElement.style.borderColor = "#6366f1"; e.target.parentElement.style.boxShadow = "0 0 0 3px #e0e7ff"; }}
                onBlur={e => { e.target.parentElement.style.borderColor = "#e2e8f0"; e.target.parentElement.style.boxShadow = "none"; }}
                style={{ flex: 1, padding: "12px 12px 12px 0", background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#111827", fontFamily: "monospace" }}
              />
            </div>
          </div>

          {/* Save error */}
          {saveErr && (
            <div style={{ fontSize: 11, color: "#ef4444", background: "#fef2f2", borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
              {saveErr}
            </div>
          )}

          {/* Warning */}
          <div style={{
            display: "flex", gap: 8, alignItems: "flex-start",
            background: "#fffbeb", border: "1px solid #fde68a",
            borderRadius: 10, padding: "10px 12px", marginBottom: 16,
          }}>
            <AlertCircle size={13} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 11, color: "#92400e", lineHeight: 1.65, margin: 0 }}>
              Pehle UPI app mein payment karein, phir Transaction ID paste karein. Window band mat karo.
            </p>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            style={{
              width: "100%", padding: "14px 0",
              background: "#4f46e5", border: "none", borderRadius: 14,
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 18px rgba(79,70,229,0.32)",
            }}
          >
            <Zap size={15} fill="currentColor" />
            Submit payment
            <ChevronRight size={15} />
          </motion.button>

          <SecureFooter />
        </Sheet>
      </Backdrop>
    );
  }

  // ── PHASE: PROCESSING ────────────────────────────────────────
  if (phase === "processing") {
    const procMinsLabel = `${Math.floor(procTimer / 60)}:${String(procTimer % 60).padStart(2, "0")}`;
    return (
      <Backdrop>
        <Sheet>
          <div style={{ textAlign: "center" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              style={{
                width: 64, height: 64, borderRadius: "50%",
                border: "3px solid #e0e7ef", borderTop: "3px solid #4f46e5",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
              }}
            >
              <Lock size={20} color="#4f46e5" />
            </motion.div>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
              Verifying payment{dots}
            </p>
            <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>Please keep this window open</p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#f8fafc", border: "1px solid #e2e8f0",
              borderRadius: 99, padding: "6px 16px", marginBottom: 20,
            }}>
              <span style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 0.5, fontWeight: 600 }}>UTR</span>
              <span style={{ fontSize: 12, fontFamily: "monospace", color: "#374151", fontWeight: 600 }}>{txnId}</span>
            </div>
            <div style={{ background: "#f1f5f9", borderRadius: 99, height: 5, overflow: "hidden", marginBottom: 6 }}>
              <motion.div
                animate={{ width: `${procProgress}%` }}
                transition={{ duration: 1, ease: "linear" }}
                style={{ height: "100%", background: "#4f46e5", borderRadius: 99 }}
              />
            </div>
            <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 22 }}>Estimated: {procMinsLabel} remaining</p>
            <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 12 }}>
              {PROC_STEPS.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <motion.div
                    animate={s.done ? { background: "#4f46e5", borderColor: "#4f46e5" } : { background: "#f1f5f9", borderColor: "#e2e8f0" }}
                    transition={{ duration: 0.5 }}
                    style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {s.done
                      ? <Check size={13} color="white" />
                      : <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#cbd5e1", display: "block" }} />
                    }
                  </motion.div>
                  <span style={{ fontSize: 13, fontWeight: s.done ? 600 : 400, color: s.done ? "#111827" : "#9ca3af", transition: "all 0.4s" }}>
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          <SecureFooter />
        </Sheet>
      </Backdrop>
    );
  }

  // ── PHASE: DONE ──────────────────────────────────────────────
  if (phase === "done") {
    return (
      <Backdrop onClose={onClose}>
        <Sheet onClose={onClose}>
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
            <FadeUp delay={0} style={{ textAlign: "center" }}>
              <motion.div
                initial={{ scale: 0, rotate: -160 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.05 }}
                style={{
                  width: 68, height: 68, borderRadius: "50%",
                  background: "#dcfce7", border: "2px solid #86efac",
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
                }}
              >
                <CheckCircle2 size={32} color="#16a34a" />
              </motion.div>
              <p style={{ fontSize: 19, fontWeight: 700, color: "#14532d", marginBottom: 4, textAlign: "center" }}>
                Payment submitted!
              </p>
              <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 20, textAlign: "center" }}>
                Order ID:&nbsp;
                <span style={{ fontFamily: "monospace", color: "#4f46e5", fontWeight: 700 }}>{orderIdRef.current}</span>
              </p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div style={{
                background: "#f0fdf4", border: "1px solid #bbf7d0",
                borderRadius: 14, overflow: "hidden", marginBottom: 14,
              }}>
                <div style={{ padding: "10px 14px", background: "#dcfce7", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #bbf7d0" }}>
                  <Lock size={12} color="#16a34a" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#166534", letterSpacing: 0.4 }}>ORDER DETAILS</span>
                </div>
                {[
                  { label: "Product",  value: card.title || card.type },
                  { label: "Amount",   value: `₹${card.price}` },
                  { label: "UTR ID",   value: txnId },
                  { label: "User",     value: profile?.username || "—" },
                  ...(phone ? [{ label: "Phone", value: phone }] : []),
                  { label: "Status",   value: "⏳ Pending verification" },
                ].map((row, i, arr) => (
                  <div key={row.label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 14px",
                    borderBottom: i < arr.length - 1 ? "1px solid #d1fae5" : "none",
                  }}>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>{row.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#111827", fontFamily: "monospace" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div style={{
                display: "flex", gap: 8, alignItems: "flex-start",
                background: "#fffbeb", border: "1px solid #fde68a",
                borderRadius: 10, padding: "10px 12px", marginBottom: 16,
              }}>
                <AlertCircle size={13} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 11, color: "#92400e", lineHeight: 1.65, margin: 0 }}>
                  Admin se verification ke baad order complete hoga. Support ke liye <strong>@store_admin</strong> se Telegram par contact karein.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.4}>
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                onClick={onClose}
                style={{
                  width: "100%", padding: "13px 0",
                  background: "#1e1b4b", border: "none", borderRadius: 14,
                  color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                Done — back to store
              </motion.button>
            </FadeUp>
          </motion.div>
          <SecureFooter />
        </Sheet>
      </Backdrop>
    );
  }

  return null;
}

// ─── HELPERS ───────────────────────────────────────────────────

function Backdrop({ children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose?.()}
      style={{
        position: "fixed", inset: 0, zIndex: 250,
        background: "rgba(15,23,42,0.65)", backdropFilter: "blur(5px)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
    >
      {children}
    </motion.div>
  );
}

function Sheet({ children, onClose }) {
  return (
    <motion.div
      initial={{ y: 72, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 72, opacity: 0 }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      style={{
        width: "100%", maxWidth: 440, background: "#ffffff",
        borderRadius: "22px 22px 0 0", padding: "0 20px 30px",
        position: "relative",
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        maxHeight: "92vh", overflowY: "auto",
      }}
    >
      <div style={{ width: 40, height: 4, background: "#e2e8f0", borderRadius: 99, margin: "12px auto 18px" }} />
      {onClose && (
        <motion.button
          whileHover={{ scale: 1.12, rotate: 90 }} whileTap={{ scale: 0.88 }}
          onClick={onClose}
          transition={{ type: "spring", stiffness: 280 }}
          style={{
            position: "absolute", top: 14, right: 16,
            width: 30, height: 30, borderRadius: "50%",
            background: "#f1f5f9", border: "1px solid #e2e8f0",
            color: "#64748b", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={14} />
        </motion.button>
      )}
      {children}
    </motion.div>
  );
}

function SecureFooter() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 18 }}>
      <Shield size={11} color="#94a3b8" />
      <span style={{ fontSize: 11, color: "#94a3b8" }}>256-bit SSL &middot; 100% secure payments</span>
    </div>
  );
}

function FadeUp({ children, delay = 0, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 24 }}
      style={style}
    >
      {children}
    </motion.div>
  );
}