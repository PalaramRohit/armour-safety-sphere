import { useState } from "react";
import { Bell, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TopBarProps {
  title: string;
}

const mockNotifications = [
  { id: 1, message: "Volunteer Anita is 1.4km away", time: "2m ago", type: "info" },
  { id: 2, message: "You entered Safe Zone: Panjagutta", time: "18m ago", type: "safe" },
  { id: 3, message: "Safety score updated to SAFE", time: "1h ago", type: "safe" },
];

export default function TopBar({ title }: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/[0.06] bg-background/80 backdrop-blur-sm shrink-0">
      {/* Title */}
      <h1 className="text-base font-bold text-foreground tracking-wide">{title}</h1>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/60 border border-white/[0.06] text-muted-foreground text-xs hover:text-foreground hover:border-white/10 transition-colors">
          <Search size={13} />
          <span className="hidden sm:block">Search...</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
          >
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-danger" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-10 w-72 rounded-2xl border border-white/[0.08] bg-card shadow-glass z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-sm font-semibold">Notifications</p>
                </div>
                {mockNotifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <p className="text-xs text-foreground/90">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl hover:bg-white/[0.04] transition-colors">
          <div className="w-7 h-7 rounded-full bg-safe/20 border border-safe/30 flex items-center justify-center text-safe font-bold text-xs">
            P
          </div>
          <span className="text-xs font-medium text-foreground/80 hidden sm:block">Priya</span>
          <ChevronDown size={12} className="text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
