import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdminProjects, createProject, updateProject, deleteProject } from '../../services/adminApi';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';
import type { ToastType } from '../../components/admin/Toast';
import ProjectFormModal from '../../components/admin/ProjectFormModal';
import type { ProjectFormData } from '../../components/admin/ProjectFormModal';
import {
  FaPlus, FaEdit, FaTrash, FaGithub, FaExternalLinkAlt,
  FaSearch, FaFolder, FaStar, FaFilter,
} from 'react-icons/fa';

interface Project extends ProjectFormData {
  _id: string;
  createdAt?: string;
}

type Filter = 'all' | 'featured' | 'regular';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditing(project);
    setFormOpen(true);
  };

  const handleSave = async (data: ProjectFormData) => {
    if (editing) {
      const updated = await updateProject(editing._id, data);
      setProjects((prev) => prev.map((p) => (p._id === editing._id ? { ...p, ...updated } : p)));
      setToast({ message: 'Project updated successfully', type: 'success' });
    } else {
      const created = await createProject(data);
      setProjects((prev) => [created, ...prev]);
      setToast({ message: 'Project created successfully', type: 'success' });
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProject(deleteTarget._id);
      setProjects((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
      setToast({ message: 'Project deleted successfully', type: 'success' });
    } catch (err: any) {
      setToast({
        message: err.response?.data?.error || 'Failed to delete project',
        type: 'error',
      });
    } finally {
      setDeleting(false);
    }
  };

  const featuredCount = projects.filter((p) => p.featured).length;
  const regularCount = projects.length - featuredCount;

  const filtered = useMemo(() => {
    return projects
      .filter((p) => {
        if (filter === 'featured') return p.featured;
        if (filter === 'regular') return !p.featured;
        return true;
      })
      .filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.techStack.some((t) => t.toLowerCase().includes(q))
        );
      });
  }, [projects, search, filter]);

  const filterTabs: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: projects.length },
    { key: 'featured', label: 'Featured', count: featuredCount },
    { key: 'regular', label: 'Regular', count: regularCount },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* ===== HEADER ===== */}
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Projects
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {projects.length} total
            {featuredCount > 0 && (
              <>
                <span className="mx-1.5">•</span>
                <span className="text-yellow-500 font-medium">
                  {featuredCount} featured
                </span>
              </>
            )}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
        >
          <FaPlus className="text-xs" />
          Add Project
        </motion.button>
      </motion.div>

      {/* ===== FILTER TABS ===== */}
      {!loading && !error && projects.length > 0 && (
        <motion.div
          variants={item}
          className="flex flex-wrap gap-2 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl w-fit"
        >
          {filterTabs.map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="projectFilterTab"
                    className="absolute inset-0 bg-red-500 rounded-lg shadow-md shadow-red-500/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {tab.key === 'featured' && <FaStar className="text-[10px]" />}
                  {tab.label}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      active
                        ? 'bg-white/20'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </span>
              </button>
            );
          })}
        </motion.div>
      )}

      {/* ===== SEARCH ===== */}
      {!loading && !error && projects.length > 0 && (
        <motion.div variants={item} className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description, or technology..."
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
          <button
            onClick={loadProjects}
            className="font-medium underline hover:no-underline"
          >
            Retry
          </button>
        </motion.div>
      ) : projects.length === 0 ? (
        <EmptyState
          search=""
          onCreate={handleOpenCreate}
          onClear={() => {}}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          search={search}
          onCreate={handleOpenCreate}
          onClear={() => {
            setSearch('');
            setFilter('all');
          }}
        />
      ) : (
        <>
          <motion.div
            variants={item}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onEdit={() => handleOpenEdit(project)}
                  onDelete={() => setDeleteTarget(project)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          <p className="text-center text-xs text-slate-400 dark:text-slate-500 pt-4">
            Showing {filtered.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </>
      )}

      {/* Modals */}
      <ProjectFormModal
        isOpen={formOpen}
        project={editing}
        onSave={handleSave}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete this project?"
        message={
          deleteTarget
            ? `You're about to permanently delete "${deleteTarget.title}". This action cannot be undone.`
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

// ==================== CARD ====================
function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaFolder className="text-4xl text-slate-300 dark:text-slate-600" />
          </div>
        )}

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/95 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-yellow-500/30">
            <FaStar className="text-[9px]" />
            Featured
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onEdit}
            className="w-8 h-8 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition shadow-lg"
            title="Edit"
          >
            <FaEdit className="text-xs" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            className="w-8 h-8 rounded-full bg-red-500/95 backdrop-blur text-white flex items-center justify-center hover:bg-red-500 transition shadow-lg shadow-red-500/30"
            title="Delete"
          >
            <FaTrash className="text-xs" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-red-500 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Tech stack */}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-600"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 5 && (
              <span className="text-[11px] px-2 py-0.5 text-slate-500 dark:text-slate-400">
                +{project.techStack.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Action icons */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
              title="GitHub"
            >
              <FaGithub />
            </a>
          ) : (
            <span className="text-slate-300 dark:text-slate-600">
              <FaGithub />
            </span>
          )}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
              title="Live site"
            >
              <FaExternalLinkAlt className="text-sm" />
            </a>
          ) : (
            <span className="text-slate-300 dark:text-slate-600">
              <FaExternalLinkAlt className="text-sm" />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ==================== SKELETON ====================
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse"
        >
          <div className="aspect-video bg-slate-100 dark:bg-slate-900" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded" />
            <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded w-5/6" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 bg-slate-100 dark:bg-slate-700/60 rounded-full w-16" />
              <div className="h-6 bg-slate-100 dark:bg-slate-700/60 rounded-full w-20" />
              <div className="h-6 bg-slate-100 dark:bg-slate-700/60 rounded-full w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== EMPTY STATE ====================
function EmptyState({
  search,
  onCreate,
  onClear,
}: {
  search: string;
  onCreate: () => void;
  onClear: () => void;
}) {
  const isFiltered = !!search.trim();

  return (
    <motion.div
      variants={item}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 sm:p-16 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
        {isFiltered ? (
          <FaSearch className="text-2xl text-slate-400" />
        ) : (
          <FaFolder className="text-2xl text-slate-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
        {isFiltered ? 'No matching projects' : 'No projects yet'}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {isFiltered
          ? 'Try a different search term or clear your filters.'
          : 'Get started by adding your first portfolio project.'}
      </p>
      {isFiltered ? (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          <FaFilter className="text-xs" />
          Clear filters
        </button>
      ) : (
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition shadow-lg shadow-red-500/20"
        >
          <FaPlus className="text-xs" />
          Add Your First Project
        </button>
      )}
    </motion.div>
  );
}