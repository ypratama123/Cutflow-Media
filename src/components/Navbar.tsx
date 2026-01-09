import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import Button from './ui/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Workflow', href: '#workflow' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img
              src="https://i.imgur.com/y2qccQU.png"
              alt="CUTFLOW MEDIA Logo"
              className="h-12 w-auto"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-baseline space-x-6">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-300"
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="pl-6 border-l border-slate-700 flex items-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button size="sm" variant="primary">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white font-medium text-sm">
                    Masuk
                  </Link>
                  <Link to="/register">
                    <Button size="sm" variant="outline">Daftar</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium w-full text-left"
              >
                {item.name}
              </button>
            ))}

            <div className="pt-4 mt-2 border-t border-slate-700 flex flex-col gap-3 px-3">
              {user ? (
                <Link to="/dashboard" className="w-full">
                  <Button className="w-full">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white font-medium py-2 block">
                    Masuk
                  </Link>
                  <Link to="/register" className="w-full">
                    <Button className="w-full" variant="outline">Daftar</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;