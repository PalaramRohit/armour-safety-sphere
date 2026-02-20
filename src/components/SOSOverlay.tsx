import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertTriangle, Phone, X, CheckCircle } from "lucide-react";
import { sendAlert } from "@/lib/api";

interface SOSOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SOSOverlay({ isOpen, onClose }: SOSOverlayProps) {
  const [countdown, setCountdown] = useState(5);
  const [phase, setPhase] = useState<"countdown" | "sending" | "sent">("countdown");
  const [cancelled, setCancelled] = useState(false);

  const handleSend = useCallback(async () => {
    setPhase("sending");
    await sendAlert({
      user_id: "user-001",
      alert_type: "SOS",
      network_status: "online",
      location: { lat: 17.4268, lng: 78.4484 },
    });
    setPhase("sent");
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setPhase("countdown");
      setCancelled(false);
      return;
    }

    if (phase !== "countdown") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSend();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, phase, handleSend]);

  const handleCancel = () => {
    setCancelled(true);
    onClose();
  };

  const circumference = 2 * Math.PI * 45;
  const progress = ((5 - countdown) / 5) * circumference;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background: "radial-gradient(ellipse at center, hsl(0 84% 15%) 0%, hsl(0 0% 2%) 70%)",
          }}
        >
          {/* Cancel X */}
          {phase === "countdown" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleCancel}
              className="absolute top-6 right-6 p-2 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
            >
              <X size={20} />
            </motion.button>
          )}

          {/* SOS Icon */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mb-8"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle size={32} className="text-danger" style={{ filter: "drop-shadow(0 0 12px hsl(0 84% 60%))" }} />
              <span
                className="text-6xl font-black tracking-widest"
                style={{ color: "hsl(0 84% 60%)", textShadow: "0 0 40px hsl(0 84% 60% / 0.8)" }}
              >
                SOS
              </span>
              <AlertTriangle size={32} className="text-danger" style={{ filter: "drop-shadow(0 0 12px hsl(0 84% 60%))" }} />
            </div>
          </motion.div>

          {/* Phase content */}
          <AnimatePresence mode="wait">
            {phase === "countdown" && (
              <motion.div
                key="countdown"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-8"
              >
                {/* Circular countdown */}
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(0 84% 20%)" strokeWidth="6" />
                    <motion.circle
                      cx="50" cy="50" r="45"
                      fill="none"
                      stroke="hsl(0 84% 60%)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - progress}
                      style={{ filter: "drop-shadow(0 0 8px hsl(0 84% 60%))" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-5xl font-black"
                      style={{ color: "hsl(0 84% 60%)", textShadow: "0 0 20px hsl(0 84% 60% / 0.8)" }}
                    >
                      {String(countdown).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <p className="text-white/80 text-center text-lg font-medium max-w-xs leading-relaxed">
                  Sending Alert to{" "}
                  <span className="text-danger font-bold">Guardians</span>{" "}
                  and Nearby Volunteers...
                </p>

                {/* Guardian avatars */}
                <div className="flex gap-6">
                  {["Dad", "Sister", "Friend"].map((label, i) => (
                    <div key={label} className="flex flex-col items-center gap-2">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-danger/50"
                        style={{ background: `hsl(${i * 30 + 200} 40% 25%)` }}
                      >
                        {label[0]}
                      </div>
                      <span className="text-white/60 text-xs">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-colors text-sm">
                    <Phone size={14} />
                    Call HelpLine
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-colors text-sm">
                    Share Pictures
                  </button>
                </div>

                {/* Cancel */}
                <button
                  onClick={handleCancel}
                  className="mt-2 px-8 py-3 rounded-xl border-2 border-danger/60 text-danger font-semibold hover:bg-danger/10 transition-colors"
                >
                  ⊘ Cancel Alert
                </button>
                <p className="text-white/40 text-sm">Accidental Alert?{" "}
                  <button onClick={handleCancel} className="text-white/60 underline hover:text-white transition-colors">Cancel</button>
                </p>
              </motion.div>
            )}

            {phase === "sending" && (
              <motion.div
                key="sending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 rounded-full border-4 border-danger/20 border-t-danger"
                />
                <p className="text-white text-xl font-semibold">Sending alerts...</p>
              </motion.div>
            )}

            {phase === "sent" && (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle size={72} className="text-safe" style={{ filter: "drop-shadow(0 0 20px hsl(160 84% 39%))" }} />
                </motion.div>
                <div className="text-center">
                  <p
                    className="text-3xl font-black mb-2"
                    style={{ color: "hsl(0 84% 60%)", textShadow: "0 0 20px hsl(0 84% 60% / 0.6)" }}
                  >
                    ALERT SENT!
                  </p>
                  <p className="text-white/70 text-lg">
                    Share Live Location with safety contacts in case of emergency.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-4 px-8 py-3 rounded-xl bg-safe/20 border border-safe/40 text-safe font-semibold hover:bg-safe/30 transition-colors"
                >
                  I'm Safe Now
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
