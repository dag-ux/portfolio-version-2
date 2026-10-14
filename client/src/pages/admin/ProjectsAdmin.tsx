import { useEffect, useState } from 'react';
import { getAdminProjects, createProject, updateProject, deleteProject } from '../../services/adminApi';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';
import type { ToastType } from '../../components/admin/Toast';
import ProjectFormModal from '../../components/admin/ProjectFormModal';
import type { ProjectFormData } from '../../components/admin/ProjectFormModal';
import {
  FaPlus, FaEdit, FaTrash, FaGithub, FaExternalLinkAlt,
  FaSearch, FaFolder, FaStar, FaSpinner,
} from 'react-icons/fa';

interface Project extends ProjectFormData {
  _id: string;
  createdAt?: string;
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
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

  const filtered = projects.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.techStack.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {projects.length} project{projects.length !== 1 ? 's' : ''} • {projects.filter((p) => p.featured).length} featured
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition shadow-sm shadow-red-500/30"
        >
          <FaPlus /> Add Project
        </button>
      </div>

      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, description, or technology..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <FaSpinner className="text-red-500 text-3xl animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 rounded-xl p-4 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadProjects} className="font-medium underline hover:no-underline">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 sm:p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <FaFolder className="text-2xl text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            {search ? 'No matching projects' : 'No projects yet'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {search ? 'Try a different search term' : 'Get started by adding your first portfolio project.'}
          </p>
          {!search && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition"
            >
              <FaPlus /> Add Your First Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <div
              key={project._id}
              className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 flex flex-col"
            >
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaFolder className="text-4xl text-slate-300 dark:text-slate-600" />
                  </div>
                )}

                {project.featured && (
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/90 text-white text-xs font-semibold">
                    <FaStar className="text-[10px]" /> Featured
                  </div>
                )}

                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition"
                    title="Edit"
                  >
                    <FaEdit className="text-xs" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(project)}
                    className="w-8 h-8 rounded-full bg-red-500/90 backdrop-blur text-white flex items-center justify-center hover:bg-red-500 transition"
                    title="Delete"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 flex-1">
                  {project.description}
                </p>

                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full"
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

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                  {project.githubUrl ? (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition" title="GitHub">
                      <FaGithub />
                    </a>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600"><FaGithub /></span>
                  )}
                  {project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition" title="Live site">
                      <FaExternalLinkAlt className="text-sm" />
                    </a>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600"><FaExternalLinkAlt className="text-sm" /></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
        message={deleteTarget ? `You're about to permanently delete "${deleteTarget.title}". This action cannot be undone.` : ''}
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
    </div>
  );
}