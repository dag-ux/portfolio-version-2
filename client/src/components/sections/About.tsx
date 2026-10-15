import { motion } from 'framer-motion';
import { FaArrowRight, FaBriefcase, FaGraduationCap, FaCode } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const stats = [
  { number: '5th', label: 'Year Student' },
  { number: '4', label: 'Months Internship' },
  { number: '10+', label: 'Projects Built' },
];

const highlights = [
  { icon: FaGraduationCap, text: 'Haramaya University' },
  { icon: FaBriefcase, text: 'Ex-Intern @ INSA' },
  { icon: FaCode, text: 'Full-Stack Developer' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function About() {
  return (
    <section id="about" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      {/* Ambient glow */}
      <motion.div
        className="pointer-events-none absolute top-1/3 -left-40 w-[26rem] h-[26rem] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,0,0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{ x: [0, 50, -30, 0], y: [0, -40, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative container mx-auto max-w-6xl">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* ===== LEFT — IMAGE ===== */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="flex justify-center order-2 lg:order-1"
          >
            <div className="relative">
              {/* Soft glow behind photo */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff0000]/25 to-transparent rounded-3xl blur-2xl scale-110" />

              {/* Main photo frame */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative w-64 h-72 sm:w-80 sm:h-96 md:w-[22rem] md:h-[26rem] rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl"
              >
                <img
                  src="/profile.jpg"
                  alt="Dagimawit Kebede"
                  className="w-full h-full object-cover"
                />
                {/* Bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Info bar inside photo */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ff0000] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#ff0000]/50">
                      <FaCode className="text-white text-sm" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-semibold text-sm sm:text-base truncate">
                        Full-Stack Developer
                      </div>
                      <div className="text-gray-300 text-xs truncate">
                        Addis Ababa, Ethiopia
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Corner accents */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-[#ff0000] rounded-tl-2xl"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-[#ff0000] rounded-br-2xl"
              />

              {/* Floating badge — top right */}
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 10 }}
                whileInView={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="absolute -top-4 -right-4 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 shadow-xl"
              >
                <div className="text-[#ff0000] font-bold text-lg leading-none">4+</div>
                <div className="text-gray-400 text-[10px] uppercase tracking-wider mt-0.5">
                  Months exp
                </div>
              </motion.div>

              {/* Floating badge — bottom left */}
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 10 }}
                whileInView={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                viewport={{ once: true }}
                className="absolute -bottom-4 -left-4 bg-[#ff0000] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg shadow-[#ff0000]/50 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Available for work
              </motion.div>
            </div>
          </motion.div>

          {/* ===== RIGHT — CONTENT ===== */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Section heading */}
            <motion.div variants={item}>
              <span className="text-[#ff0000] text-xs font-semibold uppercase tracking-[0.3em]">
                About Me
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
                Turning Ideas into{' '}
                <span className="text-[#ff0000]">Reality</span>
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#ff0000] to-transparent rounded-full" />
            </motion.div>

            {/* Paragraphs */}
            <motion.p variants={item} className="text-gray-300 text-base leading-relaxed">
              I'm a 5th-year Computer Science student at{' '}
              <span className="text-white font-semibold">Haramaya University</span> with a deep
              passion for building full-stack applications that solve real-world problems.
            </motion.p>

            <motion.p variants={item} className="text-gray-300 text-base leading-relaxed">
              I completed a <span className="text-white font-semibold">4-month internship at INSA</span>,
              where I gained hands-on experience in system design, development, and deployment. I'm
              particularly interested in systems that bridge the gap between technology and society.
            </motion.p>

            {/* Highlight pills */}
            <motion.div variants={item} className="flex flex-wrap gap-2 pt-1">
              {highlights.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#ff0000]/30 transition-colors group"
                >
                  <Icon className="text-[#ff0000] text-xs" />
                  <span className="text-gray-300 text-xs font-medium group-hover:text-white transition-colors">
                    {text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={item}
              className="grid grid-cols-3 gap-4 py-6 border-t border-b border-white/10"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-[#ff0000]">
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={item} className="pt-2">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-[#ff0000] hover:bg-[#cc0000] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-[#ff0000]/20 hover:shadow-[#ff0000]/40 hover:-translate-y-0.5"
              >
                Learn More About Me
                <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}