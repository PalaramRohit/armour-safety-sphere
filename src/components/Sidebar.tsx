import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Map,
  Users,
  MessageSquare,
  User,
  Shield,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import armourLogo from "@/assets/armour-logo.png";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Map View", icon: Map, to: "/map" },
  { label: "Community", icon: Users, to: "/community" },
  { label: "AI Assistant", icon: MessageSquare, to: "/chat" },
  { label: "Profile", icon: User, to: "/profile" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 220 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex flex-col h-screen shrink-0 overflow-hidden border-r border-white/[0.06]"
      style={{ background: "hsl(220 20% 4%)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        <img src={armourLogo} alt="ARMOUR" className="w-8 h-8 shrink-0 object-contain" />
        <motion.span
          animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
          transition={{ duration: 0.2 }}
          className="font-black text-xl tracking-widest overflow-hidden whitespace-nowrap text-safe"
          style={{ textShadow: "0 0 16px hsl(160 84% 39% / 0.5)" }}
        >
          ARMOUR
        </motion.span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
        {navItems.map(({ label, icon: Icon, to }) => {
          const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-safe/10 text-safe border border-safe/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              )}
              style={isActive ? { boxShadow: "inset 0 0 20px hsl(160 84% 39% / 0.08)" } : {}}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-safe"
                  style={{ boxShadow: "0 0 8px hsl(160 84% 39%)" }}
                />
              )}
              <Icon size={18} className={cn("shrink-0", isActive && "text-safe")} />
              <motion.span
                animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
                transition={{ duration: 0.2 }}
                className="font-medium text-sm overflow-hidden whitespace-nowrap"
              >
                {label}
              </motion.span>
            </NavLink>
          );
        })}
      </nav>

      {/* Monitoring Status */}
      <motion.div
        animate={{ opacity: collapsed ? 0 : 1 }}
        className="mx-3 mb-4 px-3 py-3 rounded-xl border border-safe/20 bg-safe/5"
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-safe monitor-pulse" />
          </div>
          <span className="text-xs font-semibold text-safe">Monitoring Active</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Activity size={10} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Safety AI Online</span>
        </div>
      </motion.div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-white/10 bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
