import { useState } from "react";
import { motion } from "framer-motion";
import { categories } from "../data/categories";
import CategoryCard from "../components/Landing/CategoryCard";
import Header from "../components/Landing/Header";
import BottomNav from "../components/Landing/BottomNav";

const Landing = () => {
  const [hovered, setHovered] = useState(null);

  const nav = (route) => { window.location.href = route; };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1d1d1f]">

      <Header />

      <main className="px-4 pt-6 pb-28 max-w-md mx-auto">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.07em]
                        text-[#6e6e73] mb-2">
            Digital Marketplace
          </p>
          <h1 className="text-[24px] font-extrabold leading-[1.2] tracking-tight
                         text-[#1d1d1f] mb-1.5">
            What are you<br />
            <span className="text-[#0071e3]">shopping</span> today?
          </h1>
          <p className="text-[12.5px] text-[#8E8E93] leading-relaxed">
            Instant delivery · Secure payments · Best rates
          </p>
        </motion.div>

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.3 }}
          className="text-[11px] font-semibold uppercase tracking-[0.08em]
                     text-[#8E8E93] mb-3"
        >
          Browse categories
        </motion.p>

        {/* 2-column card grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {categories.map((cat, i) => (
            <CategoryCard
              key={cat.name}
              cat={cat}
              i={i}
              nav={nav}
              setHovered={setHovered}
            />
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-8 text-center text-[10.5px] text-[#AEAEB2] tracking-wide"
        >
          Secured by USDC · End-to-end encrypted
        </motion.p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Landing;