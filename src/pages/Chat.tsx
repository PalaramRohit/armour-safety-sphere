import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Shield, Zap, MapPin, Phone, Bot, User, Loader2 } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { chatWithAI } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  { label: "Am I in a safe area?", icon: MapPin },
  { label: "Emergency contacts", icon: Phone },
  { label: "Nearest safe zone", icon: Shield },
  { label: "SOS procedure", icon: Zap },
];

const initialMessage: Message = {
  id: "initial",
  role: "ai",
  content: "Hi Priya! I'm your ARMOUR Safety AI. I'm monitoring your surroundings in real-time. How can I help keep you safe today?",
  timestamp: new Date(),
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const data = await chatWithAI("user-001", text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-safe/15 border border-safe/30 flex items-center justify-center">
            <Shield size={18} className="text-safe" />
          </div>
          <div>
            <h2 className="font-bold text-sm">Safety AI</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
              <span className="text-xs text-muted-foreground">Online • Real-time monitoring</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-1 gap-4 min-h-0">
        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-h-0">
          <GlassCard padding="none" className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      msg.role === "ai"
                        ? "bg-safe/15 border border-safe/30 text-safe"
                        : "bg-primary/15 border border-primary/30 text-primary"
                    }`}>
                      {msg.role === "ai" ? <Bot size={14} /> : <User size={14} />}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "ai"
                          ? "bg-secondary/60 border border-white/[0.06] text-foreground/90 rounded-tl-sm"
                          : "bg-primary/20 border border-primary/30 text-foreground rounded-tr-sm"
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-muted-foreground px-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-safe/15 border border-safe/30 text-safe flex items-center justify-center shrink-0">
                      <Bot size={14} />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-secondary/60 border border-white/[0.06]">
                      <Loader2 size={14} className="text-safe animate-spin" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/[0.06]">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your safety, nearby zones, emergency tips..."
                  className="flex-1 bg-secondary/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-safe/30 focus:bg-safe/5 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-safe/15 border border-safe/30 text-safe flex items-center justify-center hover:bg-safe/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="w-56 flex flex-col gap-3"
        >
          <GlassCard padding="sm">
            <p className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Quick Prompts</p>
            <div className="space-y-2">
              {quickPrompts.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => sendMessage(label)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-secondary/60 border border-white/[0.04] text-left text-xs text-foreground/80 hover:bg-safe/10 hover:border-safe/20 hover:text-safe transition-all"
                >
                  <Icon size={13} className="shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard variant="safe" padding="sm">
            <p className="text-xs font-semibold text-safe mb-2">Safety Status</p>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
              <span className="text-xs text-foreground/80">Area: Safe</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-safe" />
              <span className="text-xs text-foreground/80">Score: 82/100</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-safe" />
              <span className="text-xs text-foreground/80">3 volunteers nearby</span>
            </div>
          </GlassCard>

          <GlassCard variant="danger" padding="sm">
            <p className="text-xs font-semibold text-danger mb-2">Emergency</p>
            <p className="text-[11px] text-muted-foreground mb-2">In immediate danger? Don't type — press SOS.</p>
            <div className="space-y-1.5">
              <button className="w-full py-1.5 rounded-lg bg-danger/15 border border-danger/30 text-danger text-xs font-semibold hover:bg-danger/25 transition-colors">
                📞 Police: 112
              </button>
              <button className="w-full py-1.5 rounded-lg bg-danger/15 border border-danger/30 text-danger text-xs font-semibold hover:bg-danger/25 transition-colors">
                👩 Women: 1091
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
