import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  getUnreadCount,
  getAdminProjects,
  getSkills,
  getAdminExperiences,
  getMessages,
} from '../../services/adminApi';
import {
  FaFolder, FaEnvelope, FaTools, FaBriefcase,
  FaPlus, FaArrowRight, FaClock, FaUser,
  FaEye, FaStar,
} from 'react-icons/fa';

interface StatCardData {
  label: string;
  value: number | null;
  icon: React.ElementType;
  gradient: string;
  glow: string;
  link: string;
  sub?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function Dashboard() {
  const { email } = useAuth();
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [skillCount, setSkillCount] = useState<number | null>(null);
  const [experienceCount, setExperienceCount] = useState<number | null>(null);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    getAdminProjects()
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setProjectCount(arr.length);
        setFeaturedCount(arr.filter((p: any) => p.featured).length);
        setRecentProjects(arr.slice(0, 3));
      })
      .catch(() => setProjectCount(0));

    getUnreadCount()
      .then((d) => setUnreadCount(d.count))
      .catch(() => setUnreadCount(0));

    getSkills()
      .then((data) => setSkillCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setSkillCount(0));

    getAdminExperiences()
      .then((data) => setExperienceCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setExperienceCount(0));

    getMessages()
      .then((data) => {
        setRecentMessages(Array.isArray(data) ? data.slice(0, 3) : []);
      })
      .catch(() => setRecentMessages([]))
      .finally(() => setLoadingRecent(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const nameFromEmail = email?.split('@')[0] || 'there';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const stats: StatCardData[] = [
    {
      label: 'Total Projects',
      value: projectCount,
      icon: FaFolder,
      gradient: 'from-blue-500 to-blue-600',
      glow: 'shadow-blue-500/30',
      link: '/admin/projects',
      sub: featuredCount > 0 ? `${featuredCount} featured` : undefined,
    },
    {
      label: 'Unread Messages',
      value: unreadCount,
      icon: FaEnvelope,
      gradient: 'from-red-500 to-red-600',
      glow: 'shadow-red-500/30',
      link: '/admin/messages',
      sub: unreadCount && unreadCount > 0 ? 'Needs attention' : 'All caught up',
    },
    {
      label: 'Skills',
      value: skillCount,
      icon: FaTools,
      gradient: 'from-purple-500 to-purple-600',
      glow: 'shadow-purple-500/30',
      link: '/admin/skills',
    },
    {
      label: 'Experiences',
      value: experienceCount,
      icon: FaBriefcase,
      gradient: 'from-emerald-500 to-emerald-600',
      glow: 'shadow-emerald-500/30',
      link: '/admin/experiences',
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ===== HEADER ===== */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {greeting}, <span className="text-red-500 capitalize">{nameFromEmail}</span> 
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <FaClock className="text-xs" />
            {today}
          </p>
        </div>
        <Link
          to="/admin/projects"
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
        >
          <FaPlus className="text-xs" />
          New Project
        </Link>
      </motion.div>

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              to={stat.link}
              className="group block relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient glow on hover */}
              <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-300`} />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg ${stat.glow}`}>
                    <stat.icon className="text-base" />
                  </div>
                  <FaArrowRight className="text-slate-300 dark:text-slate-600 text-xs transition-transform group-hover:translate-x-1 group-hover:text-slate-500 dark:group-hover:text-slate-400" />
                </div>

                <div className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {stat.value === null ? (
                    <span className="inline-block w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                  {stat.label}
                </div>
                {stat.sub && (
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${stat.label === 'Unread Messages' && unreadCount ? 'bg-red-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`} />
                    {stat.sub}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <motion.div
          variants={item}
          className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Recent Messages
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Latest contact form submissions
              </p>
            </div>
            <Link
              to="/admin/messages"
              className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1 group"
            >
              View all
              <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {loadingRecent ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-lg bg-slate-100 dark:bg-slate-700/50 animate-pulse" />
              ))}
            </div>
          ) : recentMessages.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
                <FaEnvelope className="text-slate-400" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No messages yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentMessages.map((msg: any) => (
                <Link
                  key={msg._id}
                  to="/admin/messages"
                  className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.isRead
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                      : 'bg-red-100 dark:bg-red-500/20 text-red-500'
                  }`}>
                    {msg.isRead ? <FaEnvelope className="text-xs" /> : <FaEye className="text-xs" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-sm font-medium truncate ${
                        msg.isRead
                          ? 'text-slate-600 dark:text-slate-400'
                          : 'text-slate-900 dark:text-white'
                      }`}>
                        {msg.name}
                      </span>
                      {!msg.isRead && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-red-500 text-white rounded">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {msg.subject}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0 mt-1">
                    {new Date(msg.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions + Recent Projects */}
        <motion.div variants={item} className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <QuickAction
                to="/admin/projects"
                icon={FaFolder}
                label="Manage Projects"
                color="text-blue-500 bg-blue-500/10"
              />
              <QuickAction
                to="/admin/skills"
                icon={FaTools}
                label="Manage Skills"
                color="text-purple-500 bg-purple-500/10"
              />
              <QuickAction
                to="/admin/experiences"
                icon={FaBriefcase}
                label="Manage Experiences"
                color="text-emerald-500 bg-emerald-500/10"
              />
              <QuickAction
                to="/admin/messages"
                icon={FaEnvelope}
                label="View Messages"
                color="text-red-500 bg-red-500/10"
              />
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Recent Projects
              </h2>
              <Link
                to="/admin/projects"
                className="text-xs font-medium text-red-500 hover:text-red-600"
              >
                View all
              </Link>
            </div>
            {recentProjects.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                No projects yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project: any) => (
                  <Link
                    key={project._id}
                    to="/admin/projects"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 transition group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaFolder className="text-slate-400 text-xs" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                          {project.title}
                        </span>
                        {project.featured && (
                          <FaStar className="text-yellow-500 text-[10px] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                        {project.techStack?.slice(0, 3).join(', ')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ===== FOOTER ===== */}
      <motion.div variants={item} className="flex items-center justify-center gap-3 pt-4 text-xs text-slate-400 dark:text-slate-500">
        <FaUser className="text-[10px]" />
        <span>Signed in as <span className="text-slate-600 dark:text-slate-400 font-medium">{email}</span></span>
      </motion.div>
    </motion.div>
  );
}

// ==================== SUB COMPONENTS ====================
function QuickAction({
  to, icon: Icon, label, color,
}: {
  to: string; icon: React.ElementType; label: string; color: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="text-xs" />
      </div>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1">
        {label}
      </span>
      <FaArrowRight className="text-[10px] text-slate-300 dark:text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500 dark:group-hover:text-slate-400" />
    </Link>
  );
}