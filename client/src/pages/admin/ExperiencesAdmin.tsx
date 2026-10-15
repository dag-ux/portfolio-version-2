import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdminExperiences, createExperience, updateExperience, deleteExperience } from '../../services/adminApi';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';
import type { ToastType } from '../../components/admin/Toast';
import ExperienceFormModal from '../../components/admin/ExperienceFormModal';
import type { ExperienceFormData } from '../../components/admin/ExperienceFormModal';
import {
  FaPlus, FaEdit, FaTrash, FaSpinner, FaBriefcase,
  FaMapMarkerAlt, FaCalendarAlt, FaSearch, FaBuilding,
  FaCheckCircle, FaTimesCircle,
} from 'react-icons/fa';

interface Experience extends ExperienceFormData {
  _id: string;
  createdAt?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export default function ExperiencesAdmin() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminExperiences();
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (data: ExperienceFormData) => {
    if (editing) {
      const updated = await updateExperience(editing._id, data);
      setItems((prev) => prev.map((i) => (i._id === editing._id ? { ...i, ...updated } : i)));
      setToast({ message: 'Experience updated successfully', type: 'success' });
    } else {
      const created = await createExperience(data);
      setItems((prev) => [created, ...prev]);
      setToast({ message: 'Experience created successfully', type: 'success' });
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteExperience(deleteTarget._id);
      setItems((prev) => prev.filter((i) => i._id !== deleteTarget._id));
      setDeleteTarget(null);
      setToast({ message: 'Experience deleted successfully', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.response?.data?.error || 'Failed to delete', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (e) =>
        e.position.toLowerCase().includes(q) ||
        e.company.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q) ||
        e.techStack?.some((t) => t.toLowerCase().includes(q))
    );
  }, [items, search]);

  const currentCount = items.filter((i) => i.current).length;
  const pastCount = items.length - currentCount;

  const fmt = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })
      : '';

  const getDuration = (start: string, end: string | undefined, current: boolean) => {
    if (!start) return '';
    const startDate = new Date(start);
    const endDate = current ? new Date() : end ? new Date(end) : new Date();
    const months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());
    if (months < 1) return 'Less than a month';
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
    const years = Math.floor(months / 12);
    const remainder = months % 12;
    if (remainder === 0) return `${years} year${years !== 1 ? 's' : ''}`;
    return `${years}y ${remainder}m`;
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* ===== HEADER ===== */}
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Experiences
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {items.length} total
            {currentCount > 0 && (
              <>
                <span className="mx-1.5">•</span>
                <span className="text-green-500 font-medium">{currentCount} current</span>
              </>
            )}
            {pastCount > 0 && (
              <>
                <span className="mx-1.5">•</span>
                <span>{pastCount} past</span>
              </>
            )}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
        >
          <FaPlus className="text-xs" />
          Add Experience
        </motion.button>
      </motion.div>

      {/* ===== SEARCH ===== */}
      {!loading && !error && items.length > 0 && (
        <motion.div variants={item} className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by position, company, location, or tech..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
          />
        </motion.div>
      )}

      {/* ===== CONTENT ===== */}
      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <motion.div
          variants={item}
          className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 rounded-2xl p-4 text-sm flex items-center justify-between"
        >
          <span>{error}</span>
          <button
            onClick={load}
            className="font-medium underline hover:no-underline"
          >
            Retry
          </button>
        </motion.div>
      ) : items.length === 0 ? (
        <EmptyState
          onAdd={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        />
      ) : filtered.length === 0 ? (
        <motion.div
          variants={item}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center"
        >
          <FaSearch className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            No matching experiences
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Try a different search term
          </p>
          <button
            onClick={() => setSearch('')}
            className="text-sm font-medium text-red-500 hover:text-red-600"
          >
            Clear search
          </button>
        </motion.div>
      ) : (
        <TimelineList
          items={filtered}
          onEdit={(exp) => {
            setEditing(exp);
            setFormOpen(true);
          }}
          onDelete={setDeleteTarget}
          fmt={fmt}
          getDuration={getDuration}
        />
      )}

      {/* Modals */}
      <ExperienceFormModal
        isOpen={formOpen}
        experience={editing}
        onSave={handleSave}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete this experience?"
        message={
          deleteTarget
            ? `You're about to delete "${deleteTarget.position} at ${deleteTarget.company}". This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Keep it"
        loading={deleting}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </motion.div>
  );
}

// ==================== TIMELINE LIST ====================
function TimelineList({
  items,
  onEdit,
  onDelete,
  fmt,
  getDuration,
}: {
  items: Experience[];
  onEdit: (exp: Experience) => void;
  onDelete: (exp: Experience) => void;
  fmt: (d?: string) => string;
  getDuration: (start: string, end: string | undefined, current: boolean) => string;
}) {
  return (
    <motion.div variants={item} className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500/40 via-slate-200 dark:via-slate-700 to-transparent" />

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {items.map((exp, idx) => (
            <motion.div
              key={exp._id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
              className="relative pl-12 sm:pl-16"
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-0 sm:left-1 top-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center z-10 ${
                  exp.current
                    ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/40'
                    : 'bg-white dark:bg-slate-800 border-red-500/50'
                }`}
              >
                <FaBriefcase
                  className={`text-xs ${exp.current ? 'text-white' : 'text-red-500'}`}
                />
              </div>

              {/* Card */}
              <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    {/* Position + current badge */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {exp.position}
                      </h3>
                      {exp.current ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-green-500 text-white rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Current
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full">
                          Past
                        </span>
                      )}
                    </div>

                    {/* Company */}
                    <p className="text-sm sm:text-base text-red-500 font-semibold mb-2 flex items-center gap-2">
                      <FaBuilding className="text-xs opacity-70" />
                      {exp.company}
                    </p>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <FaCalendarAlt className="text-[10px]" />
                        {fmt(exp.startDate)} — {exp.current ? 'Present' : fmt(exp.endDate)}
                        {exp.startDate && (
                          <span className="text-slate-400 dark:text-slate-500">
                            · {getDuration(exp.startDate, exp.endDate, exp.current)}
                          </span>
                        )}
                      </span>
                      {exp.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-[10px]" />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-start">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onEdit(exp)}
                      className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-center transition"
                      title="Edit"
                    >
                      <FaEdit className="text-xs" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(exp)}
                      className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center transition"
                      title="Delete"
                    >
                      <FaTrash className="text-xs" />
                    </motion.button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2">
                  {exp.description}
                </p>

                {/* Tech stack */}
                {exp.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {exp.techStack.slice(0, 6).map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2.5 py-1 bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                    {exp.techStack.length > 6 && (
                      <span className="text-[11px] px-2.5 py-1 text-slate-500">
                        +{exp.techStack.length - 6}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ==================== SKELETON ====================
function SkeletonLoader() {
  return (
    <div className="relative">
      <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative pl-12 sm:pl-16">
            <div className="absolute left-0 sm:left-1 top-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse">
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3" />
              <div className="h-4 bg-slate-100 dark:bg-slate-700/60 rounded w-1/4 mb-4" />
              <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded mb-2" />
              <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== EMPTY STATE ====================
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      variants={item}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 sm:p-16 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
        <FaBriefcase className="text-2xl text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
        No experiences yet
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Add your first work experience to display on your portfolio.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition shadow-lg shadow-red-500/20"
      >
        <FaPlus className="text-xs" />
        Add Your First Experience
      </button>
    </motion.div>
  );
}