import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Package, ArrowLeft, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n || 0);

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "2-digit",
  });

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

const Orders = () => {
  const { profile, loading: authLoading } = useAuth();
  const { orders, totalSpent, loading: ordersLoading } = useOrders();
  const navigate = useNavigate();

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="p-4 max-w-md mx-auto pb-24">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate("/account")}
          className="w-8 h-8 bg-white border border-gray-100 rounded-xl flex items-center justify-center"
        >
          <ArrowLeft size={15} className="text-gray-500" />
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-900">My Orders</h1>
          <p className="text-xs text-gray-400">{profile?.username}</p>
        </div>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex justify-between items-center"
      >
        <div className="flex items-center gap-2">
          <ShoppingBag size={16} className="text-blue-400" />
          <span className="text-sm font-semibold text-gray-700">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Total spent</p>
          <p className="text-sm font-bold text-gray-800">{fmt(totalSpent)}</p>
        </div>
      </motion.div>

      {/* List */}
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-400 mb-1">Koi order nahi abhi tak</p>
          <p className="text-xs text-gray-300">Kuch kharido pehle!</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-500 text-white text-xs font-semibold px-5 py-2 rounded-xl"
          >
            Shop karo
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-xl border border-gray-100 p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {o.item || o.category}
                  </p>
                  <p className="text-xs text-gray-400">{o.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">{fmt(o.amount)}</p>
                  <StatusBadge status={o.status} />
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 font-mono">{o.id}</p>
                <p className="text-[10px] text-gray-400">{fmtDate(o.date)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;