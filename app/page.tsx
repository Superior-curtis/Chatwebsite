"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import {
  MessageSquare, Bot, Zap, Shield, Layers, ChevronRight, Search,
  Plus, Folder, Settings, LayoutDashboard, Store, Puzzle,
  Send, Paperclip, Mic, MoreHorizontal, Star, Download, Play,
  CheckCircle, ArrowRight, Globe, Code2, Terminal, Sparkles,
  ChevronDown, X, Menu, FolderOpen, BrainCircuit, Flame,
  ToggleLeft, ToggleRight, Copy, ExternalLink, LogIn, User,
  Lock, Mail, Eye, EyeOff, TrendingUp, Activity, Clock,
  Hash, Image as ImageIcon, FileText, Cpu, Wifi, Package,
  MousePointerClick, Gauge, ChevronLeft
} from "lucide-react";

/* ─── Easing presets ─── */
const expo = [0.16, 1, 0.3, 1] as const;
const snappy = [0.4, 0, 0.2, 1] as const;

/* ─── Shared fade-up variant ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: expo, delay: i * 0.08 },
  }),
};

/* ─── Section header ─── */
function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border border-primary/30 bg-primary/10 text-primary">
      {children}
    </span>
  );
}

/* ─── Animated reveal wrapper ─── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={delay}
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════ */
function HeroSection({ onNav }: { onNav: (s: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 1.12]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const words = ["Smarter.", "Faster.", "Together."];
  const [wordIdx, setWordIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Radial glow blobs */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity }}
      >
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.22 250 / 18%) 0%, transparent 70%)",
            scale,
          }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.7 0.17 210 / 12%) 0%, transparent 70%)" }}
          animate={{ x: [-20, 20, -20], y: [-10, 15, -10] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.2 280 / 12%) 0%, transparent 70%)" }}
          animate={{ x: [20, -20, 20], y: [10, -15, 10] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* 3D floating orb */}
      <motion.div
        className="absolute top-24 right-16 hidden lg:block"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -60]) }}
        animate={{ y: [-8, 8, -8], rotate: [0, 3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-32 h-32 rounded-full glow-brand"
          style={{
            background: "radial-gradient(135deg at 35% 35%, oklch(0.7 0.17 210) 0%, oklch(0.55 0.22 250) 50%, oklch(0.35 0.15 270) 100%)",
          }}
        />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-16 hidden lg:block"
        animate={{ y: [8, -8, 8], rotate: [0, -3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div className="w-20 h-20 rounded-2xl glow-cyan rotate-12"
          style={{
            background: "radial-gradient(135deg at 35% 35%, oklch(0.85 0.1 190) 0%, oklch(0.7 0.17 210) 60%, oklch(0.5 0.18 230) 100%)",
          }}
        />
      </motion.div>

      {/* Hero content */}
      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: expo }}
        >
          <SectionTag><Sparkles size={11} /> AI Platform 2026</SectionTag>
        </motion.div>

        <motion.h1
          className="mt-8 text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: expo, delay: 0.1 }}
        >
          <span className="text-foreground">Build AI Chats</span>
          <br />
          <span className="shimmer-text">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: expo }}
              >
                {words[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: expo, delay: 0.2 }}
        >
          NeuralChat is the all-in-one platform for deploying intelligent AI assistants — with streaming
          responses, plugin skills, a workspace for your team, and a one-click embeddable widget.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: expo, delay: 0.3 }}
        >
          <button
            onClick={() => onNav("auth")}
            className="group relative px-8 py-4 rounded-xl font-semibold text-primary-foreground overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] glow-brand"
            style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={() => onNav("dashboard")}
            className="px-8 py-4 rounded-xl font-semibold border border-border bg-card/60 backdrop-blur-sm hover:bg-accent/60 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
          >
            <Play size={15} className="text-primary" /> View Demo
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {[
            { value: "50M+", label: "Messages / day" },
            { value: "12K+", label: "Teams using it" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "< 80ms", label: "First token" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
      >
        <ChevronDown size={20} className="text-muted-foreground" />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   FEATURES SECTION
═══════════════════════════════════════════════ */
const features = [
  {
    icon: MessageSquare,
    title: "Streaming Chat",
    desc: "Token-by-token SSE streaming responses. Real-time, low-latency, and pixel-perfect animations as each word arrives.",
    color: "oklch(0.55 0.22 250)",
  },
  {
    icon: Puzzle,
    title: "Plugin Skills",
    desc: "Chain skills like Fireclaw, CodeRunner, and ImageGen into your assistant's prompt pipeline with one toggle.",
    color: "oklch(0.7 0.17 210)",
  },
  {
    icon: Folder,
    title: "Workspaces",
    desc: "Organize bots and conversations into folders. Share workspace with your team. Drag-and-drop everything.",
    color: "oklch(0.65 0.18 160)",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "Role-based access, audit logs, SSO via OIDC, data residency selection, and HIPAA-ready infrastructure.",
    color: "oklch(0.6 0.2 280)",
  },
  {
    icon: Code2,
    title: "Embeddable Widget",
    desc: "One-line script tag. Generate a site-scoped key, customize theme and behavior, ship to production in minutes.",
    color: "oklch(0.65 0.2 320)",
  },
  {
    icon: BrainCircuit,
    title: "Model Agnostic",
    desc: "Connect Ollama, OpenAI, Anthropic, or your own endpoint. Model picker auto-discovers via /api/ollama/models.",
    color: "oklch(0.68 0.18 50)",
  },
];

function FeaturesSection() {
  return (
    <section className="py-32 px-6 relative">
      <div className="dot-bg absolute inset-0 opacity-30 pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Reveal>
            <SectionTag><Layers size={11} /> Features</SectionTag>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight">
              Everything you need to ship
              <br />
              <span className="shimmer-text">an AI product</span>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              NeuralChat bundles every building block — so you can focus on crafting the experience,
              not stitching infrastructure together.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.5}>
              <motion.div
                className="group relative p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden cursor-pointer"
                whileHover={{ y: -4, transition: { duration: 0.3, ease: snappy } }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${f.color}15, transparent 60%)` }}
                />
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}20`, border: `1px solid ${f.color}40` }}
                >
                  <f.icon size={20} style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: f.color }}>
                  Learn more <ChevronRight size={12} />
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD PREVIEW
═══════════════════════════════════════════════ */
const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: MessageSquare, label: "Chats", active: true },
  { icon: Bot, label: "Bots", active: false },
  { icon: Folder, label: "Workspaces", active: false },
  { icon: Store, label: "Marketplace", active: false },
  { icon: Puzzle, label: "Plugins", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const mockMessages = [
  { role: "user", text: "Explain quantum entanglement in simple terms." },
  { role: "assistant", text: "Sure! Quantum entanglement is a phenomenon where two particles become linked — measuring one instantly tells you the state of the other, no matter how far apart they are.", streaming: false },
  { role: "user", text: "Can you write a Python function to generate a Fibonacci sequence?" },
  { role: "assistant", text: "def fibonacci(n):\n    seq = [0, 1]\n    for i in range(2, n):\n        seq.append(seq[-1] + seq[-2])\n    return seq[:n]", isCode: true, streaming: false },
];

function ChatBubble({ msg, index }: { msg: typeof mockMessages[0]; index: number }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: expo, delay: index * 0.12 }}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}>
          <Bot size={14} className="text-white" />
        </div>
      )}
      <div className={`max-w-[72%] ${isUser ? "order-first" : ""}`}>
        {(msg as any).isCode ? (
          <div className="rounded-xl overflow-hidden border border-border">
            <div className="flex items-center justify-between px-3 py-2 bg-muted/80 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Terminal size={11} /> Python</span>
              <button className="hover:text-foreground transition-colors"><Copy size={11} /></button>
            </div>
            <pre className="p-3 text-xs font-mono bg-background/80 text-cyan overflow-x-auto"
              style={{ color: "oklch(0.7 0.17 210)" }}>
              <code>{msg.text}</code>
            </pre>
          </div>
        ) : (
          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "text-primary-foreground rounded-tr-sm"
              : "bg-card border border-border rounded-tl-sm"
          }`}
            style={isUser ? { background: "linear-gradient(135deg, oklch(0.55 0.22 250), oklch(0.48 0.22 260))" } : {}}
          >
            {msg.text}
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-secondary border border-border">
          <User size={14} className="text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );
}

function StreamingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}>
        <Bot size={14} className="text-white" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-card border border-border">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "oklch(0.55 0.22 250)" }}
              animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showStreaming, setShowStreaming] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowStreaming(true), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <Reveal><SectionTag><MessageSquare size={11} /> Chat Interface</SectionTag></Reveal>
          <Reveal delay={1}><h2 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight">
            Claude-quality chat,<br /><span className="shimmer-text">your branding</span>
          </h2></Reveal>
        </div>

        {/* App shell preview */}
        <Reveal delay={1}>
          <div className="rounded-3xl border border-border overflow-hidden shadow-2xl"
            style={{ boxShadow: "0 40px 120px oklch(0.55 0.22 250 / 15%), 0 0 0 1px oklch(1 0 0 / 6%)" }}>

            {/* Title bar */}
            <div className="flex items-center gap-3 px-4 py-3 bg-card/90 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/70" />
                <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.75 0.18 80 / 70%)" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.65 0.2 140 / 70%)" }} />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-muted/60 text-xs text-muted-foreground border border-border/50">
                  <Globe size={10} /> app.neuralchat.io
                </div>
              </div>
            </div>

            <div className="flex h-[560px]">
              {/* Sidebar */}
              <AnimatePresence initial={false}>
                {sidebarOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: expo }}
                    className="flex-shrink-0 overflow-hidden border-r border-border flex flex-col"
                    style={{ background: "oklch(0.10 0.007 240)" }}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}>
                          <BrainCircuit size={14} className="text-white" />
                        </div>
                        <span className="font-bold text-sm">NeuralChat</span>
                      </div>
                      <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-dashed border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
                        <Plus size={12} /> New Conversation
                      </button>
                    </div>

                    <nav className="flex-1 px-2 space-y-0.5">
                      {sidebarItems.map(item => (
                        <div key={item.label}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                            item.active
                              ? "bg-primary/15 text-primary font-semibold"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                          }`}
                        >
                          <item.icon size={14} />
                          {item.label}
                          {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                        </div>
                      ))}
                    </nav>

                    {/* Recent conversations */}
                    <div className="p-3 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-2 px-2 font-medium">Recent</div>
                      {["Quantum physics Q&A", "Code: Fibonacci", "Marketing copy draft"].map(c => (
                        <div key={c} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent/40 cursor-pointer transition-colors">
                          <MessageSquare size={11} className="text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground truncate">{c}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main chat area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Chat header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/40">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(v => !v)} className="p-1.5 rounded-lg hover:bg-accent/60 transition-colors">
                      <Menu size={14} className="text-muted-foreground" />
                    </button>
                    <div>
                      <div className="text-sm font-semibold">Quantum Physics Q&A</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "oklch(0.65 0.2 140)" }} />
                        GPT-4o · 2 messages
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-accent/60 transition-colors">
                      <Star size={14} className="text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-accent/60 transition-colors">
                      <MoreHorizontal size={14} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {mockMessages.map((m, i) => (
                    <ChatBubble key={i} msg={m} index={i} />
                  ))}
                  {showStreaming && <StreamingIndicator />}
                </div>

                {/* Composer */}
                <div className="p-3 border-t border-border">
                  <div className="flex items-end gap-2 bg-card/80 rounded-2xl border border-border px-3 py-2.5">
                    <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                      <Paperclip size={15} />
                    </button>
                    <div className="flex-1 text-sm text-muted-foreground">Ask anything…</div>
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                        <Mic size={15} />
                      </button>
                      <button
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-primary-foreground"
                        style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}
                      >
                        <Send size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-2 gap-1 text-xs text-muted-foreground">
                    <Zap size={9} style={{ color: "oklch(0.68 0.18 50)" }} />
                    <span>3 skills active: Fireclaw · CodeRunner · WebSearch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   WORKSPACE / FOLDERS SECTION
═══════════════════════════════════════════════ */
const folders = [
  { name: "Marketing", count: 14, color: "oklch(0.65 0.2 320)", bots: ["CopyBot", "SEO-pal"] },
  { name: "Engineering", count: 8, color: "oklch(0.55 0.22 250)", bots: ["CodeBot", "DocGen"] },
  { name: "Customer Support", count: 31, color: "oklch(0.7 0.17 210)", bots: ["HelpDesk v2"] },
  { name: "Research", count: 6, color: "oklch(0.65 0.18 160)", bots: ["Summarizer", "Analyst"] },
];

function FolderCard({ folder, index }: { folder: typeof folders[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      className="rounded-2xl border border-border overflow-hidden cursor-pointer select-none"
      style={{ background: "oklch(0.11 0.008 240)" }}
      whileHover={{ scale: 1.02, transition: { duration: 0.25, ease: snappy } }}
      onClick={() => setOpen(v => !v)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotateY: open ? 15 : 0 }}
              transition={{ duration: 0.35, ease: expo }}
            >
              {open
                ? <FolderOpen size={22} style={{ color: folder.color }} />
                : <Folder size={22} style={{ color: folder.color }} />
              }
            </motion.div>
            <div>
              <div className="font-semibold text-sm">{folder.name}</div>
              <div className="text-xs text-muted-foreground">{folder.count} conversations</div>
            </div>
          </div>
          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.3, ease: expo }}>
            <ChevronRight size={14} className="text-muted-foreground" />
          </motion.div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: expo }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                {folder.bots.map(bot => (
                  <div key={bot} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent/40 transition-colors">
                    <Bot size={12} style={{ color: folder.color }} />
                    <span className="text-xs">{bot}</span>
                    <div className="ml-auto text-xs text-muted-foreground">Active</div>
                  </div>
                ))}
                <button
                  className="w-full mt-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg border border-dashed border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                  onClick={e => e.stopPropagation()}
                >
                  <Plus size={11} /> Add Bot
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function WorkspacesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Reveal><SectionTag><Folder size={11} /> Workspaces</SectionTag></Reveal>
            <Reveal delay={1}>
              <h2 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight">
                Organize everything<br /><span className="shimmer-text">your way</span>
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Group bots and conversations into folders. Share workspaces with your team.
                Drag-and-drop to reorganize. Animated folder open/close so you always know where you are.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <ul className="mt-6 space-y-3">
                {[
                  "Drag-and-drop folders with live animations",
                  "Per-workspace bot configuration and model selection",
                  "Team sharing with role-based access controls",
                  "Conversation timeline with metadata and attachments",
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle size={15} className="text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={2}>
            <div className="space-y-3">
              {folders.map((f, i) => <FolderCard key={f.name} folder={f} index={i} />)}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   BOT EDITOR SECTION
═══════════════════════════════════════════════ */
const models = [
  { id: "llama3.1:8b", label: "Llama 3.1 8B", speed: "Fast", ctx: "128K" },
  { id: "mistral:7b", label: "Mistral 7B", speed: "Fast", ctx: "32K" },
  { id: "gpt-4o", label: "GPT-4o", speed: "Balanced", ctx: "128K" },
  { id: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet", speed: "Balanced", ctx: "200K" },
];

function BotEditorPreview() {
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [temp, setTemp] = useState(0.7);
  const [showModel, setShowModel] = useState(false);

  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <Reveal><SectionTag><Bot size={11} /> Bot Editor</SectionTag></Reveal>
          <Reveal delay={1}>
            <h2 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight">
              Build your bot<br /><span className="shimmer-text">in minutes</span>
            </h2>
          </Reveal>
        </div>

        <Reveal delay={1}>
          <div className="grid lg:grid-cols-2 gap-6 rounded-3xl border border-border overflow-hidden"
            style={{ boxShadow: "0 30px 80px oklch(0.55 0.22 250 / 12%)" }}>

            {/* Config panel */}
            <div className="p-6 border-r border-border bg-card/50">
              <h3 className="font-bold text-base mb-5 flex items-center gap-2">
                <Settings size={15} className="text-primary" /> Bot Configuration
              </h3>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="text-xs text-muted-foreground font-medium block mb-1.5">Bot Name</label>
                  <input
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
                    defaultValue="Customer Support Bot"
                  />
                </div>

                {/* Model picker */}
                <div>
                  <label className="text-xs text-muted-foreground font-medium block mb-1.5">
                    Model <span className="text-primary ml-1">← GET /api/ollama/models</span>
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowModel(v => !v)}
                      className="w-full flex items-center justify-between bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-sm hover:border-primary/50 transition-colors"
                    >
                      <span>{models.find(m => m.id === selectedModel)?.label}</span>
                      <ChevronDown size={13} className={`text-muted-foreground transition-transform ${showModel ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {showModel && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{ duration: 0.2, ease: snappy }}
                          className="absolute top-full mt-1 left-0 right-0 z-10 rounded-xl border border-border overflow-hidden shadow-xl"
                          style={{ background: "oklch(0.12 0.008 240)" }}
                        >
                          {models.map(m => (
                            <button
                              key={m.id}
                              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-accent/60 transition-colors ${selectedModel === m.id ? "bg-primary/10 text-primary" : ""}`}
                              onClick={() => { setSelectedModel(m.id); setShowModel(false); }}
                            >
                              <div>
                                <div className="font-medium text-left">{m.label}</div>
                                <div className="text-xs text-muted-foreground">{m.ctx} context</div>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${m.speed === "Fast" ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"}`}>
                                {m.speed}
                              </span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* System prompt */}
                <div>
                  <label className="text-xs text-muted-foreground font-medium block mb-1.5">System Prompt</label>
                  <textarea
                    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none transition-all h-24"
                    defaultValue="You are a helpful customer support assistant for Acme Corp. Be concise, friendly, and always escalate billing issues to a human agent."
                  />
                </div>

                {/* Temperature */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-muted-foreground font-medium">Temperature</label>
                    <span className="text-xs font-mono text-primary">{temp.toFixed(1)}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range" min={0} max={2} step={0.1} value={temp}
                      onChange={e => setTemp(parseFloat(e.target.value))}
                      className="w-full accent-primary h-1.5 rounded-full bg-muted cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Precise</span><span>Creative</span>
                  </div>
                </div>
              </div>

              <button
                className="mt-6 w-full py-3 rounded-xl font-semibold text-sm text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}
              >
                Save & Deploy Bot
              </button>
            </div>

            {/* Preview panel */}
            <div className="p-6 flex flex-col">
              <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                <Play size={15} className="text-primary" /> Live Preview
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Streaming
                </span>
              </h3>

              <div className="flex-1 space-y-3 overflow-y-auto">
                <div className="flex justify-end">
                  <div className="max-w-xs px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm text-primary-foreground"
                    style={{ background: "linear-gradient(135deg, oklch(0.55 0.22 250), oklch(0.48 0.22 260))" }}>
                    How do I reset my password?
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}>
                    <Bot size={12} className="text-white" />
                  </div>
                  <div className="max-w-xs px-4 py-2.5 rounded-2xl rounded-tl-sm bg-card border border-border text-sm">
                    To reset your password, click{" "}
                    <span style={{ color: "oklch(0.7 0.17 210)" }}>Forgot Password</span> on the login page.
                    You&apos;ll receive a reset link within 2 minutes.
                  </div>
                </div>
                <StreamingIndicator />
              </div>

              <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border/50">
                <div className="text-xs text-muted-foreground mb-2 font-medium">Active Skills</div>
                <div className="flex flex-wrap gap-2">
                  {["Fireclaw", "KnowledgeBase", "WebSearch"].map((sk, i) => (
                    <span key={sk} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium"
                      style={{
                        borderColor: ["oklch(0.65 0.2 320 / 40%)", "oklch(0.55 0.22 250 / 40%)", "oklch(0.7 0.17 210 / 40%)"][i],
                        color: ["oklch(0.65 0.2 320)", "oklch(0.55 0.22 250)", "oklch(0.7 0.17 210)"][i],
                        background: ["oklch(0.65 0.2 320 / 10%)", "oklch(0.55 0.22 250 / 10%)", "oklch(0.7 0.17 210 / 10%)"][i],
                      }}>
                      <Zap size={9} /> {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   MARKETPLACE / SKILLS
═══════════════════════════════════════════════ */
const plugins = [
  {
    name: "🔥 Fireclaw",
    category: "Search & Retrieval",
    desc: "Lightning-fast web retrieval skill. Chains into prompts to answer with real-time web data, citations, and source cards.",
    rating: 4.9, installs: "28K",
    enabled: true,
    color: "oklch(0.65 0.2 320)",
    badge: "Featured",
  },
  {
    name: "⚡ CodeRunner",
    category: "Developer Tools",
    desc: "Execute Python, JavaScript, and Bash snippets inline. Shows live output in a sandboxed cell inside the chat.",
    rating: 4.8, installs: "19K",
    enabled: true,
    color: "oklch(0.55 0.22 250)",
    badge: "Popular",
  },
  {
    name: "🌐 WebSearch",
    category: "Research",
    desc: "Real-time search integration with automatic citation injection. Supports DuckDuckGo, Google, and Brave APIs.",
    rating: 4.7, installs: "35K",
    enabled: false,
    color: "oklch(0.7 0.17 210)",
    badge: null,
  },
  {
    name: "🖼️ ImageGen",
    category: "Generative AI",
    desc: "Generate images directly in chat using Stable Diffusion, DALL·E 3, or Flux. Renders inline with download options.",
    rating: 4.6, installs: "14K",
    enabled: false,
    color: "oklch(0.65 0.18 160)",
    badge: "New",
  },
  {
    name: "📄 DocAnalyzer",
    category: "Productivity",
    desc: "Upload PDFs, Word docs, or spreadsheets. Skill extracts, summarizes, and enables deep Q&A against the content.",
    rating: 4.8, installs: "22K",
    enabled: false,
    color: "oklch(0.68 0.18 50)",
    badge: null,
  },
  {
    name: "🧮 Calculator",
    category: "Utilities",
    desc: "Math expression solver with step-by-step explanation. Handles calculus, linear algebra, and unit conversions.",
    rating: 4.5, installs: "11K",
    enabled: true,
    color: "oklch(0.6 0.2 280)",
    badge: null,
  },
];

function PluginCard({ plugin, index }: { plugin: typeof plugins[0]; index: number }) {
  const [enabled, setEnabled] = useState(plugin.enabled);
  const [installing, setInstalling] = useState(false);

  const handleToggle = () => {
    if (!enabled) {
      setInstalling(true);
      setTimeout(() => { setInstalling(false); setEnabled(true); }, 1200);
    } else {
      setEnabled(false);
    }
  };

  return (
    <Reveal delay={index * 0.4}>
      <motion.div
        className="group p-5 rounded-2xl border border-border overflow-hidden relative"
        style={{ background: "oklch(0.11 0.008 240)" }}
        whileHover={{ y: -3, transition: { duration: 0.25, ease: snappy } }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 20% 20%, ${plugin.color}12, transparent 60%)` }}
        />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base">{plugin.name}</span>
                {plugin.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: `${plugin.color}20`,
                      color: plugin.color,
                      border: `1px solid ${plugin.color}40`
                    }}>
                    {plugin.badge}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{plugin.category}</div>
            </div>

            <motion.button
              onClick={handleToggle}
              className="flex-shrink-0"
              whileTap={{ scale: 0.9 }}
              title={enabled ? "Disable" : "Enable"}
            >
              {installing ? (
                <motion.div
                  className="w-8 h-8 rounded-full border-2 border-t-transparent"
                  style={{ borderColor: plugin.color }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              ) : enabled ? (
                <div style={{ color: plugin.color }}><ToggleRight size={28} /></div>
              ) : (
                <ToggleLeft size={28} className="text-muted-foreground" />
              )}
            </motion.button>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{plugin.desc}</p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star size={11} style={{ color: "oklch(0.75 0.18 80)" }} />
              <span>{plugin.rating}</span>
              <span className="mx-1">·</span>
              <Download size={11} />
              <span>{plugin.installs}</span>
            </div>
            {enabled && (
              <span className="flex items-center gap-1 text-green-400 font-medium">
                <CheckCircle size={10} /> Active
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
}

function MarketplaceSection() {
  return (
    <section className="py-24 px-6 relative">
      <div className="dot-bg absolute inset-0 opacity-20 pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <Reveal><SectionTag><Store size={11} /> Marketplace</SectionTag></Reveal>
          <Reveal delay={1}>
            <h2 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight">
              Supercharge with<br /><span className="shimmer-text">plugins & skills</span>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Browse 200+ skills. Toggle to activate, configure per-bot, and chain into
              your prompt pipeline automatically. Call <code className="text-primary text-xs">/api/plugins/:id/install</code> to wire up.
            </p>
          </Reveal>
        </div>

        {/* Search bar */}
        <Reveal delay={2}>
          <div className="flex gap-3 mb-8 max-w-xl mx-auto">
            <div className="flex-1 flex items-center gap-2 bg-card/60 border border-border rounded-xl px-4 py-2.5">
              <Search size={14} className="text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Search skills & plugins…</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card/60 text-sm hover:bg-accent/60 transition-colors">
              <Gauge size={13} /> Filter
            </button>
          </div>
        </Reveal>

        {/* Tabs */}
        <Reveal delay={2}>
          <div className="flex gap-2 mb-6 justify-center flex-wrap">
            {["All", "Featured", "Search", "Code", "Generative", "Productivity"].map((t, i) => (
              <button key={t}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  i === 0
                    ? "bg-primary/20 border-primary/40 text-primary font-semibold"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}>
                {t}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plugins.map((p, i) => <PluginCard key={p.name} plugin={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   EMBED / WIDGET SECTION
═══════════════════════════════════════════════ */
function EmbedSection() {
  const [copied, setCopied] = useState(false);
  const snippet = `<script
  src="https://cdn.neuralchat.io/widget.js"
  data-bot-id="bot_AbC123xYz"
  data-api-key="nc_live_••••••••"
  data-theme="dark"
  data-position="bottom-right"
></script>`;

  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />
      <motion.div
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.22 250 / 8%) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Reveal><SectionTag><Globe size={11} /> Embeddable Widget</SectionTag></Reveal>
            <Reveal delay={1}>
              <h2 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight">
                Ship to any site<br /><span className="shimmer-text">in 60 seconds</span>
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Generate a site-scoped API key, paste one script tag, and your AI chat widget
                goes live instantly. SSE streaming, custom theme, dark/light mode — all configurable.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <ul className="mt-6 space-y-3">
                {[
                  "SSE streaming via /api/bots/:botId/stream",
                  "POST fallback for non-SSE environments",
                  "Per-domain API key scoping",
                  "White-label with custom colors and logo",
                  "Floating bubble → full panel with 3D tilt animation",
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle size={15} className="text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={2}>
            <div className="space-y-4">
              {/* Code snippet */}
              <div className="rounded-2xl border border-border overflow-hidden shadow-xl"
                style={{ boxShadow: "0 20px 60px oklch(0.55 0.22 250 / 12%)" }}>
                <div className="flex items-center justify-between px-4 py-3 bg-muted/80 border-b border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Terminal size={12} /> HTML snippet
                  </div>
                  <button onClick={copy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {copied ? <CheckCircle size={12} className="text-green-400" /> : <Copy size={12} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono overflow-x-auto"
                  style={{ background: "oklch(0.08 0.005 240)", color: "oklch(0.75 0.15 250)" }}>
                  <code>{snippet}</code>
                </pre>
              </div>

              {/* Widget bubble preview */}
              <div className="rounded-2xl border border-border p-5 bg-card/50 relative overflow-hidden min-h-[200px]">
                <div className="text-xs text-muted-foreground mb-4 font-medium">Widget Preview</div>
                <div className="relative h-36 bg-muted/30 rounded-xl border border-border/50 overflow-hidden">
                  <div className="absolute inset-0 grid-bg opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                    Your website content here…
                  </div>
                  {/* Floating bubble */}
                  <motion.div
                    className="absolute bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                    style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <MessageSquare size={20} className="text-white" />
                  </motion.div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 py-2 rounded-xl text-xs border border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors flex items-center justify-center gap-1.5">
                    <Download size={11} /> Download widget.js
                  </button>
                  <button className="flex-1 py-2 rounded-xl text-xs border border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors flex items-center justify-center gap-1.5">
                    <ExternalLink size={11} /> View docs
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   AUTH SECTION
═══════════════════════════════════════════════ */
function AuthSection({ onNav }: { onNav: (s: string) => void }) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("signup");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); setTimeout(() => { setSuccess(false); onNav("dashboard"); }, 1200); }, 1500);
  };

  return (
    <section className="py-24 px-6 relative">
      <div className="dot-bg absolute inset-0 opacity-20 pointer-events-none" />
      <div className="max-w-md mx-auto">
        <Reveal>
          <div className="rounded-3xl border border-border overflow-hidden"
            style={{ boxShadow: "0 30px 80px oklch(0.55 0.22 250 / 15%)", background: "oklch(0.11 0.008 240)" }}>
            <div className="p-8">
              {/* Logo */}
              <div className="flex justify-center mb-7">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}>
                  <BrainCircuit size={22} className="text-white" />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-muted/50 rounded-xl mb-6">
                {(["signup", "login"] as const).map(m => (
                  <button key={m}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setMode(m)}>
                    {m === "signup" ? "Sign Up" : "Log In"}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.form
                  key={mode}
                  initial={{ opacity: 0, x: mode === "signup" ? -16 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === "signup" ? 16 : -16 }}
                  transition={{ duration: 0.3, ease: expo }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {mode === "signup" && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">Full Name</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input className="w-full bg-muted/50 border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all" placeholder="Alex Johnson" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">Email</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="email" className="w-full bg-muted/50 border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all" placeholder="you@company.com" />
                    </div>
                  </div>

                  {mode !== "forgot" && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Password</label>
                        {mode === "login" && (
                          <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary hover:underline">Forgot?</button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type={showPass ? "text" : "password"} className="w-full bg-muted/50 border border-border rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all" placeholder="••••••••" />
                        <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                          {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    className="w-full py-3 rounded-xl font-semibold text-sm text-primary-foreground relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.01 }}
                    disabled={loading || success}
                  >
                    <AnimatePresence mode="wait">
                      {success ? (
                        <motion.span key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-2">
                          <CheckCircle size={15} /> Done!
                        </motion.span>
                      ) : loading ? (
                        <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2">
                          <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                          Processing…
                        </motion.span>
                      ) : (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          {mode === "signup" ? "Create Account" : mode === "login" ? "Log In" : "Send Reset Link"}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <div className="relative flex items-center gap-3 my-1">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">or</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <button type="button" className="w-full py-2.5 rounded-xl text-sm border border-border bg-muted/30 hover:bg-accent/60 transition-colors flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continue with Google
                  </button>
                </motion.form>
              </AnimatePresence>

              <p className="text-xs text-center text-muted-foreground mt-5">
                By continuing you agree to our{" "}
                <span className="text-primary hover:underline cursor-pointer">Terms</span>{" "}
                and{" "}
                <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   EXTENSIONS SECTION
═══════════════════════════════════════════════ */
function ExtensionsSection() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <Reveal><SectionTag><Cpu size={11} /> Extensions & SDK</SectionTag></Reveal>
          <Reveal delay={1}><h2 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight">
            Integrate anywhere<br /><span className="shimmer-text">in any stack</span>
          </h2></Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Globe, title: "Browser Extension", badge: "Chrome / Firefox",
              desc: "Highlight any text on the web and ask your AI — right in context. One-click install from Chrome Web Store.",
              color: "oklch(0.55 0.22 250)",
              snippet: 'chrome.runtime.sendMessage({ type: "ASK_AI", text: selectedText });'
            },
            {
              icon: Terminal, title: "Node.js SDK", badge: "npm install neuralchat",
              desc: "Full TypeScript SDK. Streaming responses, function calling, file uploads. Works in Edge Runtime too.",
              color: "oklch(0.65 0.18 160)",
              snippet: "const chat = new NeuralChat({ apiKey });\nfor await (const tok of chat.stream(prompt)) {\n  process.stdout.write(tok);\n}"
            },
            {
              icon: Wifi, title: "REST & SSE API", badge: "OpenAPI 3.1",
              desc: "Stream tokens via SSE. Full OpenAPI spec, Postman collection, and interactive docs at /api/docs.",
              color: "oklch(0.7 0.17 210)",
              snippet: "GET /api/bots/:botId/stream?apiKey=…\nevent: token\ndata: {\"text\":\"Hello\"}"
            },
            {
              icon: Package, title: "React Components", badge: "@neuralchat/react",
              desc: "Drop-in <ChatWidget />, <MessageBubble />, <BotSelector />, and more. Fully themeable with CSS variables.",
              color: "oklch(0.65 0.2 320)",
              snippet: "import { ChatWidget } from '@neuralchat/react';\n<ChatWidget botId=\"bot_abc\" theme=\"dark\" />"
            },
            {
              icon: Hash, title: "Webhooks", badge: "Real-time events",
              desc: "Subscribe to conversation.created, message.sent, skill.activated events and pipe into your data pipeline.",
              color: "oklch(0.68 0.18 50)",
              snippet: "POST https://your.site/webhook\n{\n  \"event\": \"message.sent\",\n  \"data\": { ... }\n}"
            },
            {
              icon: FileText, title: "Export & Backup", badge: "JSON / CSV / JSONL",
              desc: "Export full conversation history for fine-tuning, audit, or archiving. Scheduled exports to S3 or GCS.",
              color: "oklch(0.6 0.2 280)",
              snippet: "GET /api/export?format=jsonl\n&from=2026-01-01&to=2026-12-31"
            },
          ].map((ext, i) => (
            <Reveal key={ext.title} delay={i * 0.4}>
              <motion.div
                className="group p-5 rounded-2xl border border-border overflow-hidden"
                style={{ background: "oklch(0.11 0.008 240)" }}
                whileHover={{ y: -3, transition: { duration: 0.25, ease: snappy } }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(circle at 20% 20%, ${ext.color}12, transparent 60%)` }}
                />
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${ext.color}18`, border: `1px solid ${ext.color}35` }}>
                    <ext.icon size={18} style={{ color: ext.color }} />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{ext.title}</div>
                    <div className="text-xs text-muted-foreground">{ext.badge}</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{ext.desc}</p>
                <div className="rounded-lg overflow-hidden border border-border/50">
                  <pre className="p-2.5 text-xs font-mono overflow-x-auto"
                    style={{ background: "oklch(0.08 0.005 240)", color: "oklch(0.7 0.17 210)" }}>
                    <code>{ext.snippet}</code>
                  </pre>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CTA SECTION
═══════════════════════════════════════════════ */
function CTASection({ onNav }: { onNav: (s: string) => void }) {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.55 0.22 250 / 12%), transparent 70%)" }}
      />
      <div className="grid-bg absolute inset-0 opacity-20 pointer-events-none" />
      <Reveal>
        <div className="max-w-3xl mx-auto text-center">
          <SectionTag><Sparkles size={11} /> Start for free</SectionTag>
          <h2 className="mt-8 text-5xl sm:text-6xl font-black tracking-tight">
            Your AI platform<br />
            <span className="shimmer-text">awaits</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Join 12,000+ teams who shipped their AI chatbot with NeuralChat.
            Free tier, no credit card required — deploy your first bot in under 5 minutes.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNav("auth")}
              className="group px-10 py-4 rounded-xl font-bold text-base text-primary-foreground relative overflow-hidden glow-brand transition-all hover:scale-[1.03]"
              style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}
            >
              <span className="flex items-center gap-2">
                Get Started Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              onClick={() => onNav("dashboard")}
              className="px-10 py-4 rounded-xl font-bold text-base border border-border hover:bg-accent/60 transition-all hover:scale-[1.02] flex items-center gap-2"
            >
              <Play size={15} className="text-primary" /> Live Demo
            </button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
            {["Free 14-day trial", "No credit card", "Cancel anytime", "SOC 2 Type II"].map(item => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-primary" /> {item}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════ */
function Navbar({ activeSection, onNav }: { activeSection: string; onNav: (s: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { id: "features", label: "Features" },
    { id: "dashboard", label: "Dashboard" },
    { id: "marketplace", label: "Marketplace" },
    { id: "embed", label: "Widget" },
    { id: "extensions", label: "Extensions" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-border" : ""
      }`}
      style={{
        background: scrolled ? "oklch(0.08 0.005 240 / 90%)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
      }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: expo }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => onNav("home")} className="flex items-center gap-2.5 font-bold text-lg">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}>
            <BrainCircuit size={16} className="text-white" />
          </div>
          NeuralChat
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => onNav(link.id)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === link.id ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => onNav("auth")} className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 flex items-center gap-1.5">
            <LogIn size={14} /> Log in
          </button>
          <button onClick={() => onNav("auth")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}>
            Get started
          </button>
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-accent/60 transition-colors" onClick={() => setMobileOpen(v => !v)}>
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: expo }}
            className="overflow-hidden border-t border-border md:hidden"
            style={{ background: "oklch(0.09 0.006 240 / 95%)", backdropFilter: "blur(20px)" }}
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map(link => (
                <button key={link.id}
                  onClick={() => { onNav(link.id); setMobileOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors">
                  {link.label}
                </button>
              ))}
              <div className="pt-2 border-t border-border flex gap-2">
                <button onClick={() => { onNav("auth"); setMobileOpen(false); }}
                  className="flex-1 py-2.5 rounded-xl text-sm border border-border text-center hover:bg-accent/60 transition-colors">
                  Log in
                </button>
                <button onClick={() => { onNav("auth"); setMobileOpen(false); }}
                  className="flex-1 py-2.5 rounded-xl text-sm text-primary-foreground font-semibold text-center"
                  style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}>
                  Get started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════ */
function Footer({ onNav }: { onNav: (s: string) => void }) {
  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <button onClick={() => onNav("home")} className="flex items-center gap-2.5 font-bold text-lg mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}>
                <BrainCircuit size={16} className="text-white" />
              </div>
              NeuralChat
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The all-in-one platform for building, deploying, and scaling intelligent AI chat experiences.
            </p>
            <div className="mt-4 flex gap-3">
              {["X", "GitHub", "Discord"].map(s => (
                <button key={s} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                  {s[0]}
                </button>
              ))}
            </div>
          </div>
          {[
            { title: "Product", links: ["Features", "Marketplace", "Widget", "Extensions", "Changelog"] },
            { title: "Docs", links: ["Getting Started", "API Reference", "SDK", "Webhooks", "OpenAPI"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Privacy", "Terms"] },
          ].map(col => (
            <div key={col.title}>
              <div className="text-sm font-semibold mb-4">{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© 2026 NeuralChat, Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              All systems operational
            </span>
            <span>SOC 2 · HIPAA · GDPR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE — scroll-based navigation
═══════════════════════════════════════════════ */
const sectionRefs: Record<string, React.RefObject<HTMLDivElement>> = {};

export default function Page() {
  const [activeSection, setActiveSection] = useState("home");
  const sectionsRef = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = sectionsRef.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeSection={activeSection} onNav={scrollTo} />

      {/* Home / Hero */}
      <div ref={el => { if (el) sectionsRef.current.home = el; }}>
        <HeroSection onNav={scrollTo} />
      </div>

      {/* Features */}
      <div ref={el => { if (el) sectionsRef.current.features = el; }}>
        <FeaturesSection />
      </div>

      {/* Dashboard */}
      <div ref={el => { if (el) sectionsRef.current.dashboard = el; }}>
        <DashboardPreview />
      </div>

      {/* Workspaces */}
      <div ref={el => { if (el) sectionsRef.current.workspaces = el; }}>
        <WorkspacesSection />
      </div>

      {/* Bot Editor */}
      <div ref={el => { if (el) sectionsRef.current.boteditor = el; }}>
        <BotEditorPreview />
      </div>

      {/* Marketplace */}
      <div ref={el => { if (el) sectionsRef.current.marketplace = el; }}>
        <MarketplaceSection />
      </div>

      {/* Embed */}
      <div ref={el => { if (el) sectionsRef.current.embed = el; }}>
        <EmbedSection />
      </div>

      {/* Extensions */}
      <div ref={el => { if (el) sectionsRef.current.extensions = el; }}>
        <ExtensionsSection />
      </div>

      {/* Auth */}
      <div ref={el => { if (el) sectionsRef.current.auth = el; }}>
        <AuthSection onNav={scrollTo} />
      </div>

      {/* CTA */}
      <CTASection onNav={scrollTo} />

      <Footer onNav={scrollTo} />

      {/* Floating chat widget demo */}
      <ChatWidgetBubble />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FLOATING CHAT WIDGET DEMO
═══════════════════════════════════════════════ */
const demoMessages = [
  { role: "assistant" as const, text: "Hi! I'm your NeuralChat assistant. How can I help you today? 👋" },
];

function ChatWidgetBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(demoMessages);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const streamRef = useRef<string[]>(["Great", " question!", " With NeuralChat", " you can build", " powerful AI", " chatbots", " in minutes.", " Try it now!"]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim() || streaming) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user" as const, text: userMsg }]);
    setStreaming(true);

    let accumulated = "";
    let idx = 0;
    const tokens = [...streamRef.current];

    const addToken = () => {
      if (idx >= tokens.length) {
        setStreaming(false);
        return;
      }
      accumulated += tokens[idx++];
      setMessages(m => {
        const copy = [...m];
        const last = copy[copy.length - 1];
        if (last.role === "assistant" && (last as any).streaming) {
          copy[copy.length - 1] = { ...last, text: accumulated };
        } else {
          copy.push({ role: "assistant" as const, text: accumulated, streaming: true } as any);
        }
        return copy;
      });
      setTimeout(addToken, 80);
    };
    setTimeout(addToken, 400);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.35, ease: expo }}
            className="fixed bottom-24 right-5 w-80 sm:w-[360px] rounded-2xl border border-border overflow-hidden z-40 flex flex-col shadow-2xl"
            style={{
              background: "oklch(0.11 0.008 240)",
              boxShadow: "0 24px 60px oklch(0.55 0.22 250 / 25%), 0 0 0 1px oklch(1 0 0 / 6%)",
              height: 440
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border"
              style={{ background: "linear-gradient(135deg, oklch(0.55 0.22 250 / 20%), oklch(0.7 0.17 210 / 10%))" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}>
                  <BrainCircuit size={14} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">NeuralChat</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" /> Online
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-accent/60 transition-colors">
                <X size={14} className="text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((m, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: expo }}
                  className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}>
                      <Bot size={10} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    m.role === "user"
                      ? "rounded-tr-sm text-primary-foreground"
                      : "bg-card border border-border rounded-tl-sm"
                  }`}
                    style={m.role === "user" ? { background: "linear-gradient(135deg, oklch(0.55 0.22 250), oklch(0.48 0.22 260))" } : {}}
                  >
                    {m.text}
                    {(m as any).streaming && streaming && (
                      <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-primary/60 animate-pulse align-text-bottom" />
                    )}
                  </div>
                </motion.div>
              ))}
              {streaming && messages[messages.length - 1]?.role !== "assistant" && <StreamingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2 bg-muted/40 rounded-xl border border-border px-3 py-2">
                <input
                  className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
                  placeholder="Ask anything…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-primary-foreground flex-shrink-0 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}
                  disabled={!input.trim() || streaming}
                >
                  <Send size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl z-50"
        style={{ background: "linear-gradient(135deg, oklch(0.6 0.22 250), oklch(0.5 0.22 260))" }}
        whileHover={{ scale: 1.08, rotateY: 8 }}
        whileTap={{ scale: 0.93 }}
        animate={!open ? { y: [0, -4, 0] } : {}}
        transition={!open ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : { type: "spring", stiffness: 400, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageSquare size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
