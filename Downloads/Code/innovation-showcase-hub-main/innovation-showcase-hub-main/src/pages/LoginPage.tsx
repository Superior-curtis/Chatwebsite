import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Key, User, FolderOpen, HelpCircle, Eye, EyeOff } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [devpost, setDevpost] = useState("");
  const [projectName, setProjectName] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(email, token);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or token. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 pt-20">
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-strong p-8 neon-glow">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4 neon-glow"
            >
              <Key className="text-primary" size={28} />
            </motion.div>
            <h1 className="font-display text-2xl font-bold text-foreground">Claim Your Certificate</h1>
            <p className="text-sm text-muted-foreground mt-2">Enter your credentials to access your certificate</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Mail size={14} /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <User size={14} /> Devpost Username
              </label>
              <input
                type="text"
                value={devpost}
                onChange={(e) => setDevpost(e.target.value)}
                placeholder="your-devpost-username"
                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <FolderOpen size={14} /> Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Your project name"
                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Key size={14} /> Token
                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <HelpCircle size={14} />
                </button>
              </label>
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="GIB-2026-XXX"
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-muted-foreground">
                    Your token was sent to your email after registration. It looks like <span className="text-primary font-mono">GIB-2026-XXX</span>. Check your spam folder or contact the organizers.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display text-sm tracking-wider uppercase font-semibold neon-glow hover:brightness-110 transition-all duration-300"
            >
              Access Certificate
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Demo: use <span className="text-primary font-mono">alex@example.com</span> / <span className="text-primary font-mono">GIB-2026-001</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
