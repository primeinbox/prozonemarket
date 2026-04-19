import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const CategoryCard = ({ cat, i, nav, setHovered }) => {
  const Icon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.08 + i * 0.06,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => nav(cat.route)}
      onMouseEnter={() => setHovered(i)}
      onMouseLeave={() => setHovered(null)}
      className="bg-white rounded-[18px] p-3.5 cursor-pointer
                 border border-black/[0.055]
                 shadow-[0_1px_4px_rgba(0,0,0,0.05),0_4px_14px_rgba(0,0,0,0.04)]
                 hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)]
                 transition-shadow duration-200"
    >
      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5"
        style={{ background: cat.iconBg, color: cat.accent }}
      >
        <Icon />
      </motion.div>

      {/* Tag */}
      <p className="text-[9.5px] font-semibold uppercase tracking-[0.07em]
                    text-[#8E8E93] mb-1.5">
        {cat.tag}
      </p>

      {/* Name */}
      <h3 className="text-[14px] font-bold text-[#1d1d1f] tracking-tight mb-1">
        {cat.name}
      </h3>

      {/* Desc */}
      <p className="text-[11px] text-[#8E8E93] leading-relaxed mb-3">
        {cat.desc}
      </p>

      {/* Explore row */}
      <div className="flex items-center justify-between">
        <span className="text-[11.5px] font-semibold" style={{ color: cat.accent }}>
          Explore
        </span>
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: cat.iconBg }}
        >
          <ChevronRight size={10} strokeWidth={2.5} style={{ color: cat.accent }} />
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;