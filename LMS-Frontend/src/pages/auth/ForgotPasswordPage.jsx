import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BookOpen, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 p-4 lg:p-8 animate-page-enter">
      
      {/* --- ANIMATION STYLES (MATCHING LOGIN) --- */}
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
        @keyframes page-enter {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-float-1 { animation: float-1 25s infinite ease-in-out; }
        .animate-float-2 { animation: float-2 30s infinite ease-in-out; }
        .animate-float-3 { animation: float-3 28s infinite ease-in-out; }
        .animate-float-4 { animation: float-4 35s infinite ease-in-out; }
        .animate-float-5 { animation: float-5 32s infinite ease-in-out; }
        .animate-page-enter { animation: page-enter 0.4s ease-out forwards; }
      `}</style>

      {/* 1. BACKGROUND BUBBLES (Crimson & Gold) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#A51C30] rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float-1 shadow-2xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#F2A900] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-2 shadow-2xl"></div>
        <div className="absolute top-[30%] left-[30%] w-[400px] h-[400px] bg-[#5e0b16] rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-float-3 shadow-xl"></div>
        <div className="absolute top-[-5%] left-[10%] w-[300px] h-[300px] bg-[#fcd34d] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float-4"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-[#fda4af] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float-5"></div>
        <div className="absolute top-[40%] right-[30%] w-[200px] h-[200px] bg-[#A51C30] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-2 animation-delay-2000"></div>
      </div>

      {/* 2. MAIN CARD CONTAINER (Fixed Size) */}
      <div className="relative z-10 w-full max-w-7xl bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-200 min-h-[800px]">
        
        {/* LEFT SIDE - FORM */}
        <div className="w-full lg:w-5/12 p-12 lg:p-16 flex flex-col justify-center border-r border-gray-100 relative">
          
          {/* Back Button */}
          <Link to="/auth/login" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-[#A51C30] transition-colors text-sm font-serif font-bold tracking-wide">
            <ArrowLeft className="h-4 w-4" /> BACK TO LOGIN
          </Link>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 bg-[#A51C30] text-white rounded-lg flex items-center justify-center shadow-md ring-4 ring-gray-100 transform hover:scale-105 transition-transform duration-300">
                <BookOpen className="h-7 w-7" />
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold tracking-tight text-gray-900 mb-2">Reset PASSWORD</h1>
            <p className="text-gray-500 font-serif italic max-w-sm mx-auto">
              {!isSubmitted 
                ? "Enter your email address and we'll send you a link to reset your password." 
                : "Check your email for the reset link."}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold text-gray-900 ml-1 font-serif uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="student@pup.edu.ph" 
                    className="py-6 pl-12 pr-4 rounded-lg border-gray-300 focus:ring-1 focus:ring-[#A51C30] focus:border-[#A51C30] transition-all bg-white" 
                    required 
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-7 bg-[#A51C30] text-white border border-[#A51C30] hover:bg-[#851626] hover:border-[#851626] font-serif font-bold text-lg rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" 
                isLoading={isLoading}
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="space-y-6 animate-page-enter">
              <div className="bg-green-50 border border-green-100 rounded-lg p-6 flex flex-col items-center text-center space-y-3">
                <CheckCircle className="h-10 w-10 text-green-600" />
                <h3 className="font-serif font-bold text-green-900 text-lg">Link Sent Successfully!</h3>
                <p className="text-sm text-green-700 font-serif leading-relaxed">
                  We've sent a password reset link to your email. Please check your inbox and spam folder.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/auth/login')} 
                variant="outline" 
                className="w-full py-6 border-gray-300 text-gray-700 hover:border-[#A51C30] hover:text-[#A51C30] font-serif font-bold"
              >
                Return to Login
              </Button>
            </div>
          )}

          <div className="mt-8 text-center text-sm font-serif">
            <span className="text-gray-500">Remember your password? </span>
            <Link to="/auth/login" className="font-bold text-[#A51C30] hover:underline hover:text-black transition-all">
              Sign in
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE - IDENTICAL TO LOGIN (Consistent Theme) */}
        <div className="hidden lg:block relative w-7/12 bg-[#2b0a0f]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#A51C30]/90 via-[#4a0d15]/80 to-black/90 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="Classic Library" 
            className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-60"
          />
          
          <div className="relative z-20 flex h-full flex-col justify-end p-16 text-white">
            <div className="space-y-8">

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