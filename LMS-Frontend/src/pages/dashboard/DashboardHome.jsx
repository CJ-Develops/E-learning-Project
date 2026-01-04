import React from 'react';
import { Button } from '../../components/ui/Button';
import { ROLES } from '../../lib/utils';
import { Clock, BookOpen, Users, TrendingUp, GraduationCap, AlertCircle, PlayCircle, CheckCircle, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardHome() {
  const user = JSON.parse(localStorage.getItem('user')) || { role: ROLES.STUDENT, name: 'Guest' };

  // --- COMMON HEADER COMPONENT ---
  const DashboardHeader = ({ title, subtitle }) => (
    <div className="mb-8 border-l-4 border-[#A51C30] pl-6 py-2">
      <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">{title}</h1>
      <p className="text-gray-500 font-serif italic">{subtitle}</p>
    </div>
  );

  // --- ADMIN DASHBOARD ---
  if (user.role === ROLES.ADMIN) {
    return (
      <div className="space-y-8 animate-page-enter">
        <DashboardHeader 
          title="Chancellor's Overview" 
          subtitle="System-wide management and institutional analytics." 
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard icon={<Users className="h-6 w-6 text-[#A51C30]" />} label="Total Scholars" value="1,234" color="bg-[#A51C30]/5" />
          <StatsCard icon={<BookOpen className="h-6 w-6 text-[#A51C30]" />} label="Active Curriculums" value="42" color="bg-[#A51C30]/5" />
          <StatsCard icon={<GraduationCap className="h-6 w-6 text-[#F2A900]" />} label="Faculty Members" value="89" color="bg-[#F2A900]/5" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldCheck className="h-24 w-24 text-[#A51C30]" />
          </div>
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#A51C30]" /> Recent Institutional Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-all border-b border-gray-100 last:border-0">
                <div className="h-10 w-10 rounded-full bg-[#A51C30]/10 flex items-center justify-center text-[#A51C30]">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-serif font-bold text-gray-900">New Scholar Matriculation</p>
                  <p className="text-xs text-gray-500 font-serif">2 minutes ago • ID: ATH-2026-{1000 + i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- TEACHER DASHBOARD ---
  if (user.role === ROLES.TEACHER) {
    return (
      <div className="space-y-8 animate-page-enter">
        <DashboardHeader 
          title={`Welcome, Prof. ${user.name.split(' ').pop()}`} 
          subtitle="Manage your lecture halls and evaluate scholarly progress." 
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard icon={<Users className="h-6 w-6 text-[#A51C30]" />} label="Enrolled Scholars" value="156" color="bg-[#A51C30]/5" />
          <StatsCard icon={<AlertCircle className="h-6 w-6 text-orange-600" />} label="Pending Evaluations" value="12" color="bg-orange-50" />
          <StatsCard icon={<Star className="h-6 w-6 text-[#F2A900]" />} label="Instructional Rating" value="4.9/5.0" color="bg-[#F2A900]/5" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Awaiting Evaluation</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#A51C30]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-[#A51C30] text-white flex items-center justify-center font-serif font-bold text-sm">
                      {i}
                    </div>
                    <div>
                      <p className="text-sm font-serif font-bold text-gray-900">Thesis Defense Draft</p>
                      <p className="text-xs text-gray-500 italic">Submitted by Scholar #{i + 1200}</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-[#A51C30] hover:bg-[#851626] text-white font-serif">Evaluate</Button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
               <Clock className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-serif font-bold text-gray-900">Lecture Schedule</h3>
            <p className="text-gray-400 font-serif italic max-w-[200px]">No live sessions currently scheduled for today.</p>
          </div>
        </div>
      </div>
    );
  }

// --- STUDENT DASHBOARD ---
  const myCourses = [
    { id: 7, title: "Advanced PHP & MySQL", image: "https://www.onlineconceptclasses.com/wp-content/uploads/2023/05/pexels-tima-miroshnichenko-5380664-scaled.jpg.webp", progress: 70, timeLeft: "2h 45m left", modules: "12 Modules" },
    { id: 8, title: "React Fundamentals", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600", progress: 35, timeLeft: "5h 10m left", modules: "8 Modules" },
    { id: 9, title: "UI/UX Design Principles", image: "https://www.andacademy.com/resources/wp-content/uploads/2024/02/image20.jpg", progress: 10, timeLeft: "8h 20m left", modules: "15 Modules" }
  ];

  return (
    <div className="space-y-8 animate-page-enter">
      <DashboardHeader 
        title={`Welcome, Scholar ${user.name.split(' ')[0]}`} 
        subtitle="Honor and Excellence. Continue your academic journey." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {myCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
            {/* Image Section - No Red Tint */}
            <div className="h-48 relative overflow-hidden">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                 <Link to={`/dashboard/courses/${course.id}/learn`}>
                    <PlayCircle className="h-16 w-16 text-[#F2A900] drop-shadow-2xl" />
                 </Link>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-4">
                <span className="bg-[#A51C30]/10 text-[#A51C30] text-[10px] font-serif font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#A51C30]/20">
                  {course.modules}
                </span>
                <span className="text-gray-400 text-xs font-serif flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {course.timeLeft}
                </span>
              </div>

              <h3 className="font-serif font-bold text-gray-900 text-xl mb-6 line-clamp-1">{course.title}</h3>

              <div className="mt-auto space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-400 font-serif italic text-sm">Course Progress</span>
                    <span className="text-[#A51C30] font-serif font-bold">{course.progress}%</span>
                  </div>
                  {/* Crimson to Gold Progress Bar */}
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-[#A51C30] rounded-full transition-all duration-1000 ease-in-out"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <Link to={`/dashboard/courses/${course.id}/learn`} className="block">
                  <Button className="w-full bg-white text-[#A51C30] border-2 border-[#A51C30] hover:bg-[#A51C30] hover:text-white font-serif font-bold py-6 rounded-xl transition-all transform hover:-translate-y-1 shadow-sm">
                    Continue Learning
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`h-14 w-14 rounded-2xl ${color} flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-serif font-bold uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-serif font-bold text-gray-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}