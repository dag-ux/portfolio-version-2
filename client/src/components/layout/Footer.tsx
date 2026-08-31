import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 py-8 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Dagimawit Kebede. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Made with</span>
            <FaHeart className="text-[#ff0000] text-sm animate-pulse" />
            <span>in Ethiopia</span>
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com/dag-ux"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaGithub className="text-lg" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaLinkedin className="text-lg" />
            </a>
            <a
              href="mailto:dagimawit@example.com"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaEnvelope className="text-lg" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}