import { useEffect, useState } from 'react';
import { getMessages, markMessageRead, deleteMessage } from '../../services/adminApi';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';
import type { ToastType } from '../../components/admin/Toast';
import {
  FaEnvelope, FaEnvelopeOpen, FaTrash, FaChevronDown, FaChevronUp,
  FaSpinner, FaInbox, FaSearch, FaReply,
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

type Filter = 'all' | 'unread';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState(false);
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

  const filtered = messages
    .filter((m) => (filter === 'unread' ? !m.isRead : true))
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

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Messages
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {messages.length} total
            {unreadCount > 0 && (
              <>
                <span className="mx-1.5">•</span>
                <span className="text-red-500 font-medium">{unreadCount} unread</span>
              </>
            )}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-red-500 text-white shadow-sm shadow-red-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'unread'
                ? 'bg-red-500 text-white shadow-sm shadow-red-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, subject, or message..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <FaSpinner className="text-red-500 text-3xl animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 rounded-xl p-4 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadMessages} className="font-medium underline hover:no-underline">
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 sm:p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <FaInbox className="text-2xl text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            {search
              ? 'No matching messages'
              : filter === 'unread'
              ? 'No unread messages'
              : 'No messages yet'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {search
              ? 'Try a different search term'
              : filter === 'unread'
              ? 'All caught up! Check back later.'
              : 'Messages from your contact form will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => {
            const isOpen = expanded === msg._id;
            return (
              <div
                key={msg._id}
                className={`group bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-200 overflow-hidden ${
                  msg.isRead
                    ? 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    : 'border-red-200 dark:border-red-500/40 shadow-sm shadow-red-500/5'
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => handleToggle(msg)}
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

                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {new Date(msg.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex-shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition mt-1">
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </button>

                {/* Expanded body */}
                {isOpen && (
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
                        onClick={() => setDeleteTarget(msg)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-red-200 dark:border-red-500/40 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        <FaTrash className="text-xs" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation modal */}
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

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}