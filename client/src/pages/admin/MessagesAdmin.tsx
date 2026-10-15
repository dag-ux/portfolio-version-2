import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMessages, markMessageRead, deleteMessage } from '../../services/adminApi';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';
import type { ToastType } from '../../components/admin/Toast';
import {
  FaEnvelope, FaEnvelopeOpen, FaTrash, FaChevronDown, FaChevronUp,
  FaSpinner, FaInbox, FaSearch, FaReply, FaCheckDouble, FaFilter,
} from 'react-icons/fa';

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

type Filter = 'all' | 'unread' | 'read';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggle = async (msg: Message) => {
    const isOpening = expanded !== msg._id;
    setExpanded(isOpening ? msg._id : null);

    if (isOpening && !msg.isRead) {
      try {
        await markMessageRead(msg._id);
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, isRead: true } : m))
        );
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }
  };

  const handleMarkAllRead = async () => {
    const unread = messages.filter((m) => !m.isRead);
    if (unread.length === 0) return;

    setMarkingAll(true);
    try {
      await Promise.all(unread.map((m) => markMessageRead(m._id)));
      setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
      setToast({ message: `${unread.length} message${unread.length > 1 ? 's' : ''} marked as read`, type: 'success' });
    } catch (err: any) {
      setToast({ message: 'Failed to mark all as read', type: 'error' });
    } finally {
      setMarkingAll(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMessage(deleteTarget._id);
      setMessages((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      setDeleteTarget(null);
      setToast({ message: 'Message deleted successfully', type: 'success' });
    } catch (err: any) {
      setToast({
        message: err.response?.data?.error || 'Failed to delete message',
        type: 'error',
      });
    } finally {
      setDeleting(false);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const readCount = messages.length - unreadCount;

  const filtered = useMemo(() => {
    return messages
      .filter((m) => {
        if (filter === 'unread') return !m.isRead;
        if (filter === 'read') return m.isRead;
        return true;
      })
      .filter((m) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
        );
      });
  }, [messages, filter, search]);

  const filterTabs: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: messages.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'read', label: 'Read', count: readCount },
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
            Messages
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {messages.length} total
            {unreadCount > 0 && (
              <>
                <span className="mx-1.5">•</span>
                <span className="text-red-500 font-medium">
                  {unreadCount} unread
                </span>
              </>
            )}
          </p>
        </div>

        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50 shadow-sm"
          >
            {markingAll ? (
              <FaSpinner className="animate-spin text-xs" />
            ) : (
              <FaCheckDouble className="text-xs" />
            )}
            Mark all as read
          </motion.button>
        )}
      </motion.div>

      {/* ===== FILTER TABS ===== */}
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
                  layoutId="filterTab"
                  className="absolute inset-0 bg-red-500 rounded-lg shadow-md shadow-red-500/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
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

      {/* ===== SEARCH ===== */}
      {!loading && !error && messages.length > 0 && (
        <motion.div variants={item} className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, subject, or message..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
          />
        </motion.div>
      )}

      {/* ===== CONTENT ===== */}
      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <motion.div
          variants={item}
          className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 rounded-2xl p-4 text-sm flex items-center justify-between"
        >
          <span>{error}</span>
          <button
            onClick={loadMessages}
            className="font-medium underline hover:no-underline"
          >
            Retry
          </button>
        </motion.div>
      ) : filtered.length === 0 ? (
        <EmptyState filter={filter} search={search} onClear={() => { setSearch(''); setFilter('all'); }} />
      ) : (
        <motion.div variants={item} className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((msg) => (
              <MessageCard
                key={msg._id}
                msg={msg}
                isOpen={expanded === msg._id}
                onToggle={() => handleToggle(msg)}
                onDelete={() => setDeleteTarget(msg)}
              />
            ))}
          </AnimatePresence>

          {/* Footer count */}
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 pt-4">
            Showing {filtered.length} of {messages.length} message{messages.length !== 1 ? 's' : ''}
          </p>
        </motion.div>
      )}

      {/* Modals */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete this message?"
        message={
          deleteTarget
            ? `You're about to permanently delete the message from ${deleteTarget.name}. This action cannot be undone.`
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
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </motion.div>
  );
}

// ==================== MESSAGE CARD ====================
function MessageCard({
  msg,
  isOpen,
  onToggle,
  onDelete,
}: {
  msg: Message;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const timeAgo = getTimeAgo(msg.createdAt);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className={`group bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-200 overflow-hidden ${
        msg.isRead
          ? 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
          : 'border-red-200 dark:border-red-500/40 shadow-sm shadow-red-500/5'
      }`}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-700/40 transition"
      >
        <div
          className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center ${
            msg.isRead
              ? 'bg-slate-100 dark:bg-slate-700 text-slate-400'
              : 'bg-red-100 dark:bg-red-500/20 text-red-500'
          }`}
        >
          {msg.isRead ? <FaEnvelopeOpen /> : <FaEnvelope />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`font-semibold text-sm sm:text-base truncate ${
                msg.isRead
                  ? 'text-slate-700 dark:text-slate-300'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {msg.name}
            </span>
            {!msg.isRead && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-red-500 text-white rounded-full">
                New
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate mb-1">
            {msg.email}
          </p>

          <p
            className={`text-sm sm:text-base mb-1.5 truncate ${
              msg.isRead
                ? 'text-slate-600 dark:text-slate-400'
                : 'text-slate-800 dark:text-slate-200 font-medium'
            }`}
          >
            {msg.subject}
          </p>

          <p className="text-xs text-slate-400 dark:text-slate-500">{timeAgo}</p>
        </div>

        <div className="flex-shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition mt-1">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 px-4 sm:px-5 py-4">
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed mb-5">
                {msg.message}
              </p>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  <FaReply className="text-xs" /> Reply via email
                </a>
                <button
                  onClick={onDelete}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-red-200 dark:border-red-500/40 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  <FaTrash className="text-xs" /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==================== HELPERS ====================
function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// ==================== SKELETON ====================
function SkeletonLoader() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 flex items-start gap-4 animate-pulse"
        >
          <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
            <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded w-1/3" />
            <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded w-2/3" />
            <div className="h-3 bg-slate-100 dark:bg-slate-700/60 rounded w-1/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== EMPTY STATE ====================
function EmptyState({
  filter,
  search,
  onClear,
}: {
  filter: Filter;
  search: string;
  onClear: () => void;
}) {
  const isFiltered = filter !== 'all' || search.trim() !== '';

  return (
    <motion.div
      variants={item}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 sm:p-16 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
        {search ? (
          <FaSearch className="text-2xl text-slate-400" />
        ) : filter === 'unread' ? (
          <FaCheckDouble className="text-2xl text-slate-400" />
        ) : (
          <FaInbox className="text-2xl text-slate-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
        {search
          ? 'No matching messages'
          : filter === 'unread'
          ? 'No unread messages'
          : filter === 'read'
          ? 'No read messages'
          : 'No messages yet'}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        {search
          ? 'Try a different search term'
          : filter === 'unread'
          ? 'All caught up! Check back later.'
          : filter === 'read'
          ? 'Read messages will appear here.'
          : 'Messages from your contact form will appear here.'}
      </p>
      {isFiltered && (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition"
        >
          <FaFilter className="text-xs" />
          Clear filters
        </button>
      )}
    </motion.div>
  );
}