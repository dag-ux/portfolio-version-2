import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUnreadCount, getAdminProjects } from '../../services/adminApi';
import { FaFolder, FaEnvelope, FaPlus } from 'react-icons/fa';

export default function Dashboard() {
  const { email } = useAuth();
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);

  useEffect(() => {
    getAdminProjects()
      .then((data) => setProjectCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setProjectCount(0));

    getUnreadCount()
      .then((d) => setUnreadCount(d.count))
      .catch(() => setUnreadCount(0));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, {email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Projects" value={projectCount} icon={<FaFolder />} color="bg-blue-500" link="/admin/projects" />
        <StatCard label="Unread Messages" value={unreadCount} icon={<FaEnvelope />} color="bg-red-500" link="/admin/messages" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition"
          >
            <FaPlus /> Manage Projects
          </Link>
          <Link
            to="/admin/messages"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <FaEnvelope /> View Messages
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, link }: {
  label: string; value: number | null; icon: React.ReactNode; color: string; link: string;
}) {
  return (
    <Link
      to={link}
      className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white">
        {value === null ? '—' : value}
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </Link>
  );
}