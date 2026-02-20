import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, MapPin, Users, AlertTriangle, CheckCircle,
  Navigation, Clock, TrendingUp, Zap, Radio,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { getSessionTimeline, getNearbyVolunteers } from "@/lib/api";

const safetyData = { score: 82, level: "SAFE", zone: "City Center Mall" };

const statusColors = {
  safe: { text: "text-safe", bg: "bg-safe/10", border: "border-safe/20" },
  caution: { text: "text-caution", bg: "bg-caution/10", border: "border-caution/20" },
  danger: { text: "text-danger", bg: "bg-danger/10", border: "border-danger/20" },
  info: { text: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
};

const eventIcons: Record<string, React.ReactNode> = {
  check_in: <CheckCircle size={14} />,
  zone_enter: <Navigation size={14} />,
  volunteer: <Users size={14} />,
  risk_update: <AlertTriangle size={14} />,
  sos_test: <Shield size={14} />,
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45 },
});

export default function Dashboard() {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [safeZones, setSafeZones] = useState<any[]>([]);

  useEffect(() => {
    getSessionTimeline("user-001").then((d) => setTimeline(d.events || []));
    getNearbyVolunteers(17.4268, 78.4484).then((d) => {
      setVolunteers(d.volunteers || []);
      setSafeZones(d.safe_zones || []);
    });
  }, []);

  const scorePercent = safetyData.score;
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (scorePercent / 100) * circumference;

  return (
    <div className="p-6 space-y-6">
      {/* Header greeting */}
      <motion.div {...fadeUp(0)} className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Good evening, Priya 👋</p>
          <h2 className="text-xl font-bold mt-0.5">Your Safety Overview</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-safe/10 border border-safe/20">
          <Radio size={13} className="text-safe animate-pulse" />
          <span className="text-safe text-xs font-semibold">Live Monitoring</span>
        </div>
      </motion.div>

      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Safety Score */}
        <motion.div {...fadeUp(0.08)}>
          <GlassCard variant="safe" className="flex flex-col items-center py-6 gap-4">
            {/* Circular gauge */}
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(160 84% 39% / 0.12)" strokeWidth="8" />
                <motion.circle
                  cx="60" cy="60" r="54"
                  fill="none"
                  stroke="hsl(160 84% 39%)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  style={{ filter: "drop-shadow(0 0 8px hsl(160 84% 39%))" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-safe">{scorePercent}</span>
                <span className="text-xs text-muted-foreground font-medium">/ 100</span>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Shield size={16} className="text-safe" />
                <span className="text-lg font-bold text-safe">{safetyData.level}</span>
              </div>
              <p className="text-muted-foreground text-xs flex items-center gap-1 justify-center">
                <MapPin size={11} />
                {safetyData.zone}
              </p>
            </div>

            {/* Risk bar */}
            <div className="w-full px-2">
              <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                <div className="flex-1 bg-danger/80 rounded-l-full" />
                <div className="flex-1 bg-caution/80" />
                <div className="flex-[2] bg-safe/80 rounded-r-full" />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>DANGER</span><span>CAUTION</span><span>SAFE</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeUp(0.16)} className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 h-full">
            {[
              { label: "Nearby Volunteers", value: volunteers.filter(v => v.status === "online").length || 3, icon: Users, color: "text-safe", sub: "Online now" },
              { label: "Safe Zones", value: safeZones.length || 3, icon: Shield, color: "text-primary", sub: "Within 2km" },
              { label: "Area Risk", value: "LOW", icon: TrendingUp, color: "text-safe", sub: "Last 6 hours" },
              { label: "Response Time", value: "< 2 min", icon: Zap, color: "text-caution", sub: "Avg volunteer ETA" },
            ].map(({ label, value, icon: Icon, color, sub }, i) => (
              <motion.div key={label} {...fadeUp(0.2 + i * 0.07)}>
                <GlassCard className="h-full flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <p className="text-xs text-muted-foreground font-medium">{label}</p>
                    <div className={`p-1.5 rounded-lg bg-white/[0.04] ${color}`}>
                      <Icon size={14} />
                    </div>
                  </div>
                  <div>
                    <p className={`text-2xl font-black ${color}`}>{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Activity Timeline */}
        <motion.div {...fadeUp(0.35)} className="lg:col-span-3">
          <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Recent Activity</h3>
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all</button>
            </div>
            <div className="space-y-3">
              {timeline.map((event, i) => {
                const colors = statusColors[event.status as keyof typeof statusColors] || statusColors.info;
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.07 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`mt-0.5 p-1.5 rounded-lg ${colors.bg} ${colors.border} border ${colors.text} shrink-0`}>
                      {eventIcons[event.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground/90 leading-relaxed">{event.message}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock size={10} className="text-muted-foreground" />
                        <p className="text-[10px] text-muted-foreground">{event.time}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Nearby Safe Zones + Volunteers */}
        <motion.div {...fadeUp(0.42)} className="lg:col-span-2">
          <div className="flex flex-col gap-4 h-full">
            {/* Safe Zones */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-safe" />
                <h3 className="font-semibold text-sm">Nearby Safe Zones</h3>
              </div>
              <div className="space-y-2.5">
                {safeZones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-safe shrink-0" />
                      <span className="text-xs text-foreground/80">{zone.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-safe">{zone.distance}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Patrolling Community */}
            <GlassCard className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-primary" />
                <h3 className="font-semibold text-sm">Patrolling Nearby</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {volunteers.filter(v => v.status === "online").slice(0, 4).map((vol) => (
                  <div key={vol.id} className="flex items-center gap-1.5">
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full bg-secondary border border-white/10 flex items-center justify-center text-xs font-bold text-foreground/70">
                        {vol.name[0]}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-safe border border-background" />
                    </div>
                  </div>
                ))}
                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground ml-1">
                    +{Math.max(0, volunteers.filter(v => v.status === "online").length - 4)} more online
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
