import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin,
  FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaSpinner,
  FaClock, FaUser, FaCommentDots, FaTag,
} from 'react-icons/fa';
import { sendMessage } from '../services/api';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_LIMIT = 1000;

const contactInfo = [
  {
    icon: FaEnvelope,
    label: 'Email',
    value: 'kebededagimawit@gmail.com',
    href: 'mailto:kebededagimawit@gmail.com',
  },
  {
    icon: FaMapMarkerAlt,
    label: 'Location',
    value: 'Addis Ababa, Ethiopia',
    href: undefined,
  },
  {
    icon: FaClock,
    label: 'Response Time',
    value: 'Within 24 hours',
    href: undefined,
  },
];

const socials = [
  { icon: FaGithub, url: 'https://github.com/dag-ux', label: 'GitHub' },
  { icon: FaLinkedin, url: 'https://www.linkedin.com/in/dagimawit-kebede', label: 'LinkedIn' },
  { icon: FaEnvelope, url: 'mailto:kebededagimawit@gmail.com', label: 'Email' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name is too short';

    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!EMAIL_REGEX.test(form.email)) errs.email = 'Enter a valid email';

    if (!form.subject.trim()) errs.subject = 'Subject is required';
    else if (form.subject.trim().length < 3) errs.subject = 'Subject is too short';

    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 10) errs.message = 'Message is too short (min 10 chars)';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await sendMessage(form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (err: any) {
      setErrors({ message: err?.message || 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full bg-black/40 border ${
      errors[field]
        ? 'border-red-500'
        : focused === field
        ? 'border-[#ff0000] ring-2 ring-[#ff0000]/20'
        : 'border-white/10'
    } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-200`;

  return (
    <section className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      {/* Animated orbs */}
      <motion.div
        className="pointer-events-none absolute -top-40 -right-40 w-[30rem] h-[30rem] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,0,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{ x: [0, -60, 40, 0], y: [0, 40, -30, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-40 -left-40 w-[30rem] h-[30rem] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,80,80,0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        animate={{ x: [0, 50, -40, 0], y: [0, -50, 30, 0], scale: [1, 0.95, 1.1, 1] }}
        transition={{ duration: 28, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />

      <div className="relative container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-[#ff0000] text-xs font-semibold uppercase tracking-[0.3em]">
            Contact
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mt-3 mb-4">
            Let's Work <span className="text-[#ff0000]">Together</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#ff0000] to-transparent mx-auto mb-5" />
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Have a project in mind, a question, or just want to say hello?
            Drop me a message and I'll get back to you soon.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* LEFT — Contact Info */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-4 space-y-4"
          >
            {/* Info cards */}
            {contactInfo.map((info) => (
              <motion.div
                key={info.label}
                variants={item}
                whileHover={{ y: -4 }}
                className="group bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-[#ff0000]/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#ff0000]/10 group-hover:bg-[#ff0000]/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <info.icon className="text-[#ff0000] text-base" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-0.5">
                      {info.label}
                    </div>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-white text-sm font-medium hover:text-[#ff0000] transition-colors break-all"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <div className="text-white text-sm font-medium">{info.value}</div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Socials */}
            <motion.div
              variants={item}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-5"
            >
              <div className="text-xs uppercase tracking-wider text-gray-500 mb-4 text-center">
                Find me on
              </div>
              <div className="flex justify-center gap-3">
                {socials.map(({ icon: Icon, url, label }) => (
                  <motion.a
                    key={label}
                    href={url}
                    target={url.startsWith('http') ? '_blank' : undefined}
                    rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={label}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/10 hover:bg-[#ff0000] hover:border-[#ff0000] flex items-center justify-center transition-colors duration-300 group shadow-lg shadow-transparent hover:shadow-[#ff0000]/30"
                  >
                    <Icon className="text-gray-400 group-hover:text-white text-base transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Availability */}
            <motion.div
              variants={item}
              className="bg-green-500/[0.07] border border-green-500/20 rounded-2xl p-4"
            >
              <div className="flex items-center justify-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-green-400 text-sm font-medium">
                  Available for new projects
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT — Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10 overflow-hidden">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff0000] to-transparent" />

              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Send a Message
                </h2>
                <p className="text-gray-400 text-sm">
                  Fill out the form below — I'll reply within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name <span className="text-[#ff0000]">*</span>
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none" />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                        placeholder="John Doe"
                        autoComplete="name"
                        className={`pl-11 ${inputClass('name')}`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <FaExclamationCircle className="text-[10px]" /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address <span className="text-[#ff0000]">*</span>
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        placeholder="john@example.com"
                        autoComplete="email"
                        className={`pl-11 ${inputClass('email')}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <FaExclamationCircle className="text-[10px]" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject <span className="text-[#ff0000]">*</span>
                  </label>
                  <div className="relative">
                    <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none" />
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      onFocus={() => setFocused('subject')}
                      onBlur={() => setFocused(null)}
                      placeholder="Project Inquiry"
                      className={`pl-11 ${inputClass('subject')}`}
                    />
                  </div>
                  {errors.subject && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <FaExclamationCircle className="text-[10px]" /> {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">
                      Message <span className="text-[#ff0000]">*</span>
                    </label>
                    <span className={`text-xs ${form.message.length > MESSAGE_LIMIT ? 'text-red-400' : 'text-gray-500'}`}>
                      {form.message.length}/{MESSAGE_LIMIT}
                    </span>
                  </div>
                  <div className="relative">
                    <FaCommentDots className="absolute left-4 top-4 text-gray-500 text-sm pointer-events-none" />
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused(null)}
                      rows={6}
                      maxLength={MESSAGE_LIMIT}
                      placeholder="Tell me about your project..."
                      className={`pl-11 resize-none ${inputClass('message')}`}
                    />
                  </div>
                  {errors.message && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <FaExclamationCircle className="text-[10px]" /> {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.99 }}
                  className={`w-full py-4 bg-gradient-to-r from-[#ff0000] to-[#cc0000] text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-transparent ${
                    loading
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:shadow-[#ff0000]/40'
                  }`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </motion.button>

                {/* Success message */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
                  >
                    <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-green-400 font-medium text-sm">
                        Message sent successfully
                      </div>
                      <div className="text-green-400/70 text-xs mt-0.5">
                        Thanks for reaching out — I'll reply soon.
                      </div>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}