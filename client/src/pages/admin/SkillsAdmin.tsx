import { useEffect, useState } from 'react';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../services/adminApi';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';
import type { ToastType } from '../../components/admin/Toast';
import SkillFormModal from '../../components/admin/SkillFormModal';
import type { SkillFormData } from '../../components/admin/SkillFormModal';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaCode } from 'react-icons/fa';

interface Skill extends SkillFormData { _id: string; }

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
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

  useEffect(() => { loadSkills(); }, []);

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

  const filtered = skills.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
  });

  const categories = ['frontend', 'backend', 'devops', 'database', 'mobile', 'other'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Skills</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{skills.length} skill{skills.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition shadow-sm shadow-red-500/30"
        >
          <FaPlus /> Add Skill
        </button>
      </div>

      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skills..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><FaSpinner className="text-red-500 text-3xl animate-spin" /></div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 rounded-xl p-4 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadSkills} className="font-medium underline hover:no-underline">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <FaCode className="text-4xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {search ? 'No matching skills' : 'No skills yet'}
          </p>
          {!search && (
            <button onClick={() => { setEditing(null); setFormOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium">
              <FaPlus /> Add Your First Skill
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => {
            const catSkills = filtered.filter((s) => s.category === cat);
            if (catSkills.length === 0) return null;
            return (
              <div key={cat}>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 capitalize">{cat}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catSkills.map((skill) => (
                    <div key={skill._id} className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-semibold text-slate-900 dark:text-white truncate">{skill.name}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => { setEditing(skill); setFormOpen(true); }} className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center transition" title="Edit">
                            <FaEdit className="text-xs" />
                          </button>
                          <button onClick={() => setDeleteTarget(skill)} className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center transition" title="Delete">
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${skill.proficiency}%` }} />
                        </div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-9 text-right">{skill.proficiency}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <SkillFormModal
        isOpen={formOpen}
        skill={editing}
        onSave={handleSave}
        onClose={() => { setFormOpen(false); setEditing(null); }}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete this skill?"
        message={deleteTarget ? `You're about to delete "${deleteTarget.name}". This action cannot be undone.` : ''}
        confirmLabel="Delete"
        cancelLabel="Keep it"
        loading={deleting}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
