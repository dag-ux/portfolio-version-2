import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../services/adminApi';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';
import type { ToastType } from '../../components/admin/Toast';
import SkillFormModal from '../../components/admin/SkillFormModal';
import type { SkillFormData } from '../../components/admin/SkillFormModal';
import {
  FaPlus, FaEdit, FaTrash, FaSearch, FaCode,
  FaLaptopCode, FaServer, FaDatabase, FaCloud, FaMobileAlt, FaCubes,
} from 'react-icons/fa';

interface Skill extends SkillFormData { _id: string; }

type Filter = 'all' | 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'other';

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  frontend: { label: 'Frontend', icon: FaLaptopCode, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  backend: { label: 'Backend', icon: FaServer, color: 'text-green-500', bg: 'bg-green-500/10' },
  database: { label: 'Database', icon: FaDatabase, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  devops: { label: 'DevOps & Tools', icon: FaCloud, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  mobile: { label: 'Mobile', icon: FaMobileAlt, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  other: { label: 'Other', icon: FaCubes, color: 'text-slate-500', bg: 'bg-slate-500/10' },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const loadSkills = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSkills();
      setSkills(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleSave = async (data: SkillFormData) => {
    if (editing) {
      const updated = await updateSkill(editing._id, data);
      setSkills((prev) => prev.map((s) => (s._id === editing._id ? { ...s, ...updated } : s)));
      setToast({ message: 'Skill updated successfully', type: 'success' });
    } else {
      const created = await createSkill(data);
      setSkills((prev) => [...prev, created]);
      setToast({ message: 'Skill created successfully', type: 'success' });
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteSkill(deleteTarget._id);
      setSkills((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      setDeleteTarget(null);
      setToast({ message: 'Skill deleted successfully', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.response?.data?.error || 'Failed to delete', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    skills.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [skills]);

  const filtered = useMemo(() => {
    return skills
      .filter((s) => (filter === 'all' ? true : s.category === filter))
      .filter((s) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
      });
  }, [skills, search, filter]);

  const avgProficiency = skills.length
    ? Math.round(skills.reduce((sum, s) => sum + s.proficiency, 0) / skills.length)
    : 0;

  const categories: Filter[] = ['all', 'frontend', 'backend', 'database', 'devops', 'mobile', 'other'];
  const filterTabs = categories.filter(
    (c) => c === 'all' || categoryCounts[c] > 0
  );

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* ===== HEADER ===== */}
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Skills
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {skills.length} total
            {skills.length > 0 && (
              <>
                <span className="mx-1.5">•</span>
                <span>Avg {avgProficiency}% proficiency</span>
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
          Add Skill
        </motion.button>
      </motion.div>

      {/* ===== FILTER TABS ===== */}
      {!loading && !error && skills.length > 0 && (
        <motion.div variants={item} className="flex flex-wrap gap-2">
          {filterTabs.map((cat) => {
            const active = filter === cat;
            const meta = cat === 'all'
              ? { label: 'All', icon: FaCode, color: 'text-red-500', bg: 'bg-red-500/10' }
              : CATEGORY_META[cat];
            const Icon = meta.icon;
            const count = cat === 'all' ? skills.length : categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all border ${
                  active
                    ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-500/30'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`text-xs ${active ? '' : meta.color}`} />
                <span>{meta.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    active ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>
      )}

      {/* ===== SEARCH ===== */}
      {!loading && !error && skills.length > 0 && (
        <motion.div variants={item} className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills by name or category..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
          />
        </motion.div>
      )}

      {/* ===== CONTENT ===== */}
      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <motion.div
          variants={item}
          className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 rounded-2xl p-4 text-sm flex items-center justify-between"
        >
          <span>{error}</span>
          <button onClick={loadSkills} className="font-medium underline hover:no-underline">
            Retry
          </button>
        </motion.div>
      ) : skills.length === 0 ? (
        <EmptyState
          mode="empty"
          onCreate={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          onClear={() => {}}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          mode="no-results"
          onCreate={() => {}}
          onClear={() => {
            setSearch('');
            setFilter('all');
          }}
        />
      ) : (
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((skill) => {
              const meta = CATEGORY_META[skill.category] || CATEGORY_META.other;
              const Icon = meta.icon;
              return (
                <motion.div
                  key={skill._id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`${meta.color} text-base`} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {skill.name}
                        </div>
                        <div className={`text-xs ${meta.color} capitalize`}>
                          {meta.label}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setEditing(skill);
                          setFormOpen(true);
                        }}
                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-center transition"
                        title="Edit"
                      >
                        <FaEdit className="text-[10px]" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteTarget(skill)}
                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center transition"
                        title="Delete"
                      >
                        <FaTrash className="text-[10px]" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Proficiency */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Proficiency
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                        {skill.proficiency}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.proficiency}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ===== FOOTER COUNT ===== */}
      {!loading && !error && filtered.length > 0 && (
        <motion.p
          variants={item}
          className="text-center text-xs text-slate-400 dark:text-slate-500 pt-2"
        >
          Showing {filtered.length} of {skills.length} skill{skills.length !== 1 ? 's' : ''}
        </motion.p>
      )}

      {/* Modals */}
      <SkillFormModal
        isOpen={formOpen}
        skill={editing}
        onSave={handleSave}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete this skill?"
        message={
          deleteTarget
            ? `You're about to delete "${deleteTarget.name}". This action cannot be undone.`
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

// ==================== SKELETON ====================
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse"
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded w-1/3" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded w-1/2" />
            <div className="h-2 bg-slate-100 dark:bg-slate-700/60 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== EMPTY STATE ====================
function EmptyState({
  mode,
  onCreate,
  onClear,
}: {
  mode: 'empty' | 'no-results';
  onCreate: () => void;
  onClear: () => void;
}) {
  const isFiltered = mode === 'no-results';

  return (
    <motion.div
      variants={item}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 sm:p-16 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
        {isFiltered ? (
          <FaSearch className="text-2xl text-slate-400" />
        ) : (
          <FaCode className="text-2xl text-slate-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
        {isFiltered ? 'No matching skills' : 'No skills yet'}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {isFiltered
          ? 'Try a different search term or clear your filters.'
          : 'Add your first skill to display on your portfolio.'}
      </p>
      {isFiltered ? (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          Clear filters
        </button>
      ) : (
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition shadow-lg shadow-red-500/20"
        >
          <FaPlus className="text-xs" />
          Add Your First Skill
        </button>
      )}
    </motion.div>
  );
}