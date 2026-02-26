import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Home, LogIn, Image, Shield, Award, LogOut } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const { currentUser, logout, isAdmin } = useAuth();

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/gallery", label: "Gallery", icon: Image },
    ...(currentUser ? [{ to: "/dashboard", label: "Certificate", icon: Award }] : []),
    ...(!currentUser ? [{ to: "/login", label: "Login", icon: LogIn }] : []),
    ...(isAdmin ? [{ to: "/admin", label: "Admin", icon: Shield }] : []),
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center neon-glow">
            <span className="font-display text-primary text-sm font-bold">G</span>
          </div>
          <span className="font-display text-sm tracking-wider text-foreground hidden sm:inline">
            GIBC <span className="text-primary">V1</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2
                  ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <link.icon size={16} />
                <span className="hidden sm:inline">{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          {currentUser && (
            <button
              onClick={logout}
              className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
