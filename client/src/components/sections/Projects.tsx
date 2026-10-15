import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaGithub, FaExternalLinkAlt, FaExclamationTriangle,
  FaFolder, FaStar, FaArrowRight,
} from 'react-icons/fa';
import { getProjects, API_BASE_URL } from '../../services/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  // Show only first 6 on home page
  const displayedProjects = projects.slice(0, 6);
  const hasMore = projects.length > 6;

  return (
    <section id="projects" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      {/* Animated glow */}
      <motion.div
        className="pointer-events-none absolute top-1/3 -right-40 w-[28rem] h-[28rem] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,0,0.1) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
        animate={{ x: [0, -60, 40, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-[#ff0000] text-xs font-semibold uppercase tracking-[0.3em]">
            My Work
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Featured <span className="text-[#ff0000]">Projects</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#ff0000] to-transparent mx-auto mb-4" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            A selection of projects I've built to solve real-world problems
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState error={error} />
        ) : projects.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayedProjects.map((project) => (
                <ProjectCard key={project._id} project={project} imageUrl={getImageUrl(project.image)} />
              ))}
            </motion.div>

            {/* View all CTA */}
            {(hasMore || projects.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <Link
                  to="/projects"
                  className="group inline-flex items-center gap-2 px-6 py-3 border-2 border-[#ff0000] hover:bg-[#ff0000] text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  {hasMore ? `View All Projects (${projects.length})` : 'View All Projects'}
                  <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// ==================== CARD ====================
function ProjectCard({ project, imageUrl }: { project: Project; imageUrl: string }) {
  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-[#ff0000]/40 transition-all duration-300 shadow-lg shadow-transparent hover:shadow-[#ff0000]/10 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-video bg-black/50 overflow-hidden">
        <img
          src={imageUrl}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect fill="%231a1a1a" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23ff0000" font-family="sans-serif" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ff0000] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-[#ff0000]/50">
            <FaStar className="text-[9px]" />
            Featured
          </div>
        )}

        {/* Hover action icons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          {project.githubUrl && project.githubUrl !== '#' && (
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
          {project.liveUrl && project.liveUrl !== '#' && (
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
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#ff0000] transition-colors">
          {project.title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Tech stack */}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 4).map((tech) => {
              const cleanTech = String(tech).replace(/[\[\]"]/g, '').trim();
              return (
                <span
                  key={cleanTech}
                  className="text-[11px] px-2.5 py-1 bg-white/[0.05] border border-white/10 rounded-full text-gray-300 group-hover:border-[#ff0000]/20 transition-colors"
                >
                  {cleanTech}
                </span>
              );
            })}
            {project.techStack.length > 4 && (
              <span className="text-[11px] px-2.5 py-1 text-gray-500">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Bottom actions */}
        {(project.liveUrl || project.githubUrl) && (
          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            {project.liveUrl && project.liveUrl !== '#' && (
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
            {project.githubUrl && project.githubUrl !== '#' && (
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
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden animate-pulse"
        >
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
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center py-16"
    >
      <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-5">
        <FaFolder className="text-3xl text-gray-600" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
      <p className="text-gray-500 text-sm">Check back soon — I'm always building something new.</p>
    </motion.div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center py-16"
    >
      <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
        <FaExclamationTriangle className="text-3xl text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Failed to load projects</h3>
      <p className="text-gray-500 text-sm mb-6">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#ff0000] hover:bg-[#cc0000] text-white text-sm font-medium transition"
      >
        Try Again
      </button>
    </motion.div>
  );
}