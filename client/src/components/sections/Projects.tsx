import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { getProjects } from '../../services/api';

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

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('🔍 Fetching projects...');
        const data = await getProjects();
        console.log('✅ Projects received:', data);
        setProjects(data);
        setLoading(false);
      } catch (err: any) {
        console.error('❌ Failed to fetch projects:', err);
        setError(err.message || 'Failed to load projects');
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // ✅ Get image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 px-4 sm:px-6 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex flex-col items-center justify-center h-40">
            <FaSpinner className="text-[#ff0000] text-4xl animate-spin mb-4" />
            <p className="text-gray-400">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 px-4 sm:px-6 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex flex-col items-center justify-center h-40">
            <FaExclamationTriangle className="text-[#ff0000] text-4xl mb-4" />
            <p className="text-gray-400">Failed to load projects</p>
            <p className="text-gray-500 text-sm mt-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#ff0000] text-white rounded-lg hover:bg-[#cc0000] transition"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 bg-[#0a0a0a]">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">My Projects</h2>
          <div className="w-16 h-1 bg-[#ff0000] mx-auto mb-4" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Some of the projects I've built to solve real-world problems
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>No projects yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => {
              const imageUrl = getImageUrl(project.image);
              
              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-black/50 border border-white/10 rounded-xl overflow-hidden hover:border-[#ff0000]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#ff0000]/5"
                >
                  <div className="overflow-hidden relative">
                    <img
                      src={imageUrl}
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        console.log(`⚠️ Image failed to load: ${imageUrl}`);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.map((tech) => {
                        let cleanTech = tech;
                        if (typeof tech === 'string') {
                          cleanTech = tech.replace(/[\[\]"]/g, '').trim();
                        }
                        return (
                          <span
                            key={cleanTech}
                            className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300"
                          >
                            {cleanTech}
                          </span>
                        );
                      })}
                    </div>
                    <div className="flex gap-4">
                      {project.githubUrl && project.githubUrl !== '#' && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <FaGithub className="text-xl" />
                        </a>
                      )}
                      {project.liveUrl && project.liveUrl !== '#' && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <FaExternalLinkAlt className="text-lg" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}