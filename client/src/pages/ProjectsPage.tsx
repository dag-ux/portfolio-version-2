import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGithub, FaExternalLinkAlt, FaSpinner, FaSearch,
  FaFolder, FaStar, FaFilter,
} from 'react-icons/fa';
import { getProjects, API_BASE_URL } from '../services/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return projects
      .filter((p) => (filter === 'featured' ? p.featured : true))
      .filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.techStack.some((t) => t.toLowerCase().includes(q))
        );
      });
  }, [projects, search, filter]);

  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <section className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      {/* Animated orbs */}
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#ff0000] text-xs font-semibold uppercase tracking-[0.3em]">
            My Work
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mt-3 mb-4">
            Featured <span className="text-[#ff0000]">Projects</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#ff0000] to-transparent mx-auto mb-4" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            A selection of projects I've built to solve real-world problems
          </p>
        </motion.div>

        {/* Controls */}
        {!loading && !error && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 mb-10"
          >
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects, technologies..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff0000]/50 focus:bg-white/[0.05] transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-[#ff0000] text-white shadow-lg shadow-[#ff0000]/30'
                    : 'bg-white/[0.03] border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:border-white/20'
                }`}
              >
                <FaFolder className="text-xs" />
                All ({projects.length})
              </button>
              <button
                onClick={() => setFilter('featured')}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  filter === 'featured'
                    ? 'bg-[#ff0000] text-white shadow-lg shadow-[#ff0000]/30'
                    : 'bg-white/[0.03] border border-white/10 text-gray-300 hover:bg-white/[0.06] hover:border-white/20'
                }`}
              >
                <FaStar className="text-xs" />
                Featured ({featuredCount})
              </button>
            </div>
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState onRetry={() => window.location.reload()} />
        ) : projects.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <NoResults onClear={() => { setSearch(''); setFilter('all'); }} />
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer count */}
        {!loading && !error && filtered.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-gray-500 mt-12"
          >
            Showing {filtered.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
          </motion.p>
        )}
      </div>
    </section>
  );
}

// ==================== CARD ====================
function ProjectCard({ project }: { project: Project }) {
  const imageSrc = project.image.startsWith('http')
    ? project.image
    : `${API_BASE_URL}${project.image}`;

  return (
    <motion.div
      layout
      variants={cardVariant}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-[#ff0000]/40 transition-all duration-300 shadow-lg shadow-transparent hover:shadow-[#ff0000]/10 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-video bg-black/50 overflow-hidden">
        <img
          src={imageSrc}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect fill="%231a1a1a" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23ff0000" font-family="sans-serif" font-size="24"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ff0000] text-white text-xs font-semibold shadow-lg shadow-[#ff0000]/50">
            <FaStar className="text-[10px]" />
            Featured
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#ff0000] transition-colors border border-white/10"
              aria-label="GitHub"
            >
              <FaGithub className="text-sm" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#ff0000] transition-colors border border-white/10"
              aria-label="Live demo"
            >
              <FaExternalLinkAlt className="text-xs" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[#ff0000] transition-colors">
          {project.title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Tech stack */}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[11px] px-2.5 py-1 bg-white/[0.05] border border-white/10 rounded-full text-gray-300 group-hover:border-[#ff0000]/20 transition-colors"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="text-[11px] px-2.5 py-1 text-gray-500">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Bottom action row */}
        {(project.liveUrl || project.githubUrl) && (
          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-[#ff0000] transition-colors group/link"
              >
                Live Demo
                <FaExternalLinkAlt className="text-[10px] transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors ml-auto"
              >
                <FaGithub className="text-xs" />
                Code
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ==================== SKELETON ====================
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden animate-pulse">
          <div className="aspect-video bg-white/5" />
          <div className="p-6 space-y-3">
            <div className="h-5 bg-white/5 rounded w-3/4" />
            <div className="h-3 bg-white/5 rounded" />
            <div className="h-3 bg-white/5 rounded w-5/6" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 bg-white/5 rounded-full w-16" />
              <div className="h-6 bg-white/5 rounded-full w-20" />
              <div className="h-6 bg-white/5 rounded-full w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== STATES ====================
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-5">
        <FaFolder className="text-3xl text-gray-600" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
      <p className="text-gray-500 text-sm">Check back soon — I'm always building something new.</p>
    </motion.div>
  );
}

function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-5">
        <FaFilter className="text-3xl text-gray-600" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No matching projects</h3>
      <p className="text-gray-500 text-sm mb-6">Try adjusting your search or filter.</p>
      <button
        onClick={onClear}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#ff0000] hover:bg-[#cc0000] text-white text-sm font-medium transition"
      >
        Clear filters
      </button>
    </motion.div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
        <FaSpinner className="text-3xl text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Failed to load projects</h3>
      <p className="text-gray-500 text-sm mb-6">There was a problem connecting to the server.</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#ff0000] hover:bg-[#cc0000] text-white text-sm font-medium transition"
      >
        Try again
      </button>
    </motion.div>
  );
}