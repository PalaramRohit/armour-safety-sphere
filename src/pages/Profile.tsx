import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck, Star, Shield, Activity, ChevronRight,
  Bell, Eye, Phone, Camera, User, Settings
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { getTrustScore } from "@/lib/api";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

const settingsItems = [
  { label: "Enable Patrol Alerts", enabled: true, icon: Bell },
  { label: "Incident Precision Reduced", enabled: false, icon: Eye },
  { label: "SOS Countdown: 5 Seconds", enabled: true, icon: Shield },
  { label: "Share Location with Guardians", enabled: true, icon: Activity },
];

export default function Profile() {
  const [trustData, setTrustData] = useState<any>(null);
  const [settings, setSettings] = useState(settingsItems);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    getTrustScore("priya@example.com").then(setTrustData);
  }, []);

  const toggleSetting = (i: number) => {
    setSettings((prev) => prev.map((s, idx) => idx === i ? { ...s, enabled: !s.enabled } : s));
  };

  const handleVerify = async () => {
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 1500));
    setVerifying(false);
    setVerified(true);
  };

  const score = trustData?.score ?? 87;
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Profile & Settings</h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column: Profile + Trust */}
        <div className="flex flex-col gap-4">
          {/* Profile card */}
          <motion.div {...fadeUp(0.08)}>
            <GlassCard className="flex flex-col items-center py-6 gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-safe/30 to-primary/20 border-2 border-safe/30 flex items-center justify-center text-3xl font-black text-safe">
                  P
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-safe border-2 border-background flex items-center justify-center">
                  <BadgeCheck size={12} className="text-background" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-bold text-base">Priya Sharma</h3>
                <p className="text-xs text-muted-foreground">+91 98765 43210</p>
                <div className="flex items-center gap-1 justify-center mt-1.5">
                  <BadgeCheck size={13} className="text-safe" />
                  <span className="text-xs text-safe font-semibold">Verified Patroller</span>
                </div>
              </div>

              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-xl bg-secondary/60 border border-white/[0.06]">
                <Camera size={12} />
                Change Photo
              </button>
            </GlassCard>
          </motion.div>

          {/* Trust Score */}
          <motion.div {...fadeUp(0.16)}>
            <GlassCard variant="safe">
              <div className="flex items-center gap-2 mb-4">
                <Star size={14} className="text-caution fill-caution" />
                <h3 className="font-semibold text-sm">Trust Score</h3>
              </div>

              {/* Score ring */}
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
                    <circle cx="44" cy="44" r="40" fill="none" stroke="hsl(160 84% 39% / 0.1)" strokeWidth="6" />
                    <motion.circle
                      cx="44" cy="44" r="40"
                      fill="none"
                      stroke="hsl(160 84% 39%)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: dashOffset }}
                      transition={{ duration: 1.2, delay: 0.4 }}
                      style={{ filter: "drop-shadow(0 0 6px hsl(160 84% 39%))" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-safe">{score}</span>
                    <span className="text-[10px] text-muted-foreground">/ 100</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  {trustData?.breakdown && Object.entries(trustData.breakdown).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-[10px] mb-0.5">
                        <span className="text-muted-foreground capitalize">{key}</span>
                        <span className="text-foreground font-semibold">{val as number}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-safe"
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges */}
              {trustData?.badges && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {trustData.badges.map((badge: string) => (
                    <span key={badge} className="text-[10px] px-2.5 py-1 rounded-full bg-safe/10 border border-safe/20 text-safe font-semibold">
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>

        {/* Right column: Emergency Contacts + Safety Settings + Verify */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Emergency Contacts */}
          <motion.div {...fadeUp(0.12)}>
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-danger" />
                  <h3 className="font-semibold text-sm">Emergency Contacts</h3>
                </div>
                <button className="text-xs text-safe hover:text-safe/80 transition-colors">+ Add</button>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Raj Sharma", relation: "Dad", phone: "+91 98765 11111", color: "hsl(220,50%,30%)" },
                  { name: "Maya", relation: "Friend", phone: "+91 98765 22222", color: "hsl(340,40%,30%)" },
                ].map((contact) => (
                  <div key={contact.name} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: contact.color }}
                      >
                        {contact.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.relation} • {contact.phone}</p>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger hover:bg-danger/20 transition-colors">
                      <Phone size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Identity Verification */}
          <motion.div {...fadeUp(0.2)}>
            <GlassCard variant={verified ? "safe" : "default"}>
              <div className="flex items-center gap-2 mb-3">
                <User size={14} className={verified ? "text-safe" : "text-caution"} />
                <h3 className="font-semibold text-sm">Identity Verification</h3>
                {verified && <BadgeCheck size={14} className="text-safe ml-auto" />}
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {verified
                  ? "Your identity is verified. This increases your trust score and volunteer priority."
                  : "Verify your identity to unlock full trust benefits and priority volunteer response."
                }
              </p>
              {!verified ? (
                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-caution/10 border border-caution/30 text-caution text-sm font-semibold hover:bg-caution/20 transition-colors disabled:opacity-60"
                >
                  {verifying ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Shield size={14} /></motion.div> Verifying...</>
                  ) : (
                    <>Verify Identity <ChevronRight size={14} /></>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2 text-safe text-sm font-semibold">
                  <BadgeCheck size={16} />
                  Identity Verified Successfully
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Safety Settings */}
          <motion.div {...fadeUp(0.28)}>
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <Settings size={14} className="text-muted-foreground" />
                <h3 className="font-semibold text-sm">Safety Settings</h3>
              </div>
              <div className="space-y-3">
                {settings.map((item, i) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <item.icon size={14} className="text-muted-foreground" />
                      <span className="text-sm text-foreground/80">{item.label}</span>
                    </div>
                    <button
                      onClick={() => toggleSetting(i)}
                      className={`w-10 h-5.5 rounded-full border transition-all relative ${
                        item.enabled
                          ? "bg-safe/20 border-safe/40"
                          : "bg-secondary border-white/10"
                      }`}
                      style={{ height: 22, width: 40 }}
                    >
                      <motion.div
                        animate={{ x: item.enabled ? 18 : 2 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={`absolute top-0.5 w-4 h-4 rounded-full ${item.enabled ? "bg-safe" : "bg-muted-foreground"}`}
                        style={{ boxShadow: item.enabled ? "0 0 8px hsl(160 84% 39%)" : "none" }}
                      />
                    </button>
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
