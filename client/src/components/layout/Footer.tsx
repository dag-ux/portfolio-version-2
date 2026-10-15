import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaGithub, FaLinkedin, FaEnvelope, FaHeart,
  FaArrowUp, FaMapMarkerAlt, FaCode,
} from 'react-icons/fa';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
];

const socials = [
  { icon: FaGithub, href: 'https://github.com/dag-ux', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/dagimawit-kebede', label: 'LinkedIn' },
  { icon: FaEnvelope, href: 'mailto:kebededagimawit@gmail.com', label: 'Email' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black border-t border-white/10 overflow-hidden">
      {/* Subtle top glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,0,0,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ===== MAIN FOOTER ===== */}
        <div className="py-12 sm:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* BRAND */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block group">
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                <span className="text-[#ff0000] group-hover:animate-pulse">D</span>agimawit
              </span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Full-Stack Developer passionate about building modern, scalable web applications
              that solve real-world problems. Currently studying Software Engineering at
              Haramaya University.
            </p>

            {/* Socials */}
            <div className="flex gap-3 pt-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/[0.03] hover:bg-[#ff0000] flex items-center justify-center transition-colors duration-300 border border-white/10 hover:border-[#ff0000] group shadow-lg shadow-transparent hover:shadow-[#ff0000]/30"
                >
                  <Icon className="text-gray-400 group-hover:text-white text-sm transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#ff0000] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Get in Touch
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:kebededagimawit@gmail.com"
                  className="group flex items-start gap-3 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#ff0000]/10 group-hover:bg-[#ff0000]/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <FaEnvelope className="text-[#ff0000] text-xs" />
                  </div>
                  <span className="break-all pt-1.5">kebededagimawit@gmail.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <div className="w-8 h-8 rounded-lg bg-[#ff0000]/10 flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-[#ff0000] text-xs" />
                  </div>
                  <span className="pt-1.5">Addis Ababa, Ethiopia</span>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                  </div>
                  <span className="pt-1.5">Available for work</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ===== DIVIDER ===== */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ===== BOTTOM BAR ===== */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
            &copy; {currentYear}{' '}
            <span className="text-gray-300 font-medium">Dagimawit Kebede</span>. All rights reserved.
          </p>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
            <span>Made with</span>
            <FaHeart className="text-[#ff0000] text-xs animate-pulse" />
            <span>in Ethiopia</span>
            <span className="w-1 h-1 rounded-full bg-gray-700" />
            <span className="inline-flex items-center gap-1">
              <FaCode className="text-[10px]" />
              React + TypeScript
            </span>
          </div>

          {/* Back to top */}
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="w-9 h-9 rounded-full bg-white/[0.03] hover:bg-[#ff0000] flex items-center justify-center transition-colors duration-300 border border-white/10 hover:border-[#ff0000] group"
            aria-label="Back to top"
          >
            <FaArrowUp className="text-gray-400 group-hover:text-white text-xs transition-colors" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}