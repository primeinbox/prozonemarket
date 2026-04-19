import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Users, Package, Plus, RefreshCw, Zap } from "lucide-react";

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" });

const Admin = () => {
  const [authed,       setAuthed]       = useState(false);
  const [pass,         setPass]         = useState("");
  const [users,        setUsers]        = useState([]);
  const [orders,       setOrders]       = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [amount,       setAmount]       = useState("");
  const [loading,      setLoading]      = useState(false);
  const [msg,          setMsg]          = useState({ text: "", type: "" });
  const [tab,          setTab]          = useState("users");

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: allOrders }, { data: allTxns }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("date", { ascending: false }),
      supabase.from("transactions").select("*").order("created_at", { ascending: false }),
    ]);
    setUsers(profiles || []);
    setOrders(allOrders || []);
    setTransactions(allTxns || []);
    setLoading(false);
  };

  const verifyTxn = async (txnId, action) => {
    await supabase.from("transactions").update({ status: action }).eq("id", txnId);
    fetchAll();
  };

  useEffect(() => { if (authed) fetchAll(); }, [authed]);

  const addBalance = async () => {
    if (!selectedUser) return setMsg({ text: "User select karo pehle", type: "error" });
    const amt = parseInt(amount);
    if (!amt || amt <= 0) return setMsg({ text: "Valid amount daalo", type: "error" });

    const user = users.find((u) => u.id === selectedUser);
    const newBal = (user.balance || 0) + amt;

    const { error } = await supabase
      .from("profiles")
      .update({ balance: newBal })
      .eq("id", selectedUser);

    if (error) return setMsg({ text: error.message, type: "error" });

    setMsg({ text: `${user.username} ko ${fmt(amt)} add ho gaya!`, type: "success" });
    setAmount("");
    setSelectedUser("");
    fetchAll();
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  // ── Login screen ─────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-sm">
          <div className="w-12 h-12 bg-gray-900 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="text-lg font-bold text-center mb-4">Admin Panel</h1>
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              (pass === ADMIN_PASS ? setAuthed(true) : alert("Wrong password"))
            }
            className="w-full border border-gray-200 rounded-xl p-3 mb-3 text-sm outline-none"
          />
          <button
            onClick={() =>
              pass === ADMIN_PASS ? setAuthed(true) : alert("Wrong password")
            }
            className="w-full bg-gray-900 text-white rounded-xl p-3 font-semibold text-sm"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const userOrders = (uid) => orders.filter((o) => o.user_id === uid);

  // ── Main panel ───────────────────────────────────────────────
  return (
    <div className="p-4 max-w-xl mx-auto pb-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button onClick={fetchAll} className="p-2 bg-white rounded-xl border border-gray-100">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Message */}
      {msg.text && (
        <div className={`rounded-xl p-3 mb-4 text-sm ${
          msg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
        }`}>
          {msg.text}
        </div>
      )}

      {/* Add Balance */}
      <div className="bg-white rounded-2xl p-4 mb-4">
        <p className="font-semibold mb-3 flex items-center gap-2">
          <Plus size={15} /> Balance Add Karo
        </p>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full border border-gray-200 rounded-xl p-3 mb-2 text-sm outline-none"
        >
          <option value="">User select karo</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username} — {fmt(u.balance)}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addBalance()}
            className="flex-1 border border-gray-200 rounded-xl p-3 text-sm outline-none"
          />
          <button
            onClick={addBalance}
            className="bg-blue-500 text-white rounded-xl px-5 font-semibold text-sm"
          >
            Add
          </button>
        </div>
      </div>

      {/* Tabs — SIRF BUTTONS YAHAN HAIN */}
      <div className="flex gap-2 mb-3 overflow-x-auto">
        {[
          { key: "users",        label: `Users (${users.length})`,        icon: Users   },
          { key: "orders",       label: `Orders (${orders.length})`,      icon: Package },
          { key: "transactions", label: `Payments (${transactions.length})`, icon: Zap  },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              tab === key ? "bg-gray-900 text-white" : "bg-white text-gray-500"
            }`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* Tab Content — TABS DIV KE BAHAR HAI */}
      {loading ? (
        <p className="text-center text-gray-300 py-8 text-sm">Loading...</p>

      ) : tab === "users" ? (
        <div className="space-y-2">
          {users.map((u) => {
            const uOrders = userOrders(u.id);
            const spent = uOrders
              .filter((o) => o.status === "completed")
              .reduce((s, o) => s + (o.amount || 0), 0);
            return (
              <div key={u.id} className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold">{u.username}</p>
                    <p className="text-xs text-gray-400">
                      {uOrders.length} orders · {fmt(spent)} spent
                    </p>
                  </div>
                  <div className="bg-blue-50 text-blue-600 rounded-lg px-3 py-1 text-sm font-bold">
                    {fmt(u.balance)}
                  </div>
                </div>
                {uOrders.length > 0 && (
                  <div className="border-t border-gray-50 pt-2 space-y-1">
                    {uOrders.slice(0, 3).map((o) => (
                      <div key={o.id} className="flex justify-between text-xs text-gray-500">
                        <span>{o.category} — {o.item}</span>
                        <span className="font-medium">{fmt(o.amount)}</span>
                      </div>
                    ))}
                    {uOrders.length > 3 && (
                      <p className="text-xs text-gray-300">+{uOrders.length - 3} aur orders</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      ) : tab === "orders" ? (
        <div className="space-y-2">
          {orders.map((o) => {
            const u = users.find((u) => u.id === o.user_id);
            return (
              <div key={o.id} className="bg-white rounded-xl p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold">{o.category} — {o.item}</p>
                  <p className="text-xs text-gray-400">
                    {u?.username || "unknown"} · {fmtDate(o.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{fmt(o.amount)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    o.status === "completed"
                      ? "bg-green-50 text-green-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}>
                    {o.status.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
          {orders.length === 0 && (
            <p className="text-center text-gray-300 py-8 text-sm">Koi order nahi abhi tak</p>
          )}
        </div>

      ) : tab === "transactions" ? (
        <div className="space-y-2">
          {transactions.map((t) => (
            <div key={t.id} className="bg-white rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-sm">{t.username}</p>
                  <p className="text-xs text-gray-400">{t.category} — {t.item}</p>
                  {t.phone && (
                    <p className="text-xs text-blue-500">📞 {t.phone}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-base">{fmt(t.amount)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    t.status === "verified" ? "bg-green-50 text-green-700" :
                    t.status === "rejected" ? "bg-red-50 text-red-600"    :
                                              "bg-yellow-50 text-yellow-700"
                  }`}>
                    {t.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg px-3 py-2 mb-2">
                <p className="text-[10px] text-gray-400 font-semibold mb-0.5">UTR / TRANSACTION ID</p>
                <p className="text-sm font-mono font-bold text-gray-800">{t.utr_id}</p>
              </div>

              <p className="text-[10px] text-gray-400 mb-3">
                {new Date(t.created_at).toLocaleString("en-IN")}
              </p>

              {t.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => verifyTxn(t.id, "verified")}
                    className="flex-1 bg-green-500 text-white rounded-lg py-2 text-xs font-bold"
                  >
                    ✓ Verify
                  </button>
                  <button
                    onClick={() => verifyTxn(t.id, "rejected")}
                    className="flex-1 bg-red-500 text-white rounded-lg py-2 text-xs font-bold"
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-center text-gray-300 py-8 text-sm">Koi transaction nahi abhi tak</p>
          )}
        </div>

      ) : null}
    </div>
  );
};

export default Admin;