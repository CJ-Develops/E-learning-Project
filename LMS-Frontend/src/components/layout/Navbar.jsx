import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { AnimatePresence, motion } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname.includes('/auth');
  const isDashboard = location.pathname.includes('/dashboard');

  if (isAuthPage || isDashboard) return null;

  // Smooth scroll helper:
  const handleNav = (id) => {
    // If already on landing page, scroll directly
    if (location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Navigate to landing page and pass the section id in location state
      navigate('/', { state: { scrollTo: id } });
    }
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
            <BookOpen className="h-6 w-6" />
            <span>EduLearn</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleNav('home')}
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('courses')}
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Courses
            </button>
            <button
              onClick={() => handleNav('aboutUs')}
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => handleNav('mentors')}
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Mentors
            </button>
        
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <button onClick={() => handleNav('home')} className="text-sm font-medium py-2 text-left">
                Home
              </button>
              <button onClick={() => handleNav('courses')} className="text-sm font-medium py-2 text-left">
                Courses
              </button>
              <button onClick={() => handleNav('mentors')} className="text-sm font-medium py-2 text-left">
                Mentors
              </button>
              <button onClick={() => handleNav('about')} className="text-sm font-medium py-2 text-left">
                About
              </button>
              <hr />
              <div className="flex flex-col gap-2">
                <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button variant="secondary" className="w-full">Log in</Button>
                </Link>
                <Link to="/auth/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
