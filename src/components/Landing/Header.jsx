import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 flex items-center justify-between
                 px-5 py-3.5 bg-white/85 backdrop-blur-2xl
                 border-b border-black/[0.06]"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-[10px] bg-[#1d1d1f] flex items-center
                        justify-center shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9"/>
            <path d="M8 12h8M12 8v8"/>
          </svg>
        </div>
        <span className="text-[15px] font-bold tracking-tight text-[#1d1d1f] select-none">
          usdc<span className="text-[#0071e3]">MARKET</span>
        </span>
      </div>

      {/* Secure badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                   bg-[#F0FBF4] border border-[#C6EDD6]"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full
                           rounded-full bg-[#30D158] opacity-60"/>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5
                           bg-[#30D158]"/>
        </span>
        <span className="text-[10px] font-semibold tracking-[0.12em] text-[#1C8C41]">
          SECURE
        </span>
      </motion.div>
    </motion.header>
  );
};

export default Header;