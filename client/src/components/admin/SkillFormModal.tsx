import { useEffect, useState } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';

export interface SkillFormData {
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'database' | 'mobile' | 'other';
  proficiency: number;
}

interface Skill extends SkillFormData {
  _id: string;
}

interface Props {
  isOpen: boolean;
  skill?: Skill | null;
  onSave: (data: SkillFormData) => Promise<void>;
  onClose: () => void;
}

const CATEGORIES = ['frontend', 'backend', 'devops', 'database', 'mobile', 'other'] as const;

export default function SkillFormModal({ isOpen, skill, onSave, onClose }: Props) {
  const [form, setForm] = useState<SkillFormData>({ name: '', category: 'frontend', proficiency: 80 });
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(skill
        ? { name: skill.name, category: skill.category, proficiency: skill.proficiency }
        : { name: '', category: 'frontend', proficiency: 80 });
      setErrors({});
    }
  }, [isOpen, skill]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen && !saving) onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, saving, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !saving && onClose()} />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {skill ? 'Edit Skill' : 'Add Skill'}
          </h2>
          <button onClick={onClose} disabled={saving} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-50">
            <FaTimes />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Skill Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
              placeholder="e.g. React"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as SkillFormData['category'] })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 capitalize"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Proficiency: <span className="text-red-500">{form.proficiency}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={form.proficiency}
              onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })}
              className="w-full accent-red-500"
            />
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 px-5 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving} className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50 inline-flex items-center gap-2">
            {saving && <FaSpinner className="animate-spin" />}
            {saving ? 'Saving...' : skill ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
