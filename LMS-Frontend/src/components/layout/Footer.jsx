import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Footer() {
  const location = useLocation();
  const isAuthPage = location.pathname.includes('/auth');
  const isDashboard = location.pathname.includes('/dashboard');

  if (isAuthPage || isDashboard) return null;

return (
    /* 1. MATCHING NAVBAR BASE: Uses the exact #A51C30/90 Crimson with glass effect */
    <footer className="w-full border-t border-white/10 bg-[#A51C30]/100 backdrop-blur-md shadow-2xl">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* BRANDING: Exact match to Navbar Logo */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-serif font-bold text-2xl text-white tracking-tight">
              <ShieldCheck className="h-7 w-7 text-[#F2A900] drop-shadow-[0_0_8px_rgba(242,169,0,0.5)]" />
              <span>LAON ATHENAEUM</span>
            </Link>
            <p className="text-sm text-gray-200 font-serif italic leading-relaxed">
              Empowering the youth with honor and excellence through high-quality education.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="text-gray-300 hover:text-[#F2A900] transition-colors">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* LINKS: Serif & Muted White for consistency */}
          <div>
            <h3 className="font-serif font-bold uppercase tracking-widest text-[#F2A900] mb-4 text-xs">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-200 font-serif">
              <li><Link to="/courses" className="hover:text-white">Browse Courses</Link></li>
              <li><Link to="/mentors" className="hover:text-white">Find a Mentor</Link></li>
              <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold uppercase tracking-widest text-[#F2A900] mb-4 text-xs">Support</h3>
            <ul className="space-y-2 text-sm text-gray-200 font-serif">
              <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER: Input matches Auth Page styles */}
          <div>
            <h3 className="font-serif font-bold uppercase tracking-widest text-[#F2A900] mb-4 text-xs">Stay Updated</h3>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex h-10 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#F2A900]"
              />
              <button className="bg-white text-[#A51C30] h-10 px-4 rounded-lg text-sm font-serif font-bold hover:bg-gray-100 shadow-lg transform hover:-translate-y-1 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs font-serif tracking-widest text-gray-300 uppercase">
          © 2026 LAON ATHENAEUM. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}