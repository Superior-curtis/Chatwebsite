import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockProjects } from "@/data/mockData";
import { Trophy, X, ExternalLink, Tag } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

const categories = ["All", "Winners", "AI", "Innovation", "Web3", "Health", "Education", "Sustainability"];

const GalleryPage = () => {
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<typeof mockProjects[0] | null>(null);

  const filtered = mockProjects.filter((p) => {
    if (filter === "All") return true;
    if (filter === "Winners") return !!p.award;
    return p.category === filter;
  });

  return (
    <div className="min-h-screen relative pt-24 pb-12 px-4">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Project <span className="text-primary neon-text">Gallery</span>
          </h1>
          <p className="text-muted-foreground">Explore the innovative projects from GIBC V1 2026</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-display tracking-wider uppercase transition-all duration-300 ${
                filter === cat
                  ? "bg-primary text-primary-foreground neon-glow"
                  : "glass text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Project Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setSelectedProject(project)}
                className="glass p-6 cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  {project.award && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <Trophy className="text-gold sparkle" size={14} />
                      <span className="text-gold text-xs font-display tracking-wider uppercase">{project.award}</span>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Tag size={12} />
                    <span>{project.category}</span>
                    <span className="text-border">•</span>
                    <span>by {project.team}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="glass-strong p-8 max-w-lg w-full neon-glow"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  {selectedProject.award && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Trophy className="text-gold sparkle" size={16} />
                      <span className="text-gold text-xs font-display tracking-wider uppercase">
                        {selectedProject.award}
                      </span>
                    </div>
                  )}
                  <h2 className="font-display text-xl font-bold text-foreground">{selectedProject.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-muted-foreground mb-4">{selectedProject.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">by {selectedProject.team}</span>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-display tracking-wider uppercase hover:bg-primary/20 transition-colors">
                  <ExternalLink size={14} /> View on Devpost
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
