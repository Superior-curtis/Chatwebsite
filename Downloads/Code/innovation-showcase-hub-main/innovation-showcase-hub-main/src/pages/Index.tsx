import { motion } from "framer-motion";
import { Trophy, Users, Globe, FolderOpen, Award } from "lucide-react";
import { stats, mockParticipants } from "@/data/mockData";
import ParticleBackground from "@/components/ParticleBackground";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const StatCard = ({ icon: Icon, label, value, delay }: { icon: any; label: string; value: number; delay: number }) => (
  <motion.div
    custom={delay}
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="glass p-6 text-center neon-glow"
  >
    <Icon className="mx-auto mb-3 text-primary" size={28} />
    <div className="font-display text-3xl font-bold text-foreground mb-1">{value}+</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </motion.div>
);

const WinnerCard = ({ name, project, award, i }: { name: string; project: string; award: string; i: number }) => (
  <motion.div
    custom={i}
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    whileHover={{ scale: 1.03 }}
    className="glass p-6 relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="text-gold sparkle" size={20} />
        <span className="text-gold font-display text-xs tracking-wider uppercase">{award}</span>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{project}</h3>
      <p className="text-sm text-muted-foreground">by {name}</p>
    </div>
  </motion.div>
);

const HomePage = () => {
  const winners = mockParticipants.filter((p) => p.award);

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />

      {/* Hero */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Global Innovation</span>
              <br />
              <span className="text-primary neon-text">Build Challenge</span>
              <br />
              <span className="text-secondary neon-text-purple">V1 (2026)</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Thank you for participating in the Global Innovation Build Challenge V1 (2026)!
            Your creativity and dedication inspire the future of technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              to="/login"
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-display text-sm tracking-wider uppercase font-semibold neon-glow hover:scale-105 transition-transform duration-300"
            >
              Claim Certificate
            </Link>
            <Link
              to="/gallery"
              className="px-8 py-3 rounded-xl glass border-primary/30 text-primary font-display text-sm tracking-wider uppercase font-semibold hover:bg-primary/10 transition-all duration-300"
            >
              View Gallery
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl text-center text-foreground mb-12"
          >
            The Numbers Speak <span className="text-primary neon-text">For Themselves</span>
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            <StatCard icon={Users} label="Participants" value={stats.totalParticipants} delay={0} />
            <StatCard icon={FolderOpen} label="Projects" value={stats.totalProjects} delay={1} />
            <StatCard icon={Trophy} label="Winners" value={stats.totalWinners} delay={2} />
            <StatCard icon={Globe} label="Countries" value={stats.totalCountries} delay={3} />
            <StatCard icon={Award} label="Certificates" value={stats.certificatesIssued} delay={4} />
          </div>
        </div>
      </section>

      {/* Featured Winners */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-3xl text-center text-foreground mb-12"
          >
            Featured <span className="text-gold neon-text-gold">Winners</span>
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {winners.slice(0, 6).map((w, i) => (
              <WinnerCard key={w.id} name={w.name} project={w.projectName} award={w.award!} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto max-w-2xl text-center glass p-12 neon-glow-purple"
        >
          <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-4">
            Ready to Claim Your <span className="text-primary neon-text">Certificate?</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Log in with your email and token to generate your personalized certificate.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 rounded-xl bg-primary text-primary-foreground font-display text-sm tracking-wider uppercase font-semibold neon-glow hover:scale-105 transition-transform duration-300"
          >
            Get Started
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Global Innovation Build Challenge. Built with ❤️ for innovators worldwide.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
