import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

const toEmail = (username) =>
  `${username.toLowerCase().trim()}@shopapp.internal`;

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      setProfile(data);
      return data;
    } catch {
      setProfile(null);
    }
  };

useEffect(() => {
  let mounted = true;

  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!mounted) return;
    const u = session?.user ?? null;
    setUser(u);
    setLoading(false); // ← pehle loading false karo
    if (u) fetchProfile(u.id); // ← await mat karo, background mein chalne do
  });

  const { data: listener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (!mounted) return;
      if (event === "INITIAL_SESSION") return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) fetchProfile(u.id); // yahan bhi await nahi
      else setProfile(null);
    }
  );

  return () => {
    mounted = false;
    listener.subscription.unsubscribe();
  };
}, []);

  const signUp = async (username, password) => {
    const clean = username.toLowerCase().trim();
    const { data: existing } = await supabase
      .from("profiles").select("id").eq("username", clean).maybeSingle();
    if (existing) throw new Error("Yeh username pehle se liya hua hai");
    const { data, error } = await supabase.auth.signUp({
      email: toEmail(clean), password,
    });
    if (error) throw error;
    const { error: pErr } = await supabase.from("profiles").insert({
      id: data.user.id, username: clean, balance: 0,
    });
    if (pErr) throw pErr;
  };

  const signIn = async (username, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: toEmail(username), password,
    });
    if (error) throw new Error("Username ya password galat hai");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = () => user && fetchProfile(user.id);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signIn, signUp, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
};