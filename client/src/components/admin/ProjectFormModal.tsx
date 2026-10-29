import { useEffect, useState, useRef } from 'react';
import { FaTimes, FaUpload, FaSpinner, FaTrash, FaPlus } from 'react-icons/fa';
import { uploadImage } from '../../services/adminApi';

// ✅ EXPORTED types — imported by ProjectsAdmin.tsx
export interface ProjectFormData {
  title: string;
  description: string;
  image: string;
  images: string[];
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
}

export interface Project extends ProjectFormData {
  _id: string;
  createdAt?: string;
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

export default function ProjectFormModal({
  isOpen,
  project,
  onSave,
  onClose,
}: Props) {
  const [form, setForm] = useState<ProjectFormData>({
    title: '',
    description: '',
    image: '',
    images: [],
    techStack: [],
    liveUrl: '',
    githubUrl: '',
    featured: false,
  });
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      if (project) {
        const existingImages =
          project.images && project.images.length > 0
            ? project.images
            : project.image
            ? [project.image]
            : [];

        setForm({
          title: project.title,
          description: project.description,
          image: project.image || existingImages[0] || '',
          images: existingImages,
          techStack: project.techStack || [],
          liveUrl: project.liveUrl || '',
          githubUrl: project.githubUrl || '',
          featured: project.featured || false,
        });
      } else {
        setForm({
          title: '',
          description: '',
          image: '',
          images: [],
          techStack: [],
          liveUrl: '',
          githubUrl: '',
          featured: false,
        });
      }
      setTechInput('');
      setErrors({});
    }
  }, [isOpen, project]);

  // ESC to close
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
    else if (form.title.trim().length < 2)
      newErrors.title = 'Title must be at least 2 characters';
    else if (form.title.trim().length > 100)
      newErrors.title = 'Title must be under 100 characters';

    if (!form.description.trim())
      newErrors.description = 'Description is required';
    else if (form.description.trim().length < 10)
      newErrors.description = 'Description must be at least 10 characters';
    else if (form.description.length > 500)
      newErrors.description = 'Description must be under 500 characters';

    if (form.images.length === 0)
      newErrors.image = 'At least one image is required';
    if (form.techStack.length === 0)
      newErrors.techStack = 'Add at least one technology';
    if (form.liveUrl && !URL_REGEX.test(form.liveUrl))
      newErrors.liveUrl = 'Enter a valid URL (https://...)';
    if (form.githubUrl && !URL_REGEX.test(form.githubUrl))
      newErrors.githubUrl = 'Enter a valid URL (https://...)';

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

  // Upload multiple files
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, image: 'All files must be images' }));
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: 'Each image must be under 5 MB',
        }));
        continue;
      }

      setUploading(true);
      setErrors((prev) => ({ ...prev, image: undefined }));

      try {
        const result = await uploadImage(file);
        setForm((prev) => {
          const newImages = [...prev.images, result.url];
          return {
            ...prev,
            images: newImages,
            image: prev.image || newImages[0],
          };
        });
      } catch (err: any) {
        setErrors((prev) => ({
          ...prev,
          image: err.response?.data?.error || 'Upload failed',
        }));
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: newImages[0] || '',
      };
    });
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const dataToSave: ProjectFormData = {
        ...form,
        image: form.images[0] || form.image,
        images: form.images,
      };
      await onSave(dataToSave);
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
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.title
                  ? 'border-red-500'
                  : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder="e.g. Portfolio Website"
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none ${
                errors.description
                  ? 'border-red-500'
                  : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder="Describe what the project does..."
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description ? (
                <p className="text-xs text-red-500">{errors.description}</p>
              ) : (
                <span />
              )}
              <span
                className={`text-xs ${
                  form.description.length > 500
                    ? 'text-red-500'
                    : 'text-slate-400'
                }`}
              >
                {form.description.length}/500
              </span>
            </div>
          </div>

          {/* Multiple Images */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Project Images <span className="text-red-500">*</span>
              <span className="ml-2 text-xs text-slate-500 dark:text-slate-400 font-normal">
                (First image is used as cover)
              </span>
            </label>

            {form.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                {form.images.map((img, index) => (
                  <div
                    key={`${img}-${index}`}
                    className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  >
                    <img
                      src={img}
                      alt={`Project ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    {index === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-red-500 text-white text-[9px] font-bold uppercase">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      disabled={uploading}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition opacity-90 disabled:opacity-50"
                      title="Remove"
                    >
                      <FaTrash className="text-[10px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files.length > 0) {
                  handleFiles(e.dataTransfer.files);
                }
              }}
              className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition ${
                dragOver
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : errors.image
                  ? 'border-red-500'
                  : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
              }`}
            >
              {uploading ? (
                <>
                  <FaSpinner className="text-2xl text-red-500 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Uploading...
                  </p>
                </>
              ) : (
                <>
                  <FaUpload className="text-2xl text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mb-1">
                    {form.images.length > 0
                      ? 'Add more images'
                      : 'Click to upload or drag & drop'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Select multiple images (PNG, JPG, WEBP up to 5 MB each)
                  </p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFiles(e.target.files);
                }
                e.target.value = '';
              }}
            />
            {errors.image && (
              <p className="text-xs text-red-500 mt-1">{errors.image}</p>
            )}
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Tech Stack <span className="text-red-500">*</span>
            </label>
            <div
              className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 ${
                errors.techStack
                  ? 'border-red-500'
                  : 'border-slate-300 dark:border-slate-600'
              }`}
            >
              {form.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-red-500/10 text-red-500 border border-red-500/30 rounded-full"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="hover:text-red-700"
                      >
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
            {errors.techStack && (
              <p className="text-xs text-red-500 mt-1">{errors.techStack}</p>
            )}
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Live URL
              </label>
              <input
                type="url"
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm ${
                  errors.liveUrl
                    ? 'border-red-500'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
                placeholder="https://example.com"
              />
              {errors.liveUrl && (
                <p className="text-xs text-red-500 mt-1">{errors.liveUrl}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                value={form.githubUrl}
                onChange={(e) =>
                  setForm({ ...form, githubUrl: e.target.value })
                }
                className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm ${
                  errors.githubUrl
                    ? 'border-red-500'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
                placeholder="https://github.com/..."
              />
              {errors.githubUrl && (
                <p className="text-xs text-red-500 mt-1">{errors.githubUrl}</p>
              )}
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                Featured Project
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Highlight this project as featured
              </div>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, featured: !form.featured })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                form.featured ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  form.featured ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
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
            {saving
              ? 'Saving...'
              : project
              ? 'Update Project'
              : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}