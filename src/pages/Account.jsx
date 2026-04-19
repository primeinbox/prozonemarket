import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Package, LogOut, ChevronRight, Wallet, ShoppingBag,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n || 0);

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const StatusBadge = ({ status }) => {
  const map = {
    completed: "bg-green-50 text-green-700",
    pending:   "bg-yellow-50 text-yellow-700",
    failed:    "bg-red-50 text-red-600",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${map[status] || map.pending}`}>
      {status?.toUpperCase()}
    </span>
  );
};

const OrderRow = ({ order }) => (
  <div className="flex justify-between items-center px-4 py-3">
    <div className="flex-1 min-w-0 mr-3">
      <p className="text-sm font-semibold text-gray-800 truncate">
        {order.category} — {order.item}
      </p>
      <p className="text-xs text-gray-400">{fmtDate(order.date)}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="text-sm font-bold text-gray-800 mb-1">{fmt(order.amount)}</p>
      <StatusBadge status={order.status} />
    </div>
  </div>
);

const Account = () => {
  const { user, profile, logout, loading: authLoading } = useAuth();
  const { orders, totalSpent, loading: ordersLoading } = useOrders();
  const navigate = useNavigate();

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  );

  if (!user) return null;

  const initials = (profile?.username || "U").slice(0, 2).toUpperCase();
  const recentOrders = orders.slice(0, 3);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="p-4 max-w-md mx-auto pb-24">

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
      >
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-lg">
            {initials}
          </div>
          <div>
            <p className="font-bold text-base text-gray-900">{profile?.username}</p>
            <p className="text-xs text-gray-400">Member account</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-blue-500 p-3 rounded-xl"
        >
          <Wallet size={15} className="text-blue-200 mb-1" />
          <p className="text-white font-bold text-sm leading-tight">{fmt(profile?.balance)}</p>
          <p className="text-blue-200 text-[10px] mt-0.5">Balance</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-3 rounded-xl border border-gray-100"
        >
          <ShoppingBag size={15} className="text-gray-300 mb-1" />
          <p className="font-bold text-sm leading-tight text-gray-900">{fmt(totalSpent)}</p>
          <p className="text-gray-400 text-[10px] mt-0.5">Spent</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white p-3 rounded-xl border border-gray-100"
        >
          <Package size={15} className="text-gray-300 mb-1" />
          <p className="font-bold text-sm leading-tight text-gray-900">{orders.length}</p>
          <p className="text-gray-400 text-[10px] mt-0.5">Orders</p>
        </motion.div>
      </div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="bg-white rounded-2xl border border-gray-100 mb-3 overflow-hidden"
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-50">
          <p className="text-sm font-bold text-gray-800">Recent orders</p>
          {orders.length > 0 && (
            <button
              onClick={() => navigate("/orders")}
              className="text-xs text-blue-500 font-semibold flex items-center gap-1"
            >
              View all <ChevronRight size={12} />
            </button>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package size={28} className="mx-auto text-gray-200 mb-2" />
            <p className="text-xs text-gray-400">Koi order nahi abhi tak</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Account info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="bg-white rounded-2xl border border-gray-100 mb-3 overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-gray-50">
          <p className="text-sm font-bold text-gray-800">Account info</p>
        </div>
        <div className="divide-y divide-gray-50">
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-xs text-gray-400">Username</span>
            <span className="text-xs font-semibold text-gray-800 font-mono">{profile?.username}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-xs text-gray-400">Total orders</span>
            <span className="text-xs font-semibold text-gray-800">{orders.length}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-xs text-gray-400">Total spent</span>
            <span className="text-xs font-semibold text-gray-800">{fmt(totalSpent)}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-xs text-gray-400">Balance</span>
            <span className="text-xs font-semibold text-blue-600">{fmt(profile?.balance)}</span>
          </div>
        </div>
      </motion.div>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
        onClick={handleLogout}
        className="w-full bg-red-50 border border-red-100 text-red-600 p-3 rounded-2xl flex justify-between items-center"
      >
        <span className="flex gap-2 items-center text-sm font-semibold">
          <LogOut size={14} /> Logout
        </span>
        <ChevronRight size={14} />
      </motion.button>
    </div>
  );
};

export default Account;