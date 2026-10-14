import { useEffect, useState } from 'react';
import { getAdminExperiences, createExperience, updateExperience, deleteExperience } from '../../services/adminApi';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';
import type { ToastType } from '../../components/admin/Toast';
import ExperienceFormModal from '../../components/admin/ExperienceFormModal';
import type { ExperienceFormData } from '../../components/admin/ExperienceFormModal';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaBriefcase, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

interface Experience extends ExperienceFormData { _id: string; }

export default function ExperiencesAdmin() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const data = await getAdminExperiences();
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load experiences');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

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
    setFormOpen(false); setEditing(null);
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
    } finally { setDeleting(false); }
  };

  const fmt = (d?: string) => d ? new Date(d).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Experiences</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{items.length} experience{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition shadow-sm shadow-red-500/30">
          <FaPlus /> Add Experience
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><FaSpinner className="text-red-500 text-3xl animate-spin" /></div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 rounded-xl p-4 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={load} className="font-medium underline hover:no-underline">Retry</button>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 sm:p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <FaBriefcase className="text-2xl text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No experiences yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Add your first work experience to display on your portfolio.</p>
          <button onClick={() => { setEditing(null); setFormOpen(true); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium">
            <FaPlus /> Add Your First Experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((exp) => (
            <div key={exp._id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{exp.position}</h3>
                    {exp.current && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-green-500 text-white rounded-full">Current</span>}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-2">{exp.company}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1.5"><FaCalendarAlt /> {fmt(exp.startDate)} — {exp.current ? 'Present' : fmt(exp.endDate)}</span>
                    {exp.location && <span className="inline-flex items-center gap-1.5"><FaMapMarkerAlt /> {exp.location}</span>}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => { setEditing(exp); setFormOpen(true); }} className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center transition" title="Edit">
                    <FaEdit className="text-xs" />
                  </button>
                  <button onClick={() => setDeleteTarget(exp)} className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center transition" title="Delete">
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">{exp.description}</p>
              {exp.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {exp.techStack.slice(0, 6).map((t) => (
                    <span key={t} className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ExperienceFormModal isOpen={formOpen} experience={editing} onSave={handleSave} onClose={() => { setFormOpen(false); setEditing(null); }} />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete this experience?"
        message={deleteTarget ? `You're about to delete "${deleteTarget.position} at ${deleteTarget.company}". This action cannot be undone.` : ''}
        confirmLabel="Delete" cancelLabel="Keep it" loading={deleting} variant="danger"
        onConfirm={handleConfirmDelete} onCancel={() => setDeleteTarget(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
