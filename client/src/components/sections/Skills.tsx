import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaReact, FaNodeJs, FaPython, FaJava, FaCloud, FaCode,
  FaHtml5, FaCss3Alt, FaVuejs, FaAngular, FaPhp
} from 'react-icons/fa';
import {
  SiTypescript, SiTailwindcss, SiMongodb, SiExpress, SiLaravel,
  SiPostgresql, SiDocker, SiGit, SiNextdotjs, SiRedis, SiMysql,
  SiNginx, SiJavascript, SiRedux, SiGraphql,
} from 'react-icons/si';
import { getSkills } from '../../services/api';

const Icon = ({ icon: IconComponent, className, size }: any) => (
  <IconComponent className={className} size={size} />
);

// Map skill names (case-insensitive) to icons
const ICON_MAP: Record<string, any> = {
  react: FaReact,
  'react.js': FaReact,
  typescript: SiTypescript,
  javascript: SiJavascript,
  'tailwind css': SiTailwindcss,
  tailwind: SiTailwindcss,
  'node.js': FaNodeJs,
  nodejs: FaNodeJs,
  'express.js': SiExpress,
  express: SiExpress,
  laravel: SiLaravel,
  php: FaPhp,
  python: FaPython,
  java: FaJava,
  mongodb: SiMongodb,
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  mysql: SiMysql,
  redis: SiRedis,
  docker: SiDocker,
  git: SiGit,
  github: SiGit,
  aws: FaCloud,
  
  nginx: SiNginx,
  nextjs: SiNextdotjs,
  'next.js': SiNextdotjs,
  redux: SiRedux,
  graphql: SiGraphql,
  html: FaHtml5,
  css: FaCss3Alt,
  vue: FaVuejs,
  angular: FaAngular,
};

function getIcon(name: string) {
  return ICON_MAP[name.toLowerCase().trim()] || FaCode;
}

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  devops: 'DevOps & Tools',
  mobile: 'Mobile',
  other: 'Other',
};

const CATEGORY_ORDER = ['frontend', 'backend', 'database', 'devops', 'mobile', 'other'];

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getSkills()
      .then((data) => {
        setSkills(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Skills fetch failed:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  const grouped: Record<string, Skill[]> = {};
  skills.forEach((s) => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 bg-black">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">My Skills</h2>
          <div className="w-16 h-1 bg-[#ff0000] mx-auto mb-4" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Technologies and tools I work with to build amazing applications
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-2 border-white/10 border-t-[#ff0000] rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Failed to load skills. Please refresh.</p>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No skills added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORY_ORDER.filter((cat) => grouped[cat]?.length).map((cat, idx) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#ff0000]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#ff0000]/5"
              >
                <h3 className="text-lg font-semibold text-white mb-4 text-center">
                  {CATEGORY_LABELS[cat] || cat}
                </h3>
                <div className="space-y-3">
                  {grouped[cat].map((skill) => {
                    const IconComponent = getIcon(skill.name);
                    return (
                      <div
                        key={skill._id}
                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                      >
                        <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-[#ff0000]/20 transition-colors">
                          <Icon
                            icon={IconComponent}
                            className="text-[#ff0000] text-sm group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <span className="text-sm">{skill.name}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}