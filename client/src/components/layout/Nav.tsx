import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Icon = ({ icon: IconComponent, className, size }: any) => (
  <IconComponent className={className} size={size} />
);

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-black/50 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              <span className="text-[#ff0000]">D</span>agimawit
            </span>
          </Link>

          {/* Desktop Navigation - Right Side */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 relative ${
                    active ? 'text-[#ff0000]' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-[#ff0000] rounded-full" />
                  )}
                  {!active && (
                    <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#ff0000] transition-all duration-300 group-hover:w-full" />
                  )}
                </Link>
              );
            })}

            {/* Resume Button */}
            <a
              href="/assets/resume.pdf"
              download
              className="px-5 py-2.5 text-sm font-medium text-white bg-[#ff0000] hover:bg-[#cc0000] rounded-lg transition-all duration-200"
            >
              Resume
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-xl p-2"
            aria-label="Toggle menu"
          >
            <Icon icon={isOpen ? FaTimes : FaBars} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-16 left-0 right-0 bottom-0 z-40 bg-black/95 backdrop-blur-md transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full px-6 space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-2xl font-semibold tracking-wide transition-colors duration-200 ${
                isActive(link.path) ? 'text-[#ff0000]' : 'text-white hover:text-[#ff0000]'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <a
            href="/assets/resume.pdf"
            download
            className="mt-4 px-8 py-3 text-white font-semibold bg-[#ff0000] hover:bg-[#cc0000] rounded-lg transition"
            onClick={() => setIsOpen(false)}
          >
            Download Resume
          </a>
        </div>
      </div>
    </nav>
  );
}