import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 bg-black">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Get in Touch</h2>
          <div className="w-16 h-1 bg-[#ff0000] mx-auto mb-4" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have a question or want to work together? Let's connect!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#ff0000]/30 transition-all">
              <div className="w-12 h-12 bg-[#ff0000]/20 rounded-full flex items-center justify-center mb-4">
                <FaEnvelope className="text-[#ff0000] text-xl" />
              </div>
              <h4 className="text-white font-medium mb-1">Email</h4>
              <a href="mailto:dagimawit@example.com" className="text-gray-400 hover:text-[#ff0000] transition">
                kebededagimawit@gmail.com
              </a>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#ff0000]/30 transition-all">
              <div className="w-12 h-12 bg-[#ff0000]/20 rounded-full flex items-center justify-center mb-4">
                <FaPhone className="text-[#ff0000] text-xl" />
              </div>
              <h4 className="text-white font-medium mb-1">Phone</h4>
              <a href="tel:+251900000000" className="text-gray-400 hover:text-[#ff0000] transition">
                +251910469276
              </a>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#ff0000]/30 transition-all">
              <div className="w-12 h-12 bg-[#ff0000]/20 rounded-full flex items-center justify-center mb-4">
                <FaMapMarkerAlt className="text-[#ff0000] text-xl" />
              </div>
              <h4 className="text-white font-medium mb-1">Location</h4>
              <p className="text-gray-400">Addis Ababa, Ethiopia</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff0000] focus:border-transparent transition"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff0000] focus:border-transparent transition"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff0000] focus:border-transparent transition resize-none"
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#ff0000] hover:bg-[#cc0000] text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#ff0000]/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
                {submitted && (
                  <p className="text-green-400 text-sm text-center">✅ Message sent successfully!</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}