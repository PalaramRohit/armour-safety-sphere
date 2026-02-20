import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SOSButtonProps {
  onClick: () => void;
}

export default function SOSButton({ onClick }: SOSButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.93 }}
      className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full flex items-center justify-center font-black text-sm tracking-widest select-none"
      style={{
        background: "radial-gradient(circle, hsl(0 84% 55%) 0%, hsl(0 84% 40%) 100%)",
        boxShadow: hovered
          ? "0 0 0 4px hsl(0 84% 60% / 0.3), 0 0 40px hsl(0 84% 60% / 0.6), 0 8px 32px hsl(0 0% 0% / 0.5)"
          : "0 0 0 3px hsl(0 84% 60% / 0.2), 0 0 24px hsl(0 84% 60% / 0.4), 0 8px 24px hsl(0 0% 0% / 0.4)",
        transition: "box-shadow 0.2s ease",
      }}
    >
      {/* Pulse rings */}
      <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-danger" />
      <span
        className="absolute -inset-2 rounded-full opacity-10 animate-pulse"
        style={{ background: "hsl(0 84% 60%)" }}
      />

      <span className="relative z-10 text-white font-black text-sm tracking-widest">SOS</span>
    </motion.button>
  );
}
