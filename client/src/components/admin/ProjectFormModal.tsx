import { useEffect, useState, useRef } from 'react';
import { FaTimes, FaUpload, FaSpinner, FaTrash, FaPlus } from 'react-icons/fa';
import { uploadImage } from '../../services/adminApi';

export interface ProjectFormData {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
}

interface Project extends ProjectFormData {
  _id: string;
}

interface Props {
  isOpen: boolean;
  project?: Project | null;
  onSave: (data: ProjectFormData) => Promise<void>;
  onClose: () => void;
}

interface FormErrors {
  title?: string;
  description?: string;
  image?: string;
  techStack?: string;
  liveUrl?: string;
  githubUrl?: string;
}

const URL_REGEX = /^https?:\/\/.+\..+/i;

export default function ProjectFormModal({ isOpen, project, onSave, onClose }: Props) {
  const [form, setForm] = useState<ProjectFormData>({
    title: '', description: '', image: '', techStack: [],
    liveUrl: '', githubUrl: '', featured: false,
  });
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (project) {
        setForm({
          title: project.title,
          description: project.description,
          image: project.image,
          techStack: project.techStack || [],
          liveUrl: project.liveUrl || '',
          githubUrl: project.githubUrl || '',
          featured: project.featured || false,
        });
      } else {
        setForm({
          title: '', description: '', image: '', techStack: [],
          liveUrl: '', githubUrl: '', featured: false,
        });
      }
      setTechInput('');
      setErrors({});
    }
  }, [isOpen, project]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !saving && !uploading) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, saving, uploading, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.title.trim()) newErrors.title = 'Title is required';
    else if (form.title.trim().length < 2) newErrors.title = 'Title must be at least 2 characters';
    else if (form.title.trim().length > 100) newErrors.title = 'Title must be under 100 characters';

    if (!form.description.trim()) newErrors.description = 'Description is required';
    else if (form.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';
    else if (form.description.length > 500) newErrors.description = 'Description must be under 500 characters';

    if (!form.image) newErrors.image = 'Image is required';
    if (form.techStack.length === 0) newErrors.techStack = 'Add at least one technology';
    if (form.liveUrl && !URL_REGEX.test(form.liveUrl)) newErrors.liveUrl = 'Enter a valid URL (https://...)';
    if (form.githubUrl && !URL_REGEX.test(form.githubUrl)) newErrors.githubUrl = 'Enter a valid URL (https://...)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTech = () => {
    const tech = techInput.trim();
    if (!tech) return;
    if (form.techStack.includes(tech)) {
      setTechInput('');
      return;
    }
    setForm({ ...form, techStack: [...form.techStack, tech] });
    setTechInput('');
    if (errors.techStack) setErrors({ ...errors, techStack: undefined });
  };

  const handleRemoveTech = (tech: string) => {
    setForm({ ...form, techStack: form.techStack.filter((t) => t !== tech) });
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, image: 'File must be an image' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: 'Image must be under 5 MB' });
      return;
    }

    setUploading(true);
    setErrors({ ...errors, image: undefined });

    try {
      const result = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: result.url }));
    } catch (err: any) {
      setErrors({ ...errors, image: err.response?.data?.error || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto p-0 sm:p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => !saving && !uploading && onClose()}
      />

      <div className="relative w-full sm:max-w-2xl my-0 sm:my-8 bg-white dark:bg-slate-800 rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={onClose}
            disabled={saving || uploading}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition disabled:opacity-50"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.title ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
              placeholder="e.g. Portfolio Website"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none ${errors.description ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
              placeholder="Describe what the project does..."
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description ? (<p className="text-xs text-red-500">{errors.description}</p>) : <span />}
              <span className={`text-xs ${form.description.length > 500 ? 'text-red-500' : 'text-slate-400'}`}>
                {form.description.length}/500
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Project Image <span className="text-red-500">*</span>
            </label>
            {form.image ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src={form.image} alt="Project" className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-1.5 rounded-lg bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-white dark:hover:bg-slate-700 transition disabled:opacity-50"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: '' })}
                    disabled={uploading}
                    className="px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-xs font-medium hover:bg-red-500 transition disabled:opacity-50"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFile(file);
                }}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition ${dragOver ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : errors.image ? 'border-red-500' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'}`}
              >
                {uploading ? (
                  <>
                    <FaSpinner className="text-2xl text-red-500 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">Uploading...</p>
                  </>
                ) : (
                  <>
                    <FaUpload className="text-2xl text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mb-1">Click to upload or drag & drop</p>
                    <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5 MB</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = '';
              }}
            />
            {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Tech Stack <span className="text-red-500">*</span>
            </label>
            <div className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 ${errors.techStack ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}>
              {form.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.techStack.map((tech) => (
                    <span key={tech} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-red-500/10 text-red-500 border border-red-500/30 rounded-full">
                      {tech}
                      <button type="button" onClick={() => handleRemoveTech(tech)} className="hover:text-red-700">
                        <FaTimes className="text-[10px]" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                  placeholder="e.g. React (press Enter to add)"
                  className="flex-1 bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  disabled={!techInput.trim()}
                  className="px-3 py-1 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition disabled:opacity-50"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            {errors.techStack && <p className="text-xs text-red-500 mt-1">{errors.techStack}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Live URL</label>
              <input
                type="url"
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm ${errors.liveUrl ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                placeholder="https://example.com"
              />
              {errors.liveUrl && <p className="text-xs text-red-500 mt-1">{errors.liveUrl}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">GitHub URL</label>
              <input
                type="url"
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm ${errors.githubUrl ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                placeholder="https://github.com/..."
              />
              {errors.githubUrl && <p className="text-xs text-red-500 mt-1">{errors.githubUrl}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">Featured Project</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Highlight this project as featured</div>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, featured: !form.featured })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${form.featured ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${form.featured ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 px-5 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving || uploading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50 inline-flex items-center gap-2"
          >
            {saving && <FaSpinner className="animate-spin" />}
            {saving ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}
