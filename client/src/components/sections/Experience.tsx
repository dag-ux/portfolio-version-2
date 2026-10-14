import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { getExperiences } from '../../services/api';

interface Experience {
  _id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  techStack: string[];
}

export default function Experience() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExperiences()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

  if (loading) {
    return (
      <section id="experience" className="py-20 px-4 sm:px-6 bg-black">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-2 border-white/10 border-t-[#ff0000] rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 bg-black">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Work Experience</h2>
          <div className="w-16 h-1 bg-[#ff0000] mx-auto mb-4" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            My professional journey and the companies I've worked with
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 sm:left-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#ff0000] via-[#ff0000]/40 to-transparent" />

          <div className="space-y-8">
            {items.map((exp, idx) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative pl-12 sm:pl-16"
              >
                <div className="absolute left-0 sm:left-1 top-2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black border-2 border-[#ff0000] flex items-center justify-center">
                  <FaBriefcase className="text-[#ff0000] text-xs" />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-[#ff0000]/30 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">{exp.position}</h3>
                      <p className="text-[#ff0000] font-medium">{exp.company}</p>
                    </div>
                    {exp.current && (
                      <span className="self-start text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-gray-400 mb-4">
                    <span className="inline-flex items-center gap-1.5">
                      <FaCalendarAlt className="text-[#ff0000]" />
                      {fmt(exp.startDate)} — {exp.current ? 'Present' : fmt(exp.endDate)}
                    </span>
                    {exp.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-[#ff0000]" />
                        {exp.location}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{exp.description}</p>

                  {exp.achievements?.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {exp.achievements.map((a, i) => (
                        <li key={i} className="text-sm text-gray-400 flex gap-2.5">
                          <span className="text-[#ff0000] mt-1.5 flex-shrink-0">▸</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                      {exp.techStack.map((t) => (
                        <span key={t} className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:border-[#ff0000]/30 hover:text-white transition-colors">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
