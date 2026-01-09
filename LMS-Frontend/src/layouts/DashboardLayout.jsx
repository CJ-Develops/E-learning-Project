import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  LogOut,
  GraduationCap,
  FileText,
  Menu,
  X,
  User,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { cn, getRoleName, ROLES } from '../lib/utils';
import NotificationBell from '../components/notifications/NotificationBell';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const profileRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { role: ROLES.STUDENT, name: 'Guest User' });
  const roleName = getRoleName(user.role);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  const getNavItems = () => {
    const roleSpecific = {
      admin: [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: BookOpen, label: 'Curriculums', path: '/dashboard/courses' },
        { icon: Users, label: 'Scholars', path: '/dashboard/users' },
      ],
      teacher: [
        { icon: LayoutDashboard, label: 'Instructor Hub', path: '/dashboard' },
        { icon: BookOpen, label: 'My Courses', path: '/dashboard/courses' },
        { icon: FileText, label: 'Assignments', path: '/dashboard/assignments/manage' },
        { icon: GraduationCap, label: 'Evaluations', path: '/dashboard/assignments/grading' },
      ],
      student: [
        { icon: LayoutDashboard, label: 'Course Library', path: '/dashboard' },
        { icon: BarChart3, label: 'Grades', path: '/dashboard/student/grades' },
        { icon: FileText, label: 'Assignments', path: '/dashboard/assignments' },
      ]
    };
    return [...(roleSpecific[roleName] || []), { icon: Settings, label: 'Settings', path: '/dashboard/settings' }];
  };

return (
    <div className="min-h-screen bg-[#FDFCFB] flex font-serif relative overflow-hidden">
      
      {/* --- ENHANCED ANIMATED BUBBLES BACKGROUND --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Sharp and more opaque Crimson Blobs */}
        <div className="absolute top-[-5%] right-[-2%] w-[500px] h-[500px] bg-[#A51C30] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float-1 shadow-2xl"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[550px] h-[550px] bg-[#F2A900] rounded-full mix-blend-multiply filter blur-2xl opacity-35 animate-float-2 shadow-2xl"></div>
        
        {/* Extra Roaming Blobs */}
        <div className="absolute top-[20%] left-[15%] w-[300px] h-[300px] bg-[#801626] rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-float-4"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] bg-[#F2A900] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-5"></div>
        
        {/* Center Roaming Deep Maroon */}
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-[#5e0b16] rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-float-3"></div>
      </div>

      {/* Animation Styles - Faster and wider roaming paths */}
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(250px, 150px) scale(1.1); }
          66% { transform: translate(-150px, 300px) scale(0.9); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(-300px, -200px) scale(1.2); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(200px, -200px) scale(1.1); }
          66% { transform: translate(-200px, 150px) scale(0.95); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0) scale(0.9); }
          50% { transform: translate(300px, 250px) scale(1.1); }
        }
        @keyframes float-5 {
          0%, 100% { transform: translate(0, 0) scale(1.2); }
          33% { transform: translate(-200px, 200px) scale(1); }
          66% { transform: translate(200px, -150px) scale(1.1); }
        }
        .animate-float-1 { animation: float-1 22s infinite ease-in-out; }
        .animate-float-2 { animation: float-2 28s infinite ease-in-out; }
        .animate-float-3 { animation: float-3 24s infinite ease-in-out; }
        .animate-float-4 { animation: float-4 32s infinite ease-in-out; }
        .animate-float-5 { animation: float-5 26s infinite ease-in-out; }
      `}</style>

      {/* Sidebar - Maroon Theme */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#4a0d15] text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col shadow-2xl relative",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <Link to="/" className="font-bold text-xl flex items-center gap-3 tracking-tight group">
            <ShieldCheck className="h-7 w-7 text-[#F2A900] group-hover:rotate-12 transition-transform" />
            <span className="text-white font-serif">LAON <span className="text-[#F2A900]">ATHENAEUM</span></span>
          </Link>
          <button className="lg:hidden ml-auto p-2 hover:bg-white/10 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5 text-gray-300" />
          </button>
        </div>

        <div className="flex-1 px-4 py-8 overflow-y-auto">
          <p className="px-4 text-[10px] text-[#F2A900] uppercase tracking-[0.3em] font-bold mb-6 opacity-80">
            {roleName} Portal
          </p>
          
          <nav className="space-y-1">
            {getNavItems().map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all text-sm font-medium border-l-4",
                    isActive 
                      ? "bg-[#A51C30] text-white border-[#F2A900] shadow-lg shadow-black/20" 
                      : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-[#F2A900]" : "text-gray-400")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-white/10 bg-black/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-3 w-full rounded-xl text-gray-400 hover:text-white hover:bg-red-900/30 transition-all text-sm font-bold uppercase tracking-widest"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="h-20 bg-white/70 backdrop-blur-lg border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-6 flex-1">
            <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            
          </div>

          <div className="flex items-center gap-8">
            {/* Notification Bell */}
            <NotificationBell />

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 group focus:outline-none">
                <div className="h-10 w-10 rounded-xl bg-[#A51C30] text-white flex items-center justify-center font-bold text-sm shadow-lg group-hover:scale-105 transition-transform overflow-hidden ring-2 ring-transparent group-hover:ring-[#F2A900]/30">
                  {user.avatar ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" /> : user.name.charAt(0)}
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95">
                  <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
                    <p className="text-sm font-serif font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs font-serif italic text-gray-500 truncate">{user.email || 'scholar@athenaeum.edu'}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/dashboard/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-2.5 text-sm font-serif text-gray-700 hover:bg-gray-50 transition-colors">
                      <User className="h-4 w-4 text-gray-400" /> My Profile
                    </Link>
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 px-6 py-2.5 text-sm font-serif font-bold text-red-700 hover:bg-red-50 transition-colors">
                      <LogOut className="h-4 w-4" /> Terminate Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 lg:p-12 overflow-y-auto relative bg-transparent">
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
