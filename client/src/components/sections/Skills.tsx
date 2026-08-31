import { motion } from 'framer-motion';
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaJava,
  FaDatabase,
  FaCloud,
  FaCode,
} from 'react-icons/fa';
import {
  SiTypescript,
  SiTailwindcss,
  SiMongodb,
  SiExpress,
  SiLaravel,
  SiPostgresql,
  SiDocker,
  SiGit,
} from 'react-icons/si';

const Icon = ({ icon: IconComponent, className, size }: any) => (
  <IconComponent className={className} size={size} />
);

export default function Skills() {
  const skillCategories = [
    {
      name: 'Frontend',
      skills: [
        { name: 'React', icon: FaReact },
        { name: 'TypeScript', icon: SiTypescript },
        { name: 'Tailwind CSS', icon: SiTailwindcss },
        { name: 'JavaScript', icon: FaCode },
      ],
    },
    {
      name: 'Backend',
      skills: [
        { name: 'Node.js', icon: FaNodeJs },
        { name: 'Express.js', icon: SiExpress },
        { name: 'Laravel', icon: SiLaravel },
        { name: 'Python', icon: FaPython },
      ],
    },
    {
      name: 'Database',
      skills: [
        { name: 'MongoDB', icon: SiMongodb },
        { name: 'PostgreSQL', icon: SiPostgresql },
        { name: 'MySQL', icon: FaDatabase },
      ],
    },
    {
      name: 'DevOps & Tools',
      skills: [
        { name: 'Docker', icon: SiDocker },
        { name: 'Git', icon: SiGit },
        { name: 'AWS', icon: FaCloud },
        { name: 'Java', icon: FaJava },
      ],
    },
  ];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#ff0000]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#ff0000]/5"
            >
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                {category.name}
              </h3>
              <div className="space-y-3">
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-[#ff0000]/20 transition-colors">
                      <Icon
                        icon={skill.icon}
                        className="text-[#ff0000] text-sm group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <span className="text-sm">{skill.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}