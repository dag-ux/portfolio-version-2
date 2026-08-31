import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 bg-[#0a0a0a]">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Image */}
          <div className="flex justify-center order-2 md:order-1">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ff0000] to-[#ff4444] rounded-2xl blur opacity-30" />
              <img
                src="/src/assets/my photo.jpg"
                alt="Dagimawit Kebede"
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl object-cover border-2 border-white/10"
              />
              {/* Decorative dots */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#ff0000]/20 rounded-full blur-xl" />
              <div className="absolute -top-4 -left-4 w-12 h-12 border-2 border-[#ff0000]/30 rounded-full" />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">About Me</h2>
            <div className="w-16 h-1 bg-[#ff0000] mb-6" />

            <p className="text-gray-300 text-base leading-relaxed mb-4">
              I'm a 5th-year Computer Science student at <strong className="text-white">Haramaya University</strong> 
              with a deep passion for building full-stack applications that solve real-world problems.
            </p>

            <p className="text-gray-300 text-base leading-relaxed mb-4">
              I completed a <strong className="text-white">4-month internship at INSA</strong>, where I gained 
              hands-on experience in system design, development, and deployment.
            </p>

            <p className="text-gray-300 text-base leading-relaxed">
              I'm particularly interested in building systems that bridge the gap between 
              technology and society, using modern frameworks and tools to create scalable, 
              maintainable, and user-friendly solutions.
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ff0000]">5th</div>
                <div className="text-xs text-gray-500">Year Student</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ff0000]">4</div>
                <div className="text-xs text-gray-500">Months Internship</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ff0000]">10+</div>
                <div className="text-xs text-gray-500">Projects</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}