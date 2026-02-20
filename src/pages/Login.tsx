import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Phone, Mail, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import armourLogo from "@/assets/armour-logo.png";
import { googleLogin, verifyPhone } from "@/lib/api";

type Step = "login" | "phone" | "otp" | "success";

export default function Login() {
  const [step, setStep] = useState<Step>("login");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [email] = useState("priya@example.com");

  const handleGoogleLogin = async () => {
    setLoading(true);
    await googleLogin(email);
    setLoading(false);
    setStep("phone");
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep("otp");
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await verifyPhone(phone, otp);
    setLoading(false);
    setStep("success");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "hsl(220 20% 3%)" }}
    >
      {/* Background orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, hsl(160 84% 39%), transparent)" }} />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, hsl(0 84% 60%), transparent)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, hsl(160 84% 39%), transparent)" }} />

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Glass card */}
        <div
          className="rounded-3xl border border-white/[0.08] p-8 backdrop-blur-xl"
          style={{ background: "hsl(220 15% 8% / 0.85)", boxShadow: "0 32px 64px hsl(0 0% 0% / 0.6), inset 0 1px 0 hsl(255 255% 255% / 0.05)" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 justify-center">
            <img src={armourLogo} alt="ARMOUR" className="w-10 h-10 object-contain" />
            <span className="font-black text-2xl tracking-widest text-safe" style={{ textShadow: "0 0 20px hsl(160 84% 39% / 0.5)" }}>
              ARMOUR
            </span>
          </div>

          {step === "login" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold">Welcome back</h2>
                <p className="text-muted-foreground text-sm mt-1">Your personal safety guardian</p>
              </div>

              {/* Google login */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition-all font-medium text-sm"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Sign in with Google
              </button>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all text-sm font-medium">
                <Phone size={16} />
                Continue with Phone
              </button>

              <p className="text-center text-xs text-muted-foreground">
                By signing in, you agree to our{" "}
                <a href="#" className="text-safe hover:underline">Privacy Policy</a>
                {" "}and{" "}
                <a href="#" className="text-safe hover:underline">Terms of Service</a>
              </p>
            </div>
          )}

          {step === "phone" && (
            <form onSubmit={handlePhoneSubmit} className="space-y-5">
              <div className="text-center">
                <h2 className="text-xl font-bold">Verify Phone</h2>
                <p className="text-muted-foreground text-sm mt-1">We'll send a code to confirm your identity</p>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-secondary/60 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-safe/40 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !phone}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-safe/15 border border-safe/30 text-safe font-semibold hover:bg-safe/25 transition-colors disabled:opacity-40"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <>Send OTP <ArrowRight size={15} /></>}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="text-center">
                <h2 className="text-xl font-bold">Enter OTP</h2>
                <p className="text-muted-foreground text-sm mt-1">Sent to {phone || "+91 ****"}</p>
              </div>

              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
                className="w-full bg-secondary/60 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-center tracking-[0.5em] focus:outline-none focus:border-safe/40 transition-colors"
              />

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-safe/15 border border-safe/30 text-safe font-semibold hover:bg-safe/25 transition-colors disabled:opacity-40"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <>Verify <ArrowRight size={15} /></>}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex justify-center"
              >
                <CheckCircle size={56} className="text-safe" style={{ filter: "drop-shadow(0 0 20px hsl(160 84% 39%))" }} />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-safe">You're Protected!</h2>
                <p className="text-muted-foreground text-sm mt-1">ARMOUR is now actively monitoring your safety</p>
              </div>
              <a
                href="/"
                className="block w-full py-3 rounded-xl bg-safe/15 border border-safe/30 text-safe font-semibold hover:bg-safe/25 transition-colors"
              >
                Go to Dashboard →
              </a>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          🔒 End-to-end encrypted • Your data stays private
        </p>
      </motion.div>
    </div>
  );
}
