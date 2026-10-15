import { motion } from 'framer-motion';
import {
  FaUser, FaGraduationCap, FaMapMarkerAlt, FaEnvelope,
  FaGithub, FaLinkedin, FaCode, FaServer, FaDatabase, FaCloud,
  FaBriefcase, FaHeart,
} from 'react-icons/fa';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const quickFacts = [
  { icon: FaUser, label: 'Dagimawit Kebede' },
  { icon: FaGraduationCap, label: '5th Year Student' },
  { icon: FaMapMarkerAlt, label: 'Ethiopia' },
  { icon: FaEnvelope, label: 'kebededagimawit@gmail.com' },
];

const stats = [
  { number: '5th', label: 'Year Student' },
  { number: '4', label: 'Months Internship' },
  { number: '10+', label: 'Projects Built' },
];

const services = [
  {
    icon: FaCode,
    title: 'Frontend Development',
    description: 'Building responsive, modern UIs with React, TypeScript & Tailwind CSS.',
  },
  {
    icon: FaServer,
    title: 'Backend Development',
    description: 'Creating scalable REST APIs with Node.js, Express & Laravel.',
  },
  {
    icon: FaDatabase,
    title: 'Database Design',
    description: 'Designing efficient schemas with MongoDB, PostgreSQL & MySQL.',
  },
  {
    icon: FaCloud,
    title: 'Deployment & DevOps',
    description: 'Deploying full-stack apps on Vercel, Render, Docker & AWS.',
  },
];

const techStack = ['React', 'Laravel', 'Node.js', 'TypeScript', 'Tailwind CSS', 'MongoDB'];

export default function AboutPage() {
  return (
    <section className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="pointer-events-none absolute -top-40 -left-40 w-[30rem] h-[30rem] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,0,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{ x: [0, 60, -30, 0], y: [0, -40, 50, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,80,80,0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        animate={{ x: [0, -50, 40, 0], y: [0, 50, -30, 0], scale: [1, 0.95, 1.1, 1] }}
        transition={{ duration: 28, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid pattern */}
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
        {/* ===== SECTION HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#ff0000] text-xs font-semibold uppercase tracking-[0.3em]">
            Get to know me
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mt-3 mb-4">
            About <span className="text-[#ff0000]">Me</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#ff0000] to-transparent mx-auto" />
        </motion.div>

        {/* ===== MAIN GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* LEFT: PHOTO */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex justify-center order-2 lg:order-1"
          >
            <div className="relative">
              {/* Glow behind photo */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff0000]/30 to-transparent rounded-3xl blur-2xl scale-110" />

              {/* Photo frame */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative w-64 h-80 sm:w-80 sm:h-96 md:w-96 md:h-[28rem] rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl"
              >
                <img
                  src="/profile.jpg"
                  alt="Dagimawit Kebede"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Bottom info bar inside photo */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ff0000] flex items-center justify-center shadow-lg shadow-[#ff0000]/50">
                      <FaBriefcase className="text-white text-sm" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm sm:text-base">Full-Stack Developer</div>
                      <div className="text-gray-300 text-xs">Haramaya University</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative corner accents */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-[#ff0000] rounded-tl-2xl"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-[#ff0000] rounded-br-2xl"
              />

              {/* Floating badges */}
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -top-4 -right-4 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 shadow-xl"
              >
                <div className="text-[#ff0000] font-bold text-lg leading-none">4+</div>
                <div className="text-gray-400 text-[10px] uppercase tracking-wider mt-0.5">Months exp</div>
              </motion.div>

              <motion.div
                initial={{ scale: 0, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -bottom-4 -left-4 bg-[#ff0000] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg shadow-[#ff0000]/50 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Available for work
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT: CONTENT */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="order-1 lg:order-2 space-y-6"
          >
            <motion.div variants={item}>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Dagimawit Kebede
              </h2>
              <p className="text-[#ff0000] text-lg font-medium flex items-center gap-2">
                <FaCode className="text-sm" />
                Full-Stack Developer
              </p>
            </motion.div>

            <motion.p variants={item} className="text-gray-300 text-base leading-relaxed">
              Software Engineering student at{' '}
              <span className="text-white font-semibold">Haramaya University</span> with a deep passion for
              building full-stack applications that solve real-world problems.
            </motion.p>

            <motion.p variants={item} className="text-gray-300 text-base leading-relaxed">
              Completed a{' '}
              <span className="text-white font-semibold">4-month internship at INSA</span>, gaining
              hands-on experience in system design, development, and deployment. I'm particularly
              interested in systems that bridge the gap between technology and society.
            </motion.p>

            {/* Quick facts grid */}
            <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {quickFacts.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#ff0000]/30 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#ff0000]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#ff0000]/20 transition-colors">
                    <Icon className="text-[#ff0000] text-sm" />
                  </div>
                  <span className="text-sm text-gray-300 truncate">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={item}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-[#ff0000]">{stat.number}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Socials */}
            <motion.div variants={item} className="flex gap-3 pt-2">
              <motion.a
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/dag-ux"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/[0.03] hover:bg-[#ff0000] flex items-center justify-center transition-colors duration-300 border border-white/10 hover:border-[#ff0000] group shadow-lg shadow-transparent hover:shadow-[#ff0000]/30"
                aria-label="GitHub"
              >
                <FaGithub className="text-gray-400 group-hover:text-white transition-colors" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.linkedin.com/in/dagimawit-kebede"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/[0.03] hover:bg-[#ff0000] flex items-center justify-center transition-colors duration-300 border border-white/10 hover:border-[#ff0000] group shadow-lg shadow-transparent hover:shadow-[#ff0000]/30"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-gray-400 group-hover:text-white transition-colors" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:kebededagimawit@gmail.com"
                className="w-11 h-11 rounded-full bg-white/[0.03] hover:bg-[#ff0000] flex items-center justify-center transition-colors duration-300 border border-white/10 hover:border-[#ff0000] group shadow-lg shadow-transparent hover:shadow-[#ff0000]/30"
                aria-label="Email"
              >
                <FaEnvelope className="text-gray-400 group-hover:text-white transition-colors" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* ===== WHAT I DO SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <span className="text-[#ff0000] text-xs font-semibold uppercase tracking-[0.3em]">
              What I Do
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
              Services & <span className="text-[#ff0000]">Expertise</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#ff0000]/40 transition-all duration-300 overflow-hidden"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff0000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-[#ff0000]/10 group-hover:bg-[#ff0000] flex items-center justify-center mb-4 transition-colors duration-300 shadow-lg shadow-transparent group-hover:shadow-[#ff0000]/30">
                    <service.icon className="text-[#ff0000] group-hover:text-white text-lg transition-colors" />
                  </div>
                  <h3 className="text-white font-semibold mb-2 group-hover:text-[#ff0000] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ===== TECH STACK ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <FaHeart className="text-[#ff0000] text-sm animate-pulse" />
            <span className="text-gray-400 text-sm">Tech I love working with</span>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-3xl mx-auto">
            {techStack.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.08, y: -2 }}
                className="px-4 py-2 text-sm font-medium bg-white/[0.03] border border-white/10 rounded-full text-gray-300 hover:border-[#ff0000] hover:text-white hover:bg-[#ff0000]/10 transition-all duration-300 cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}