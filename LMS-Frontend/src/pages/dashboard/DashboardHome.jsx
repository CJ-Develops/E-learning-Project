import React from 'react';
import { Button } from '../../components/ui/Button';
import { ROLES } from '../../lib/utils';
import { Clock, BookOpen, Users, TrendingUp, GraduationCap, AlertCircle, PlayCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardHome() {
  const user = JSON.parse(localStorage.getItem('user')) || { role: ROLES.STUDENT, name: 'Guest' };

  // --- ADMIN DASHBOARD ---
  if (user.role === ROLES.ADMIN) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Overview of system performance and statistics.</p>
        </div>

        {/* Stats Grid - REMOVED REVENUE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard icon={<Users className="h-6 w-6 text-primary-600" />} label="Total Users" value="1,234" color="bg-primary-50" />
          <StatsCard icon={<BookOpen className="h-6 w-6 text-purple-600" />} label="Total Courses" value="42" color="bg-purple-50" />
          <StatsCard icon={<GraduationCap className="h-6 w-6 text-green-600" />} label="Active Students" value="892" color="bg-green-50" />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent System Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border-b last:border-0">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New user registration</p>
                  <p className="text-xs text-gray-500">2 minutes ago • User ID #{1000 + i}</p>
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-500">Manage your courses and student progress.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard icon={<Users className="h-6 w-6 text-primary-600" />} label="Enrolled Students" value="156" color="bg-primary-50" />
          <StatsCard icon={<AlertCircle className="h-6 w-6 text-orange-600" />} label="Pending Grades" value="12" color="bg-orange-50" />
          <StatsCard icon={<CheckCircle className="h-6 w-6 text-green-600" />} label="Course Rating" value="4.8/5.0" color="bg-green-50" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Assignments</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                      S{i}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Database Design Task</p>
                      <p className="text-xs text-gray-500">Submitted by Student #{i}</p>
                    </div>
                  </div>
                  <Link to="/dashboard/grading">
                    <Button size="sm" variant="secondary">Grade</Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Classes</h2>
             <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <Clock className="h-8 w-8 mb-2" />
                <p>No live classes scheduled for today.</p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- STUDENT DASHBOARD ---
  const myCourses = [
    {
      id: 7,
      title: "Advanced PHP & MySQL",
      image: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97663?auto=format&fit=crop&q=80&w=600",
      progress: 70,
      timeLeft: "2h 45m left",
      modules: "12 Modules"
    },
    {
      id: 8,
      title: "React Fundamentals",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600",
      progress: 35,
      timeLeft: "5h 10m left",
      modules: "8 Modules"
    },
    {
      id: 9,
      title: "UI/UX Design Principles",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a5638d4b?auto=format&fit=crop&q=80&w=600",
      progress: 10,
      timeLeft: "8h 20m left",
      modules: "15 Modules"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Learning</h1>
        <p className="text-gray-500">Continue where you left off.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="h-48 relative">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                 <Link to={`/dashboard/courses/${course.id}/learn`}>
                    <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
                 </Link>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-3">
                <span className="bg-primary-50 text-primary-700 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {course.modules}
                </span>
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {course.timeLeft}
                </span>
              </div>

              <h3 className="font-bold text-gray-900 text-lg mb-6 line-clamp-1">{course.title}</h3>

              <div className="mt-auto space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Progress</span>
                    <span className="text-primary-600 font-bold">{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-600 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <Link to={`/dashboard/courses/${course.id}/learn`} className="block">
                  <Button className="w-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:text-primary-600 font-medium shadow-sm">
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
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
      <div className={`h-12 w-12 rounded-lg ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
