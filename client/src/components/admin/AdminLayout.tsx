import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import AdminBackground from '../ui/AdminBackground';
import {
  FaTachometerAlt, FaFolder, FaEnvelope, FaTools, FaBriefcase,
  FaSignOutAlt, FaMoon, FaSun, FaBars, FaTimes, FaHome,
  FaChevronRight, FaExternalLinkAlt, FaBell, FaUser, FaChevronDown,
  FaShieldAlt,
} from 'react-icons/fa';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt, group: 'main' },
  { to: '/admin/projects', label: 'Projects', icon: FaFolder, group: 'main' },
  { to: '/admin/messages', label: 'Messages', icon: FaEnvelope, group: 'main' },
  { to: '/admin/skills', label: 'Skills', icon: FaTools, group: 'content' },
  { to: '/admin/experiences', label: 'Experiences', icon: FaBriefcase, group: 'content' },
];

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/projects': 'Projects',
  '/admin/messages': 'Messages',
  '/admin/skills': 'Skills',
  '/admin/experiences': 'Experiences',
};

export default function AdminLayout() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState<boolean>(() => localStorage.getItem('adminTheme') === 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('adminTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('adminTheme', 'light');
    }
  }, [dark]);

  useEffect(() => {
    setSidebarOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [userMenuOpen]);

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate('/admin/login');
  };

  const currentTitle = pageTitles[location.pathname] || 'Admin';
  const initials = (email || 'A')[0].toUpperCase();
  const username = email?.split('@')[0] || 'Admin';

  const mainItems = navItems.filter((item) => item.group === 'main');
  const contentItems = navItems.filter((item) => item.group === 'content');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 relative">
      <AdminBackground />

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 z-40 transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 flex-shrink-0"
              >
                <span className="text-white font-bold text-sm">D</span>
              </motion.div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-white">Admin Panel</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Portfolio Manager</div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 pt-2 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Main
            </span>
          </div>
          {mainItems.map((item, idx) => (
            <NavItem key={item.to} item={item} idx={idx} />
          ))}

          <div className="px-3 pt-4 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Content
            </span>
          </div>
          {contentItems.map((item, idx) => (
            <NavItem key={item.to} item={item} idx={idx + 3} />
          ))}

          <div className="px-3 pt-4 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Shortcut
            </span>
          </div>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition group"
          >
            <FaHome className="text-sm group-hover:scale-110 transition-transform" />
            <span className="flex-1">View Site</span>
            <FaExternalLinkAlt className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </nav>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 px-3 py-2 text-[10px] text-slate-400 dark:text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>System online</span>
            <span className="ml-auto">v1.0</span>
          </div>
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            {/* Left: hamburger + breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-700 dark:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                aria-label="Open sidebar"
              >
                <FaBars className="text-sm" />
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  Admin
                </span>
                <FaChevronRight className="text-[8px]" />
                <span className="text-slate-900 dark:text-white font-medium">
                  {currentTitle}
                </span>
              </div>

              <div className="sm:hidden text-sm font-semibold text-slate-900 dark:text-white truncate">
                {currentTitle}
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-1">
              {/* Notification bell */}
              <button
                className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                title="Notifications"
              >
                <FaBell className="text-slate-600 dark:text-slate-300 text-sm" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              </button>

              {/* Theme toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDark(!dark)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={dark ? 'sun' : 'moon'}
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {dark ? (
                      <FaSun className="text-yellow-400 text-sm" />
                    ) : (
                      <FaMoon className="text-slate-600 text-sm" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* Divider */}
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pr-2 sm:pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition group"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-red-500/30 flex-shrink-0">
                    {initials}
                  </div>
                  <div className="hidden sm:flex flex-col items-start min-w-0 max-w-[100px]">
                    <span className="text-[11px] font-semibold text-slate-900 dark:text-white truncate capitalize">
                      {username}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400">
                      Administrator
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: userMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="hidden sm:block"
                  >
                    <FaChevronDown className="text-slate-400 text-[10px]" />
                  </motion.div>
                </motion.button>

                {/* Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden z-50"
                    >
                      {/* Header */}
                      <div className="p-4 bg-gradient-to-br from-red-500/5 to-transparent border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-red-500/30 flex-shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white truncate capitalize">
                              {username}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {email || 'admin@portfolio'}
                            </div>
                          </div>
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-2">
                        <Link
                          to="/"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition group"
                        >
                          <FaHome className="text-xs text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                          <span className="flex-1">View Portfolio</span>
                          <FaExternalLinkAlt className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>

                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition group"
                        >
                          <FaShieldAlt className="text-xs text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                          <span className="flex-1">Admin Dashboard</span>
                        </Link>

                        <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition group"
                        >
                          <FaSignOutAlt className="text-xs group-hover:translate-x-0.5 transition-transform" />
                          <span className="flex-1 text-left">Sign Out</span>
                        </button>
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-green-500" />
                            Signed in
                          </span>
                          <span>Admin v1.0</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== NAV ITEM ====================
function NavItem({ item, idx }: { item: typeof navItems[0]; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.04, duration: 0.3 }}
    >
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group overflow-hidden ${
            isActive
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-500/30'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.span
                layoutId="navDot"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full bg-white/80"
              />
            )}
            <item.icon
              className={`text-sm flex-shrink-0 transition-transform ${
                isActive ? '' : 'group-hover:scale-110'
              }`}
            />
            <span className="flex-1">{item.label}</span>
            {isActive && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-1.5 h-1.5 rounded-full bg-white/90"
              />
            )}
          </>
        )}
      </NavLink>
    </motion.div>
  );
}