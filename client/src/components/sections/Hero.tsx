import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaArrowRight } from 'react-icons/fa';

const useTypingEffect = (text: string, speed: number = 80) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [index, text, speed]);

  return displayedText;
};

export default function Hero() {
  const typedText = useTypingEffect('Full-Stack Developer', 80);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 bg-black overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[36rem] h-[36rem] bg-[#ff0000]/10 rounded-full blur-[120px]" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center font-sans">
        {/* Eyebrow / status badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff0000] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff0000]" />
          </span>
          <span className="text-xs font-medium text-gray-300 tracking-wide">
            Open to opportunities
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 tracking-tight">
          Hi, I'm{' '}
          <span className="text-[#ff0000]">Dagimawit Kebede</span>
        </h1>

        {/* Typing effect */}
        <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-medium mb-4 h-9">
          {typedText}
          <span className="animate-pulse text-[#ff0000]">|</span>
        </p>

        {/* Description */}
        <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
          Software Engineering student at Haramaya University
          <br />
          <span className="text-sm text-gray-500">
            Passionate about building full-stack web applications
          </span>
        </p>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mb-8">
          <a
            href="https://github.com/dag-ux"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#ff0000] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 border border-white/10 hover:border-[#ff0000] hover:shadow-lg hover:shadow-[#ff0000]/30"
            aria-label="GitHub"
          >
            <FaGithub className="text-gray-300 hover:text-white text-lg" />
          </a>
          <a
            href="https://www.linkedin.com/in/dagimawit-kebede"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#ff0000] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 border border-white/10 hover:border-[#ff0000] hover:shadow-lg hover:shadow-[#ff0000]/30"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="text-gray-300 hover:text-white text-lg" />
          </a>
          <a
            href="mailto:kebededagimawit@gmail.com"
            className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#ff0000] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 border border-white/10 hover:border-[#ff0000] hover:shadow-lg hover:shadow-[#ff0000]/30"
            aria-label="Email"
          >
            <FaEnvelope className="text-gray-300 hover:text-white text-lg" />
          </a>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff0000] hover:bg-[#cc0000] text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#ff0000]/30 hover:-translate-y-0.5 active:scale-95 group"
          >
            View My Work
            <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="/assets/resume.pdf"
            download
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#ff0000] hover:bg-[#ff0000] text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
          >
            <FaDownload className="text-sm" />
            Download CV
          </a>
        </div>
      </div>
    </section>
  );
}