import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
  console.log("FETCHORDERS CALLED, user:", user?.id);
  if (!user) { setOrders([]); return; }
  setLoading(true);
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });
  console.log("ORDERS DATA:", data, "ERROR:", error);
  setOrders(data || []);
  setLoading(false);
};

  useEffect(() => {
    if (authLoading) return;
    fetchOrders();
  }, [user, authLoading]);

  const addOrder = async (orderData) => {
    if (!user) return null;
    const newOrder = {
      id:       `order_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      user_id:  user.id,
      category: orderData.category,
      item:     orderData.item,
      amount:   orderData.amount,
      status:   "completed",
      date:     new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("orders")
      .insert(newOrder)
      .select()
      .single();
    if (!error) setOrders((prev) => [data, ...prev]);
    return data;
  };

  const totalSpent = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  return (
    <OrderContext.Provider
      value={{ orders, loading, totalSpent, addOrder, fetchOrders }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be inside <OrderProvider>");
  return ctx;
};

export default OrderContext;