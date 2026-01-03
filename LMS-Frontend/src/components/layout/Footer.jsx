import React from 'react';
import { BookOpen, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Footer() {
  const location = useLocation();
  const isAuthPage = location.pathname.includes('/auth');
  const isDashboard = location.pathname.includes('/dashboard');

  if (isAuthPage || isDashboard) return null;

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
              <BookOpen className="h-6 w-6" />
              <span>EduLearn</span>
            </Link>
            <p className="text-sm text-gray-500">
              Empowering students and teachers worldwide with accessible, high-quality education.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary-600"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-primary-600"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-primary-600"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-primary-600"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/courses" className="hover:text-primary-600">Browse Courses</Link></li>
              <li><Link to="/mentors" className="hover:text-primary-600">Find a Mentor</Link></li>
              <li><Link to="/pricing" className="hover:text-primary-600">Pricing</Link></li>
              <li><Link to="/business" className="hover:text-primary-600">For Business</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/help" className="hover:text-primary-600">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-primary-600">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-600">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-primary-600">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-500 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-600"
              />
              <button className="bg-primary-600 text-white h-9 px-4 rounded-md text-sm font-medium hover:bg-primary-700">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
          © 2025 EduLearn Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
