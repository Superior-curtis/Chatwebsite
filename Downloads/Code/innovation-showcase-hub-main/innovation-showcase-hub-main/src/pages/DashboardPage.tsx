import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Download, Sparkles, PartyPopper, ArrowRight } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import confetti from "canvas-confetti";
import ParticleBackground from "@/components/ParticleBackground";

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const certRef = useRef<HTMLDivElement>(null);
  const [participantName, setParticipantName] = useState(currentUser?.name || "");
  const [showThankYou, setShowThankYou] = useState(false);
  const [generating, setGenerating] = useState(false);

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ["#00d4ff", "#7c3aed", "#f59e0b", "#ec4899"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const handleDownload = async () => {
    if (!certRef.current) return;
    setGenerating(true);

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });

      const pdf = new jsPDF("landscape", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`GIBC_V1_Certificate_${participantName.replace(/\s+/g, "_")}.pdf`);

      triggerConfetti();
      setTimeout(() => setShowThankYou(true), 1000);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen relative pt-24 pb-12 px-4">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Your <span className="text-primary neon-text">Certificate</span>
          </h1>
          <p className="text-muted-foreground">Customize and download your certificate of participation</p>
        </motion.div>

        {/* Name Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 mb-6 max-w-md mx-auto"
        >
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Your Name (as it appears on certificate)
          </label>
          <input
            type="text"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300 text-center font-display text-lg"
          />
        </motion.div>

        {/* Certificate Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div
            ref={certRef}
            className="relative w-full aspect-[297/210] rounded-2xl overflow-hidden mx-auto max-w-4xl"
            style={{
              background: "linear-gradient(135deg, hsl(222,47%,8%) 0%, hsl(240,40%,15%) 30%, hsl(260,50%,18%) 60%, hsl(220,50%,12%) 100%)",
            }}
          >
            {/* Border glow */}
            <div className="absolute inset-0 rounded-2xl border-2 border-primary/30" />
            <div className="absolute inset-2 rounded-xl border border-primary/10" />

            {/* Corner decorations */}
            {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-8 h-8 border-primary/50 ${i < 2 ? "border-t-2" : "border-b-2"} ${i % 2 === 0 ? "border-l-2" : "border-r-2"}`} />
            ))}

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 sm:p-16 text-center">
              <div className="font-display text-xs sm:text-sm tracking-[0.3em] uppercase text-primary/70 mb-2">
                Certificate of {currentUser.award ? "Achievement" : "Participation"}
              </div>

              <h2 className="font-display text-lg sm:text-2xl md:text-3xl text-foreground mb-1 tracking-wider">
                Global Innovation Build Challenge
              </h2>
              <div className="text-primary font-display text-sm sm:text-base mb-6 sm:mb-10">V1 — 2026</div>

              <div className="text-xs sm:text-sm text-muted-foreground mb-2">This certificate is presented to</div>

              <div className="relative mb-4 sm:mb-6">
                <div className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-primary neon-text sparkle px-8">
                  {participantName || "Your Name"}
                </div>
                <div className="absolute -inset-4 bg-primary/5 blur-xl rounded-full -z-10" />
              </div>

              <div className="text-xs sm:text-sm text-muted-foreground mb-1">for the project</div>
              <div className="font-semibold text-base sm:text-xl text-foreground mb-4 sm:mb-6">{currentUser.projectName}</div>

              {currentUser.award && (
                <div className="relative mb-4 sm:mb-6">
                  <div className="px-6 py-2 rounded-full bg-gold/10 border border-gold/30">
                    <span className="font-display text-sm sm:text-base text-gold neon-text-gold sparkle">
                      🏆 {currentUser.award}
                    </span>
                  </div>
                  <div className="absolute -inset-2 bg-gold/5 blur-lg rounded-full -z-10" />
                </div>
              )}

              <div className="flex items-center gap-8 mt-auto">
                <div className="text-center">
                  <div className="w-24 sm:w-32 border-t border-muted-foreground/30 mb-1" />
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Date</div>
                </div>
                <div className="text-center">
                  <div className="w-24 sm:w-32 border-t border-muted-foreground/30 mb-1" />
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Organizer</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Download Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            disabled={generating || !participantName.trim()}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-primary text-primary-foreground font-display text-sm tracking-wider uppercase font-semibold neon-glow hover:brightness-110 transition-all duration-300 disabled:opacity-50"
          >
            {generating ? (
              <>
                <Sparkles className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <Download size={20} />
                Download Certificate PDF
              </>
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Thank You Modal */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
            onClick={() => setShowThankYou(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="glass-strong p-10 max-w-lg text-center neon-glow-purple"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <PartyPopper className="mx-auto text-gold mb-4" size={48} />
              </motion.div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                🎉 Thank You! 🎉
              </h2>
              <p className="text-muted-foreground mb-6">
                Thank you for participating in the <span className="text-primary">Global Innovation Build Challenge</span>!
                Your innovation makes the world a better place.
              </p>
              <div className="glass p-4 mb-6 neon-glow">
                <p className="text-sm text-foreground mb-2">
                  Want to claim your <span className="text-gold font-bold">V2 certificate and prize</span>?
                </p>
                <p className="text-xs text-muted-foreground">
                  Stay tuned for the Global Innovation Build Challenge V2!
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowThankYou(false)}
                  className="px-6 py-2 rounded-lg glass text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Close
                </button>
                <button className="px-6 py-2 rounded-lg bg-gold text-gold-foreground font-display text-xs tracking-wider uppercase font-semibold neon-glow-gold hover:brightness-110 transition-all inline-flex items-center gap-2">
                  Register for V2 <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
