import { useEffect, useState } from 'react';
import { FaTimes, FaSpinner, FaPlus } from 'react-icons/fa';

export interface ExperienceFormData {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  techStack: string[];
}

interface Experience extends ExperienceFormData { _id: string; }

interface Props {
  isOpen: boolean;
  experience?: Experience | null;
  onSave: (data: ExperienceFormData) => Promise<void>;
  onClose: () => void;
}

interface FormErrors {
  company?: string;
  position?: string;
  startDate?: string;
  description?: string;
}

export default function ExperienceFormModal({ isOpen, experience, onSave, onClose }: Props) {
  const empty = (): ExperienceFormData => ({
    company: '', position: '', location: '', startDate: '', endDate: '',
    current: false, description: '', achievements: [], techStack: [],
  });
  const [form, setForm] = useState<ExperienceFormData>(empty());
  const [achInput, setAchInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (experience) {
        setForm({
          company: experience.company,
          position: experience.position,
          location: experience.location || '',
          startDate: experience.startDate?.slice(0, 10) || '',
          endDate: experience.endDate?.slice(0, 10) || '',
          current: experience.current || false,
          description: experience.description,
          achievements: experience.achievements || [],
          techStack: experience.techStack || [],
        });
      } else {
        setForm(empty());
      }
      setAchInput('');
      setTechInput('');
      setErrors({});
    }
  }, [isOpen, experience]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen && !saving) onClose(); };
    if (isOpen) { document.addEventListener('keydown', handleEsc); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', handleEsc); document.body.style.overflow = ''; };
  }, [isOpen, saving, onClose]);

  if (!isOpen) return null;

  const addAch = () => {
    const v = achInput.trim();
    if (!v) return;
    setForm({ ...form, achievements: [...form.achievements, v] });
    setAchInput('');
  };
  const removeAch = (v: string) => setForm({ ...form, achievements: form.achievements.filter((a) => a !== v) });

  const addTech = () => {
    const v = techInput.trim();
    if (!v || form.techStack.includes(v)) { setTechInput(''); return; }
    setForm({ ...form, techStack: [...form.techStack, v] });
    setTechInput('');
  };
  const removeTech = (v: string) => setForm({ ...form, techStack: form.techStack.filter((t) => t !== v) });

  const validate = () => {
    const e: FormErrors = {};
    if (!form.company.trim()) e.company = 'Company is required';
    if (!form.position.trim()) e.position = 'Position is required';
    if (!form.startDate) e.startDate = 'Start date is required';
    if (!form.description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: any = { ...form };
      if (payload.current) payload.endDate = undefined;
      if (!payload.endDate) delete payload.endDate;
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (hasError?: string) =>
    `w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm ${hasError ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`;

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto p-0 sm:p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !saving && onClose()} />

      <div className="relative w-full sm:max-w-2xl my-0 sm:my-8 bg-white dark:bg-slate-800 rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {experience ? 'Edit Experience' : 'Add Experience'}
          </h2>
          <button onClick={onClose} disabled={saving} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-50">
            <FaTimes />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Company <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputClass(errors.company)} placeholder="e.g. INSA" />
              {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Position <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className={inputClass(errors.position)} placeholder="e.g. Software Engineer Intern" />
              {errors.position && <p className="text-xs text-red-500 mt-1">{errors.position}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass()} placeholder="e.g. Addis Ababa, Ethiopia" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={inputClass(errors.startDate)} />
              {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={inputClass()} disabled={form.current} />
              {form.current && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Currently working here</p>}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">Currently working here</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Mark as current position</div>
            </div>
            <button type="button" onClick={() => setForm({ ...form, current: !form.current })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${form.current ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${form.current ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputClass(errors.description)} resize-none`} placeholder="Brief summary of your role..." />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Achievements</label>
            <div className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900">
              {form.achievements.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.achievements.map((a) => (
                    <span key={a} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-red-500/10 text-red-500 border border-red-500/30 rounded-full">
                      {a}
                      <button type="button" onClick={() => removeAch(a)} className="hover:text-red-700"><FaTimes className="text-[10px]" /></button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input type="text" value={achInput} onChange={(e) => setAchInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAch(); } }} placeholder="Type achievement and press Enter" className="flex-1 bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none" />
                <button type="button" onClick={addAch} disabled={!achInput.trim()} className="px-3 py-1 rounded-md bg-red-500 text-white text-xs hover:bg-red-600 disabled:opacity-50"><FaPlus /></button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tech Stack</label>
            <div className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900">
              {form.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.techStack.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-red-500/10 text-red-500 border border-red-500/30 rounded-full">
                      {t}
                      <button type="button" onClick={() => removeTech(t)} className="hover:text-red-700"><FaTimes className="text-[10px]" /></button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }} placeholder="e.g. React (press Enter)" className="flex-1 bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none" />
                <button type="button" onClick={addTech} disabled={!techInput.trim()} className="px-3 py-1 rounded-md bg-red-500 text-white text-xs hover:bg-red-600 disabled:opacity-50"><FaPlus /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 px-5 py-4 flex justify-end gap-3">
          <button onClick={onClose} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50 inline-flex items-center gap-2">
            {saving && <FaSpinner className="animate-spin" />}
            {saving ? 'Saving...' : experience ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
