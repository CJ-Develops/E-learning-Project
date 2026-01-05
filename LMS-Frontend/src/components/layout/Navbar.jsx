import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShieldCheck } from 'lucide-react'; 
import { Button } from '../ui/Button';
import { AnimatePresence, motion } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname.includes('/auth');
  const isDashboard = location.pathname.includes('/dashboard');

  if (isAuthPage || isDashboard) return null;

  const handleNav = (id) => {
    if (location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
    setIsOpen(false);
  };

  return (
    /* 1. CONSISTENT COLOR: bg-[#A51C30]/90 provides that exact crimson at 90% opacity */
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#A51C30]/100 backdrop-blur-md shadow-2xl">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          
          {/* 2. BRANDING: Same #F2A900 Gold and Serif font as your Login Card */}
          <Link to="/" className="flex items-center gap-2 font-serif font-bold text-2xl text-white tracking-tight">
            <ShieldCheck className="h-7 w-7 text-[#F2A900] drop-shadow-[0_0_8px_rgba(242,169,0,0.6)]" /> 
            <span>LAON ATHENAEUM</span>
          </Link>

          {/* 3. NAV LINKS: Gray-200 for the muted academic look */}
          <div className="hidden md:flex items-center gap-8">
            {['home', 'courses', 'aboutUs', 'mentors'].map((item) => (
              <button
                key={item}
                onClick={() => handleNav(item)}
                className="group relative text-xs font-serif font-bold uppercase tracking-widest text-gray-200 hover:text-white transition-colors"
              >
                {item === 'aboutUs' ? 'About Us' : item}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#F2A900] transition-all group-hover:w-full shadow-[0_0_10px_#F2A900]" />
              </button>
            ))}
          </div>

          {/* 4. ACTIONS: White button with #A51C30 text and the -translate-y-1 lift */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth/login">
              <Button variant="ghost" className="font-serif font-bold text-white hover:bg-white/10 hover:text-white rounded-lg">
                Sign In
              </Button>
            </Link>
            <Link to="/auth/signup">
              <Button className="bg-white hover:bg-gray-100 text-[#A51C30] font-serif font-bold px-6 rounded-lg shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                Join Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <button className="md:hidden p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav - Using a slightly darker shade of the crimson for better depth */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-[#851626]"
          >
            <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
              {['home', 'courses', 'mentors', 'aboutUs'].map((item) => (
                <button 
                  key={item}
                  onClick={() => handleNav(item)} 
                  className="text-sm font-serif font-bold uppercase tracking-widest text-left text-gray-200 hover:text-[#F2A900]"
                >
                  {item === 'aboutUs' ? 'About Us' : item}
                </button>
              ))}
              <hr className="border-white/10" />
              <div className="flex flex-col gap-3">
                <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-white/20 text-white font-serif font-bold">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-[#F2A900] text-[#A51C30] font-serif font-bold">
                    Join Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}