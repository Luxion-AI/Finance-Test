import { useApp } from '../context/AppContext';
import { getAvatarUrl } from '../utils/api';
import { Menu, Sun, Moon } from 'lucide-react';

const Navbar = ({ title, onMenuToggle }) => {
  const { user, theme, toggleTheme } = useApp();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
      {/* Title & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          aria-label="Buka menu navigasi"
          className="p-1.5 hover:bg-surface-hover rounded-lg text-text-secondary hover:text-text md:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-text leading-none">{title}</h1>
      </div>

      {/* User Section (Right) */}
      <div className="flex items-center gap-2">
        {/* Theme toggle - simple box */}
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Mode terang" : "Mode gelap"}
          className="p-2 rounded-lg border border-border hover:bg-surface-hover text-text-secondary hover:text-text transition-all active:scale-90"
        >
          {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {user && (
            <>
              <span className="text-text-secondary text-sm font-medium hidden sm:inline">
                {user.name}
              </span>
              {user.avatar ? (
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover shadow-sm ring-2 ring-primary/20"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-xs shadow-sm ring-2 ring-primary/20">
                  {getInitials(user.name)}
                </div>
              )}
            </>
          )}
      </div>
    </header>
  );
};

export default Navbar;
