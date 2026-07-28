import { useState } from "react";
import { Navigate, useLocation, NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, ArrowLeftRight, Tag, Wallet, Settings, User } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import ParticleBackground from "../components/ParticleBackground";
import FeedbackModal from "../components/FeedbackModal";

const DashboardLayout = ({ children }) => {
  const { user } = useApp();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Auth Guard
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  // Determine current page title
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/transactions":
        return "Transaksi";
      case "/categories":
        return "Kategori";
      case "/budgets":
        return "Budget";
      case "/goals":
        return "Goals";
      case "/settings":
        return "Pengaturan";
      case "/profile":
        return "Profil";
      default:
        return "FinTrack";
    }
  };

  // Mobile Bottom Navigation items
  const mobileNavItems = [
    { name: "Home", path: "/dashboard", icon: LayoutDashboard },
    { name: "Transaksi", path: "/transactions", icon: ArrowLeftRight },
    { name: "Kategori", path: "/categories", icon: Tag },
    { name: "Budget", path: "/budgets", icon: Wallet },
    { name: "Profil", path: "/profile", icon: User },
    { name: "Lainnya", path: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-text flex flex-col md:flex-row relative">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Toast notifications */}
      <Toast />

      {/* Feedback Modal */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      {/* ----------------- DESKTOP SIDEBAR ----------------- */}
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} onOpenFeedback={() => setFeedbackOpen(true)} />
      </div>

      {/* ----------------- MAIN PANEL ----------------- */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 pb-20 md:pb-0
          ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}
        `}
      >
        {/* Desktop Top Navbar */}
        <Navbar title={getPageTitle()} />

        {/* Dynamic Page content */}
        <main className="p-4 md:p-6 flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ----------------- MOBILE BOTTOM NAVIGATION BAR ----------------- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border flex justify-around items-center z-40 px-1 shadow-lg safe-area-bottom">
        {mobileNavItems.map((item) => {
          const shortName = item.name === "Pengaturan" ? "Setting" : item.name;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 gap-0.5 active:scale-90
                ${isActive ? "text-primary" : "text-text-secondary hover:text-text"}
              `}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[9px] sm:text-[10px] font-semibold leading-tight truncate max-w-[56px]">{shortName}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardLayout;
