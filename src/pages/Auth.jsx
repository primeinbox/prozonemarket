import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const redirectTo = location.state?.from || "/account";

  const [isLogin,    setIsLogin]    = useState(true);
  const [username,   setUsername]   = useState("");
  const [password,   setPassword]   = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccessMsg("");

    if (!username.trim())     return setError("Username daalo");
    if (password.length < 6)  return setError("Password kam se kam 6 characters ka ho");

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(username, password);
        navigate(redirectTo, { replace: true });
      } else {
        await signUp(username, password);
        setSuccessMsg("Account ban gaya! Ab login karo.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (err) {
      setError(err.message || "Kuch galat ho gaya");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <h1 className="text-2xl font-bold">
            {isLogin ? "Welcome back" : "Account banayein"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isLogin ? "Apne account mein login karo" : "Naya account create karo"}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-4">
          {/* Username */}
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
              Username
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl px-3 gap-2 focus-within:border-blue-400 transition-colors">
              <User size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="apna username"
                className="flex-1 py-3 text-sm outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
              Password
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl px-3 gap-2 focus-within:border-blue-400 transition-colors">
              <Lock size={15} className="text-gray-400 shrink-0" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                className="flex-1 py-3 text-sm outline-none bg-transparent"
              />
              <button onClick={() => setShowPass(!showPass)} className="text-gray-400">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error / Success */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}
            {successMsg && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2"
              >
                {successMsg}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
          >
            {loading
              ? <Loader2 size={18} className="animate-spin" />
              : <>{isLogin ? "Login" : "Account Banayein"} <ArrowRight size={16} /></>
            }
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isLogin ? "Naya account chahiye? " : "Pehle se account hai? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); setSuccessMsg(""); }}
            className="text-blue-500 font-semibold"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;