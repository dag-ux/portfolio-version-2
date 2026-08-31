import { motion } from 'framer-motion';
import { FaUser, FaBriefcase, FaGraduationCap, FaCode, FaMapMarkerAlt, FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import myPhoto from '../assets/my photo.jpg';

const Icon = ({ icon: IconComponent, className, size }: any) => (
  <IconComponent className={className} size={size} />
);

export default function AboutPage() {
  return (
    <section className="min-h-screen py-20 px-4 sm:px-6 bg-black overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* ===== LEFT: IMAGE with Attractive Style ===== */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex justify-center order-2 lg:order-1"
          >
            <div className="relative">
              {/* Main Image with Pulse Glow */}
              <motion.div
                animate={{ 
                  boxShadow: ['0 0 20px rgba(255,0,0,0.1)', '0 0 40px rgba(255,0,0,0.2)', '0 0 20px rgba(255,0,0,0.1)'] 
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl"
              >
                <img
                  src={myPhoto}
                  alt="Dagimawit Kebede"
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </motion.div>

              {/* Decorative Rings */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute -top-4 -left-4 w-20 h-20 border-2 border-[#ff0000]/30 rounded-full"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-4 -right-4 w-20 h-20 border-2 border-[#ff0000]/30 rounded-full"
              />

              {/* Corner Accents */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#ff0000]/60 rounded-tl-lg"
              />
              <motion.div
                initial={{ scale: 0, rotate: 45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#ff0000]/60 rounded-br-lg"
              />

              {/* Status Badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-2 -right-2 bg-[#ff0000] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg shadow-[#ff0000]/50 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Available
              </motion.div>

              {/* Experience Badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -top-2 -left-2 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5 shadow-lg"
              >
                <span className="text-[#ff0000] font-bold text-sm">4+</span>
                <span className="text-gray-400 text-xs ml-1">months</span>
              </motion.div>
            </div>
          </motion.div>

          {/* ===== RIGHT: CONTENT ===== */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="order-1 lg:order-2 space-y-5"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="text-[#ff0000] text-xs font-semibold uppercase tracking-[0.2em]">About Me</span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-1">
                Dagimawit Kebede
              </h1>
              <p className="text-[#ff0000] text-lg font-medium">Full-Stack Developer</p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '3rem' }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="h-1 bg-[#ff0000] mt-3 rounded-full"
              />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-300 text-base leading-relaxed"
            >
              Software Engineering student at{' '}
              <span className="text-white font-semibold">Haramaya University</span> with a deep passion for
              building full-stack applications that solve real-world problems.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-gray-300 text-base leading-relaxed"
            >
              Completed a <span className="text-white font-semibold">4-month internship at INSA</span>,
              gaining hands-on experience in system design, development, and deployment.
            </motion.p>

            {/* Info Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2"
            >
              <div className="flex items-center gap-2 text-gray-400">
                <Icon icon={FaUser} className="text-[#ff0000] text-sm" />
                <span className="text-sm">Dagimawit Kebede</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Icon icon={FaGraduationCap} className="text-[#ff0000] text-sm" />
                <span className="text-sm">5th Year Student</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Icon icon={FaMapMarkerAlt} className="text-[#ff0000] text-sm" />
                <span className="text-sm">Ethiopia</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Icon icon={FaEnvelope} className="text-[#ff0000] text-sm" />
                <span className="text-sm">dagimawit@email.com</span>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10"
            >
              {[
                { number: '5th', label: 'Year Student' },
                { number: '4', label: 'Months Internship' },
                { number: '10+', label: 'Projects Built' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-[#ff0000]">{stat.number}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap gap-2 pt-2"
            >
              {['React', 'Laravel', 'Node.js', 'TypeScript', 'Tailwind CSS', 'MongoDB'].map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 1 + index * 0.05 }}
                  className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:border-[#ff0000]/30 hover:text-white transition-all duration-300 cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="flex gap-3 pt-2"
            >
              <a
                href="https://github.com/dag-ux"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#ff0000] flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10 hover:border-[#ff0000] group"
              >
                <FaGithub className="text-gray-400 group-hover:text-white text-sm transition-colors" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#ff0000] flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10 hover:border-[#ff0000] group"
              >
                <FaLinkedin className="text-gray-400 group-hover:text-white text-sm transition-colors" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}