import { motion } from "framer-motion";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Home",    Icon: Home,        route: "/" },
  { label: "Search",  Icon: Search,      route: "/search" },
  { label: "Orders",  Icon: ShoppingBag, route: "/orders" },
  { label: "Account", Icon: User,        route: "/account" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.nav
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50
                 bg-white/90 backdrop-blur-2xl
                 border-t border-black/[0.07]
                 pb-safe"
    >
      <div className="flex items-center justify-around
                      px-2 py-2 max-w-md mx-auto">
        {NAV_ITEMS.map(({ label, Icon, route }) => {
          const isActive = location.pathname === route;
          return (
            <button
              key={label}
              onClick={() => navigate(route)}
              className="relative flex flex-col items-center gap-1 px-4 py-2
                         rounded-xl outline-none transition-colors duration-150
                         focus-visible:ring-2 focus-visible:ring-[#0071e3]/40"
            >
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.1 : 1.6}
                  color={isActive ? "#0071e3" : "#8E8E93"}
                />
              </motion.div>
              <span
                className="text-[9.5px] font-medium tracking-wide
                           transition-colors duration-150"
                style={{ color: isActive ? "#0071e3" : "#8E8E93",
                         fontWeight: isActive ? 600 : 500 }}
              >
                {label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#0071e3]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNav;