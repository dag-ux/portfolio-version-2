import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

export type ToastType = 'success' | 'error';

export interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 fade-in duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm min-w-[280px] max-w-md ${
          isSuccess
            ? 'bg-white/95 dark:bg-slate-800/95 border-green-200 dark:border-green-500/40'
            : 'bg-white/95 dark:bg-slate-800/95 border-red-200 dark:border-red-500/40'
        }`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isSuccess
              ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
          }`}
        >
          {isSuccess ? <FaCheckCircle /> : <FaExclamationCircle />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <FaTimes className="text-xs" />
        </button>
      </div>
    </div>
  );
}