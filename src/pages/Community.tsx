import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Star, BadgeCheck, MapPin, Shield, Radio } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { getNearbyVolunteers } from "@/lib/api";

export default function Community() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [safeZones, setSafeZones] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "online" | "verified">("all");

  useEffect(() => {
    getNearbyVolunteers(17.4268, 78.4484).then((d) => {
      setVolunteers(d.volunteers || []);
      setSafeZones(d.safe_zones || []);
    });
  }, []);

  const filtered = volunteers.filter((v) => {
    if (filter === "online") return v.status === "online";
    if (filter === "verified") return v.verified;
    return true;
  });

  const colors = ["hsl(200,60%,30%)", "hsl(280,40%,30%)", "hsl(160,40%,25%)", "hsl(30,50%,30%)", "hsl(340,50%,30%)", "hsl(220,50%,30%)"];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Community & Patrol</h2>
          <p className="text-muted-foreground text-xs mt-0.5">Verified volunteers ready to assist</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-safe/10 border border-safe/20">
          <Radio size={12} className="text-safe animate-pulse" />
          <span className="text-safe text-xs font-semibold">{volunteers.filter(v => v.status === "online").length} Online</span>
        </div>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { label: "Total Patrollers", value: volunteers.length, icon: Users, color: "text-primary" },
          { label: "Online Now", value: volunteers.filter(v => v.status === "online").length, icon: Radio, color: "text-safe" },
          { label: "Verified", value: volunteers.filter(v => v.verified).length, icon: BadgeCheck, color: "text-caution" },
        ].map(({ label, value, icon: Icon, color }) => (
          <GlassCard key={label} className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-white/[0.04] ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "online", "verified"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
              filter === f
                ? "bg-safe/15 border border-safe/30 text-safe"
                : "bg-secondary/60 border border-white/[0.06] text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "All Volunteers" : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Volunteer Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((vol, i) => (
              <motion.div
                key={vol.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <GlassCard className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white"
                      style={{ background: colors[i % colors.length] }}
                    >
                      {vol.name[0]}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-card ${
                        vol.status === "online" ? "bg-safe" : "bg-muted-foreground"
                      }`}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm truncate">{vol.name}</p>
                      {vol.verified && (
                        <BadgeCheck size={13} className="text-safe shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{vol.distance}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={10} className="text-caution fill-caution" />
                      <span className="text-xs font-semibold text-caution">{vol.rating}</span>
                    </div>
                  </div>

                  {/* Status + action */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      vol.status === "online"
                        ? "bg-safe/15 text-safe border border-safe/20"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {vol.status}
                    </span>
                    {vol.status === "online" && (
                      <button className="text-[10px] px-2.5 py-1 rounded-lg bg-safe/10 border border-safe/20 text-safe hover:bg-safe/20 transition-colors font-medium">
                        Request Help
                      </button>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Assistance Request + Safe Zones */}
        <div className="flex flex-col gap-4">
          {/* Live assistance */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard variant="caution">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-caution animate-pulse" />
                <span className="text-xs font-semibold text-caution">Assistance Request</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-caution/20 flex items-center justify-center font-bold text-caution text-sm shrink-0">R</div>
                <div>
                  <p className="text-xs font-semibold">Riya</p>
                  <p className="text-[10px] text-muted-foreground">600m away • 6min ago</p>
                  <p className="text-xs text-foreground/80 mt-1.5 leading-relaxed">
                    "I'm near Jubilee and I see a young woman looking lost and scared. Can any patrollers reach here?"
                  </p>
                </div>
              </div>
              <button className="mt-3 w-full py-2 rounded-xl bg-caution/15 border border-caution/30 text-caution text-xs font-semibold hover:bg-caution/25 transition-colors">
                Respond to Request
              </button>
            </GlassCard>
          </motion.div>

          {/* Safe Zones */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard>
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-safe" />
                <span className="text-xs font-semibold">Nearby Safe Zones</span>
              </div>
              <div className="space-y-3">
                {safeZones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-safe" />
                      <span className="text-xs text-foreground/80">{zone.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-safe">{zone.distance}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
