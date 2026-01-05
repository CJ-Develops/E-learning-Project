import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BookOpen, User, GraduationCap, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

// Define roles locally to ensure they never break
const ROLE_OPTIONS = {
    STUDENT: 'student',
    FACULTY: 'faculty', // Changed from 'teacher' to match your UI
    ADMIN: 'admin'
};

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLE_OPTIONS.STUDENT);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 1. Get Values
    const firstName = e.target.elements.firstName.value;
    const lastName = e.target.elements.lastName.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const fullName = `${firstName} ${lastName}`;

    try {
        // 2. Send to Backend
        // We send 'selectedRole' directly because it is already a string ("student", "faculty", "admin")
        const response = await axios.post('http://127.0.0.1:8000/api/register', {
            name: fullName,
            email: email,
            password: password,
            role: selectedRole // <--- Sends "faculty" exactly
        });

        // 3. Success!
        console.log("Registration Success:", response.data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setIsLoading(false);
        navigate('/dashboard');

    } catch (error) {
        setIsLoading(false);
        console.error("Registration Failed:", error);
        const msg = error.response?.data?.message || "Registration failed. Please check your inputs.";
        alert(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 p-4 lg:p-8 animate-page-enter">
      
      {/* Animation Styles */}
      <style>{`
        @keyframes float-1 { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(300px, 150px) scale(1.1); } 66% { transform: translate(-100px, 300px) scale(0.9); } }
        @keyframes float-2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-300px, -200px) scale(1.2); } }
        @keyframes float-3 { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(200px, -200px) scale(1.1); } 66% { transform: translate(-200px, 100px) scale(0.95); } }
        @keyframes float-4 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(250px, 250px) scale(0.8); } }
        @keyframes float-5 { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(-150px, 150px) scale(1.2); } 66% { transform: translate(150px, -100px) scale(1.1); } }
        .animate-float-1 { animation: float-1 25s infinite ease-in-out; }
        .animate-float-2 { animation: float-2 30s infinite ease-in-out; }
        .animate-float-3 { animation: float-3 28s infinite ease-in-out; }
        .animate-float-4 { animation: float-4 35s infinite ease-in-out; }
        .animate-float-5 { animation: float-5 32s infinite ease-in-out; }
        @keyframes page-enter { 0% { opacity: 0; transform: scale(0.98); } 100% { opacity: 1; transform: scale(1); } }
        .animate-page-enter { animation: page-enter 0.4s ease-out forwards; }
      `}</style>

      {/* Background Bubbles (Same as Login) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#A51C30] rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float-1 shadow-2xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#F2A900] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-2 shadow-2xl"></div>
        <div className="absolute top-[30%] left-[30%] w-[400px] h-[400px] bg-[#5e0b16] rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-float-3 shadow-xl"></div>
        <div className="absolute top-[-5%] left-[10%] w-[300px] h-[300px] bg-[#fcd34d] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float-4"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-[#fda4af] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float-5"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-200 min-h-[800px]">
        
        {/* LEFT SIDE */}
        <div className="w-full lg:w-5/12 p-12 lg:p-16 flex flex-col justify-center border-r border-gray-100 relative">

          <Link to="/auth/login" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-[#A51C30] transition-colors text-xs font-serif font-bold tracking-widest uppercase">
            <ArrowLeft className="h-4 w-4" /> BACK TO LOGIN
          </Link>
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 bg-[#A51C30] text-white rounded-lg flex items-center justify-center shadow-md ring-4 ring-gray-100 transform hover:scale-105 transition-transform duration-300">
                <BookOpen className="h-7 w-7" />
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold tracking-tight text-gray-900 mb-2">Join ISKOLAR</h1>
            <p className="text-gray-500 font-serif italic">Start your journey of excellence.</p>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-3">I want to join as</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: ROLE_OPTIONS.STUDENT, label: 'Student', icon: User },
                { id: ROLE_OPTIONS.FACULTY, label: 'Faculty', icon: GraduationCap },
                { id: ROLE_OPTIONS.ADMIN, label: 'Admin', icon: ShieldCheck }
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 border rounded-lg transition-all duration-300",
                    selectedRole === role.id
                      ? "border-[#A51C30] bg-[#A51C30] text-white shadow-md transform -translate-y-1" 
                      : "border-gray-200 hover:border-gray-400 hover:text-[#A51C30] text-gray-500 bg-white hover:bg-gray-50"
                  )}
                >
                  <role.icon className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest font-serif">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 ml-1 font-serif uppercase tracking-wide">First Name</label>
                <Input name="firstName" type="text" placeholder="Jose" required className="py-5 px-4 rounded-lg bg-white" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 ml-1 font-serif uppercase tracking-wide">Last Name</label>
                <Input name="lastName" type="text" placeholder="Rizal" required className="py-5 px-4 rounded-lg bg-white" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 ml-1 font-serif uppercase tracking-wide">Email Address</label>
              <Input name="email" type="email" placeholder="jose@pup.edu.ph" required className="py-5 px-4 rounded-lg bg-white" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 ml-1 font-serif uppercase tracking-wide">Password</label>
              <Input name="password" type="password" required className="py-5 px-4 rounded-lg bg-white" />
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full py-6 bg-[#A51C30] text-white border border-[#A51C30] hover:bg-[#851626] font-serif font-bold text-lg rounded-lg shadow-md mt-2">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm font-serif">
            <span className="text-gray-500">Already a scholar? </span>
            <Link to="/auth/login" className="font-bold text-[#A51C30] hover:underline inline-flex items-center gap-1">
              Sign in <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:block relative w-7/12 bg-[#2b0a0f]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#A51C30]/90 via-[#4a0d15]/80 to-black/90 z-10" />
          <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Classic Library" className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-60"/>
          <div className="relative z-20 flex h-full flex-col justify-end p-16 text-white">
            <blockquote className="border-l-4 border-[#F2A900] pl-6 py-2">
                <p className="text-3xl italic text-gray-100 font-serif font-light drop-shadow-md">"Ang kabataan ang pag-asa ng bayan."</p>
                <footer className="mt-6 text-sm font-bold uppercase tracking-widest text-[#A51C30] bg-white inline-block px-3 py-1 shadow-sm rounded-sm">— Dr. Jose Rizal</footer>
            </blockquote>
          </div>
        </div>

      </div>
    </div>
  );
}