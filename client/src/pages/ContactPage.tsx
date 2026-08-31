// client/src/pages/ContactPage.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaGithub, 
  FaLinkedin, 
  FaTwitter,
  FaTelegram,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner
} from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { sendMessage } from '../services/api';

export default function ContactPage() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    subject: '', 
    message: '' 
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Auto-hide notifications after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);
    setErrorMessage('');

    // Client-side validation
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setError(true);
      setErrorMessage('All fields are required');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError(true);
      setErrorMessage('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await sendMessage(form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(true);
      setErrorMessage(err?.message || 'Failed to send message. Please try again.');
      console.error('Contact form error:', err);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      label: 'Email',
      value: 'kebededagimawit@gmail.com',
      href: 'mailto:kebededagimawit@gmail.com',
      color: 'hover:border-[#ff0000]/30'
    },
    {
      icon: FaPhone,
      label: 'Phone',
      value: '+251 910 469 276',
      href: 'tel:+251910469276',
      color: 'hover:border-[#ff0000]/30'
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Location',
      value: 'Addis Ababa, Ethiopia',
      href: '#',
      color: 'hover:border-[#ff0000]/30'
    }
  ];

  const socialLinks = [
    { 
      icon: FaGithub, 
      url: 'https://github.com/dag-ux', 
      label: 'GitHub',
      color: 'hover:bg-[#ff0000]'
    },
    { 
      icon: FaLinkedin, 
      url: 'https://linkedin.com/in/dagimawit', 
      label: 'LinkedIn',
      color: 'hover:bg-[#ff0000]'
    },
    { 
      icon: FaTwitter, 
      url: 'https://twitter.com/dagimawit', 
      label: 'Twitter',
      color: 'hover:bg-[#ff0000]'
    },
    { 
      icon: FaTelegram, 
      url: 'https://t.me/dagimawit', 
      label: 'Telegram',
      color: 'hover:bg-[#ff0000]'
    }
  ];

  return (
    <section className="min-h-screen py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-black to-gray-900">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[#ff0000] to-[#ff4444] mx-auto mb-4 rounded-full" />
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Have a question or want to work together? Let's connect and create something amazing!
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Contact Info - Left Side */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Contact Cards */}
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
                className={`group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 ${item.color} hover:scale-[1.02] hover:shadow-xl hover:shadow-[#ff0000]/5`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#ff0000]/10 rounded-xl flex items-center justify-center group-hover:bg-[#ff0000]/20 transition-all duration-300 flex-shrink-0">
                    <item.icon className="text-[#ff0000] text-xl group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium mb-1">{item.label}</h4>
                    {item.href ? (
                      <a 
                        href={item.href} 
                        className="text-gray-400 hover:text-[#ff0000] transition-colors duration-300 text-sm sm:text-base break-all"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-gray-400 text-sm sm:text-base">{item.value}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <h4 className="text-white font-medium mb-4 text-center">Connect With Me</h4>
              <div className="flex flex-wrap justify-center gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 ${social.color} hover:border-[#ff0000] group`}
                    aria-label={social.label}
                  >
                    <social.icon className="text-gray-400 group-hover:text-white transition-colors duration-300 text-lg" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-medium">Available for opportunities</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-8"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <HiOutlineMail className="text-[#ff0000]" />
                Send a Message
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                I'll get back to you within 24 hours
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name <span className="text-[#ff0000]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`w-full bg-black/50 border ${focusedField === 'name' ? 'border-[#ff0000] ring-2 ring-[#ff0000]/20' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-300`}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address <span className="text-[#ff0000]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`w-full bg-black/50 border ${focusedField === 'email' ? 'border-[#ff0000] ring-2 ring-[#ff0000]/20' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-300`}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject <span className="text-[#ff0000]">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full bg-black/50 border ${focusedField === 'subject' ? 'border-[#ff0000] ring-2 ring-[#ff0000]/20' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-300`}
                    placeholder="Project Inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message <span className="text-[#ff0000]">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    required
                    rows={6}
                    className={`w-full bg-black/50 border ${focusedField === 'message' ? 'border-[#ff0000] ring-2 ring-[#ff0000]/20' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none`}
                    placeholder="Tell me about your project..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`w-full py-4 bg-gradient-to-r from-[#ff0000] to-[#cc0000] text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-[#ff0000]/30 hover:scale-[1.02]'
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

                {/* Status Messages */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400"
                  >
                    <FaCheckCircle className="text-green-400 flex-shrink-0" />
                    <span>Message sent successfully! I'll get back to you soon.</span>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
                  >
                    <FaExclamationCircle className="text-red-400 flex-shrink-0" />
                    <span>{errorMessage || 'Failed to send message. Please try again.'}</span>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm">
            I typically respond within 24 hours. Looking forward to hearing from you!
          </p>
        </motion.div>
      </div>
    </section>
  );
}