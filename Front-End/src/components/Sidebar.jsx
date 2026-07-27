import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getAvatarUrl } from "../utils/api";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tag,
  Wallet,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  MessageSquare,
  Target,
} from "lucide-react";
import Logo from "./Logo";

const Sidebar = ({ collapsed, onToggle, onOpenFeedback }) => {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Transaksi", path: "/transactions", icon: ArrowLeftRight },
    { name: "Kategori", path: "/categories", icon: Tag },
    { name: "Budget", path: "/budgets", icon: Wallet },
    { name: "Goals", path: "/goals", icon: Target },
    { name: "Masukan", path: null, icon: MessageSquare, onClick: onOpenFeedback },
    { name: "Profil", path: "/profile", icon: User },
    { name: "Pengaturan", path: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-40 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] transition-all duration-300 flex flex-col justify-between text-[var(--sidebar-text)]
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Top Section - Logo */}
      <div>
        <div className="h-16 flex items-center px-4 justify-between border-b border-[var(--sidebar-border)]">
          <div className="flex items-center gap-3 overflow-hidden">
            <Logo className="h-8 w-8 flex-shrink-0" />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-black text-lg text-[var(--sidebar-text-active)] whitespace-nowrap tracking-tight"
              >
                Fin<span className="text-primary">Track</span>
              </motion.span>
            )}
          </div>

          <button
            onClick={onToggle}
            aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
            className="p-1.5 hover:bg-[var(--sidebar-hover)] rounded-lg text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-active)] hidden md:block transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 flex flex-col gap-1.5">
          {menuItems.map((item) =>
            item.path ? (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group active:scale-95
                  ${
                    isActive
                      ? "bg-primary/20 text-[var(--sidebar-text-active)] font-semibold shadow-sm border-l-2 border-primary"
                      : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-active)]"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 group-hover:scale-105 transition-transform`} />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </NavLink>
            ) : (
              <button
                key={item.name}
                onClick={item.onClick}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group active:scale-95
                  text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text-active)]
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 group-hover:scale-105 transition-transform`} />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </button>
            )
          )}
        </nav>
      </div>

      {/* Bottom Section - User Profile */}
      <div className="p-4 border-t border-[var(--sidebar-border)] flex flex-col gap-2">
        {user && (
            <div
              className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
            >
              {user.avatar ? (
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover flex-shrink-0 shadow-sm"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm">
                  {getInitials(user.name)}
                </div>
              )}
            {!collapsed && (
              <div className="overflow-hidden flex-grow text-left">
                <p className="text-sm font-semibold text-[var(--sidebar-text-active)] truncate">
                  {user.name}
                </p>
                <p className="text-xs text-[var(--sidebar-text)] truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          aria-label="Keluar"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/10 hover:text-danger-hover transition-colors font-medium
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm"
            >
              Keluar
            </motion.span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
