import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaArrowRight, FaChevronDown,
} from 'react-icons/fa';

const RESUME_PATH = '/Dagimawit_Kebede_Modern_CV.pdf';

const useTypingEffect = (text: string, speed = 40) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return displayedText;
};

const socials = [
  { icon: FaGithub, href: 'https://github.com/dag-ux', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/dagimawit-kebede', label: 'LinkedIn' },
  { icon: FaEnvelope, href: 'mailto:kebededagimawit@gmail.com', label: 'Email' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
};

export default function Hero() {
  const typedText = useTypingEffect('Full-Stack Developer', 40);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-black overflow-hidden"
    >
      {/* Animated background orbs */}
      <motion.div
        className="pointer-events-none absolute top-1/4 left-1/4 w-[24rem] sm:w-[36rem] h-[24rem] sm:h-[36rem] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,0,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          willChange: 'transform',
        }}
        animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-1/4 right-1/4 w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,80,80,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          willChange: 'transform',
        }}
        animate={{ x: [0, -70, 50, 0], y: [0, 60, -40, 0], scale: [1, 0.9, 1.15, 1] }}
        transition={{ duration: 25, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-5xl mx-auto text-center z-10 py-20"
      >
        
        {/* Heading */}
        <motion.h1
          variants={item}
          className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-4 sm:mb-6 tracking-tight"
        >
          Hi, I'm{' '}
          <span className="relative inline-block">
            <span className="text-[#ff0000]">Dagimawit Kebede</span>
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-[#ff0000] via-[#ff0000] to-transparent rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{ transformOrigin: 'left' }}
              transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
            />
          </span>
        </motion.h1>

        {/* Typing effect */}
        <motion.p
          variants={item}
          className="text-lg sm:text-2xl md:text-3xl text-gray-300 font-medium mb-4 h-8 sm:h-10 flex items-center justify-center"
        >
          {typedText}
          <span className="ml-0.5 animate-pulse text-[#ff0000]">|</span>
        </motion.p>

        {/* Description */}
        <motion.p
          variants={item}
          className="text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 text-sm sm:text-base leading-relaxed px-4"
        >
          Software Engineering student at{' '}
          <span className="text-white font-medium">Haramaya University</span>
          <br className="hidden sm:block" />
          <span className="text-xs sm:text-sm text-gray-500">
            Passionate about building full-stack web applications
          </span>
        </motion.p>

        {/* Social icons */}
        <motion.div
          variants={item}
          className="flex justify-center gap-3 sm:gap-4 mb-8 sm:mb-10"
        >
          {socials.map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={label}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/[0.04] flex items-center justify-center border border-white/10 transition-colors duration-300 hover:bg-[#ff0000] hover:border-[#ff0000] hover:shadow-lg hover:shadow-[#ff0000]/40"
            >
              <Icon className="text-gray-300 group-hover:text-white text-base sm:text-lg transition-colors" />
            </motion.a>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 px-4"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 bg-[#ff0000] hover:bg-[#cc0000] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-[#ff0000]/20 hover:shadow-[#ff0000]/40 group"
          >
            View My Work
            <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
          </motion.a>

          <motion.a
            href={RESUME_PATH}
            download="Dagimawit-Kebede-CV.pdf"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 border-2 border-[#ff0000] hover:bg-[#ff0000] text-white font-semibold rounded-lg transition-all duration-300"
          >
            <FaDownload className="text-sm" />
            Download CV
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        aria-label="Scroll down"
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-gray-500 hover:text-[#ff0000] transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[10px] uppercase tracking-widest hidden sm:block">Scroll</span>
          <FaChevronDown className="text-sm" />
        </motion.div>
      </motion.a>
    </section>
  );
}