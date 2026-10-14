import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import AdminBackground from '../ui/AdminBackground';
import {
  FaTachometerAlt, FaFolder, FaEnvelope, FaTools, FaBriefcase,
  FaSignOutAlt, FaMoon, FaSun, FaBars, FaTimes,
} from 'react-icons/fa';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { to: '/admin/projects', label: 'Projects', icon: FaFolder },
  { to: '/admin/messages', label: 'Messages', icon: FaEnvelope },
  { to: '/admin/skills', label: 'Skills', icon: FaTools },
  { to: '/admin/experiences', label: 'Experiences', icon: FaBriefcase },
];

export default function AdminLayout() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState<boolean>(() => localStorage.getItem('adminTheme') === 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 relative">
      <AdminBackground />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo/Brand */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30"
              >
                <span className="text-white font-bold text-sm">D</span>
              </motion.div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-white">Admin Panel</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[130px]">{email}</div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1">
          {navItems.map((item, idx) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`text-sm transition-transform ${isActive ? '' : 'group-hover:scale-110'}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition group"
          >
            <FaSignOutAlt className="group-hover:translate-x-0.5 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-700 dark:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <FaBars />
            </button>

            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Portfolio Admin
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDark(!dark)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition relative"
              title="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={dark ? 'sun' : 'moon'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {dark ? (
                    <FaSun className="text-yellow-400" />
                  ) : (
                    <FaMoon className="text-slate-600" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </header>

        <main className="p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
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
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
