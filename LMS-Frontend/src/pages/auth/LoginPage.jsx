import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BookOpen, User, GraduationCap, ShieldCheck, ArrowLeft } from 'lucide-react';
import { cn, ROLES } from '../../lib/utils';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState(ROLES.STUDENT);
  const navigate = useNavigate();

  // Demo credentials matching the SQL Dump
  const demoCredentials = {
    [ROLES.ADMIN]: { email: 'admin@lms.com', password: 'password', name: 'System Admin' },
    [ROLES.TEACHER]: { email: 'teacher@lms.com', password: 'password', name: 'Prof. Snape' },
    [ROLES.STUDENT]: { email: 'student@lms.com', password: 'password', name: 'Harry Potter' },
  };

  const handleDemoClick = (roleId) => {
    setSelectedDemoRole(roleId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate Login Logic
    setTimeout(() => {
      const email = e.target.email.value;
      let user = Object.values(demoCredentials).find(u => u.email === email);
      let role = selectedDemoRole;

      if (!user) {
        user = { name: 'New User', email: email };
      } else {
        const foundRole = Object.keys(demoCredentials).find(key => demoCredentials[key].email === email);
        if (foundRole) role = parseInt(foundRole);
      }

      const dbUser = {
        id: Math.floor(Math.random() * 1000),
        name: user.name,
        email: user.email,
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(dbUser));
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 p-4 lg:p-8 animate-page-enter">
      {/* ... rest of your caode ... */}
      
      {/* Animation Styles */}
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(300px, 150px) scale(1.1); }
          66% { transform: translate(-100px, 300px) scale(0.9); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-300px, -200px) scale(1.2); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(200px, -200px) scale(1.1); }
          66% { transform: translate(-200px, 100px) scale(0.95); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(250px, 250px) scale(0.8); }
        }
        @keyframes float-5 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-150px, 150px) scale(1.2); }
          66% { transform: translate(150px, -100px) scale(1.1); }
        }
        .animate-float-1 { animation: float-1 25s infinite ease-in-out; }
        .animate-float-2 { animation: float-2 30s infinite ease-in-out; }
        .animate-float-3 { animation: float-3 28s infinite ease-in-out; }
        .animate-float-4 { animation: float-4 35s infinite ease-in-out; }
        .animate-float-5 { animation: float-5 32s infinite ease-in-out; }
        
        @keyframes page-enter {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-page-enter { animation: page-enter 0.4s ease-out forwards; }
      `}</style>

      {/* 1. ANIMATED BUBBLES (6 Blobs - Crimson & Gold Theme) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#A51C30] rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float-1 shadow-2xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#F2A900] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-2 shadow-2xl"></div>
        <div className="absolute top-[30%] left-[30%] w-[400px] h-[400px] bg-[#5e0b16] rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-float-3 shadow-xl"></div>
        <div className="absolute top-[-5%] left-[10%] w-[300px] h-[300px] bg-[#fcd34d] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float-4"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-[#fda4af] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float-5"></div>
        <div className="absolute top-[40%] right-[30%] w-[200px] h-[200px] bg-[#A51C30] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-2 animation-delay-2000"></div>
      </div>

      {/* 2. MAIN CARD CONTAINER - Added min-h-[800px] to fix size */}
      <div className="relative z-10 w-full max-w-7xl bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-200 min-h-[800px]">
        
        {/* LEFT SIDE - FORM - Standardized padding to p-12 lg:p-16 */}
        <div className="w-full lg:w-5/12 p-12 lg:p-16 flex flex-col justify-center border-r border-gray-100 relative">

        {/* Back Button */}
          <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-[#A51C30] transition-colors text-xs font-serif font-bold tracking-widest uppercase">
            <ArrowLeft className="h-4 w-4" /> BACK TO HOME
          </Link>
          
          {/* Header & Icon */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-[#A51C30] text-white rounded-lg flex items-center justify-center shadow-md ring-4 ring-gray-100 transform hover:scale-105 transition-transform duration-300">
                <ShieldCheck className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-900 mb-2">LAON ATHENAEUM</h1>
            <p className="text-lg text-gray-500 font-serif italic">Honor and Excellence.</p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { id: ROLES.STUDENT, label: 'Student', icon: User },
              { id: ROLES.TEACHER, label: 'Faculty', icon: GraduationCap },
              { id: ROLES.ADMIN, label: 'Admin', icon: BookOpen }
            ].map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleDemoClick(role.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 border rounded-lg transition-all duration-300",
                  selectedDemoRole === role.id
                    ? "border-[#A51C30] bg-[#A51C30] text-white shadow-md transform -translate-y-1" 
                    : "border-gray-200 hover:border-gray-400 hover:text-[#A51C30] text-gray-500 bg-white hover:bg-gray-50"
                )}
              >
                <role.icon className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest font-serif">{role.label}</span>
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 ml-1 font-serif uppercase tracking-wide">Email</label>
              <Input 
                type="email" 
                key={selectedDemoRole}
                defaultValue={demoCredentials[selectedDemoRole].email} 
                required 
                className="py-6 px-4 rounded-lg border-gray-300 focus:ring-1 focus:ring-[#A51C30] focus:border-[#A51C30] transition-all bg-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between ml-1">
                <label className="text-sm font-bold text-gray-900 font-serif uppercase tracking-wide">Password</label>
                <Link to="/auth/forgot-password" className="text-sm font-medium text-[#A51C30] hover:text-black hover:underline transition-all font-serif italic">
                  Forgot password?
                </Link>
              </div>
              <Input type="password" defaultValue="password" required className="py-6 px-4 rounded-lg border-gray-300 focus:ring-1 focus:ring-[#A51C30] focus:border-[#A51C30] transition-all bg-white" />
            </div>

            {/* Main Button */}
            <Button 
              type="submit" 
              isLoading={isLoading}
              className="w-full py-7 bg-[#A51C30] text-white border border-[#A51C30] hover:bg-[#851626] hover:border-[#851626] font-serif font-bold text-xl rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center text-sm font-serif">
            <span className="text-gray-500">New to the community? </span>
            <Link to="/auth/signup" className="font-bold text-[#A51C30] hover:underline hover:text-black transition-all">
              Apply for access
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE - IMAGE OVERLAY (PH x Harvard Theme) */}
        <div className="hidden lg:block relative w-7/12 bg-[#2b0a0f]">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#A51C30]/90 via-[#4a0d15]/80 to-black/90 z-10" />
          
          {/* Library Image with mix-blend-overlay */}
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="Classic Library" 
            className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-60"
          />
          
          <div className="relative z-20 flex h-full flex-col justify-end p-16 text-white">
            <div className="space-y-8">
              {/* REMOVED: White decorative line was here */}
              
              <blockquote className="border-l-4 border-[#F2A900] pl-6 py-2">
                <p className="text-3xl italic text-gray-100 font-serif font-light drop-shadow-md">"Ang kabataan ang pag-asa ng bayan."</p>
                <p className="text-xl text-gray-300 font-serif font-light mt-2">(The youth is the hope of the fatherland.)</p>
                <footer className="mt-6 text-sm font-bold uppercase tracking-widest text-[#A51C30] bg-white inline-block px-3 py-1 shadow-sm rounded-sm">— Dr. Jose Rizal</footer>
              </blockquote>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}