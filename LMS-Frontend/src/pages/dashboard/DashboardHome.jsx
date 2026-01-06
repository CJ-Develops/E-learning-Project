import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { ROLES } from '../../lib/utils';
import { Clock, BookOpen, Users, TrendingUp, GraduationCap, AlertCircle, PlayCircle, CheckCircle, ShieldCheck, ClipboardList, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/apiClient';
import StudentLibrary from './StudentLibrary';

export default function DashboardHome() {
  const user = JSON.parse(localStorage.getItem('user')) || { role: ROLES.STUDENT, name: 'Guest' };
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState({
    total_scholars: 0,
    active_curriculums: 0,
    faculty_members: 0,
    recent_courses: [],
  });
  const [loadingStats, setLoadingStats] = useState(false);

  const [teacherData, setTeacherData] = useState({
    stats: { enrolled_count: 0, pending_eval_count: 0 },
    recent_graded: [],
    action_items: { ungraded_count: 0 },
    at_risk_students: [],
    activity_feed: [],
  });
  const [loadingTeacher, setLoadingTeacher] = useState(false);

  useEffect(() => {
    if (user.role !== ROLES.ADMIN) return;

    const fetchDashboardStats = async () => {
      setLoadingStats(true);
      try {
        const { data } = await api.get('/admin/dashboard-stats');
        setDashboardStats({
          total_scholars: data?.total_scholars ?? 0,
          active_curriculums: data?.active_curriculums ?? 0,
          faculty_members: data?.faculty_members ?? 0,
          recent_courses: data?.recent_courses ?? [],
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, [user.role]);

  useEffect(() => {
    if (user.role !== ROLES.TEACHER) return;

    const fetchTeacherDashboard = async () => {
      setLoadingTeacher(true);
      try {
        const { data } = await api.get('/teacher/dashboard');
        setTeacherData({
          stats: data?.stats ?? { enrolled_count: 0, pending_eval_count: 0 },
          recent_graded: data?.recent_graded ?? [],
          action_items: data?.action_items ?? { ungraded_count: 0 },
          at_risk_students: data?.at_risk_students ?? [],
          activity_feed: data?.activity_feed ?? [],
        });
      } catch (error) {
        console.error('Error fetching teacher dashboard:', error);
      } finally {
        setLoadingTeacher(false);
      }
    };

    fetchTeacherDashboard();
  }, [user.role]);

  const formatNumber = (value) => Number(value ?? 0).toLocaleString();

  const formatTimeAgo = (timestamp) => {
    const created = new Date(timestamp);
    if (Number.isNaN(created.getTime())) return '';

    const seconds = Math.floor((Date.now() - created.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
    if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    return 'Just now';
  };

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
          <StatsCard icon={<Users className="h-6 w-6 text-[#A51C30]" />} label="Total Scholars" value={formatNumber(dashboardStats.total_scholars)} color="bg-[#A51C30]/5" loading={loadingStats} />
          <StatsCard icon={<BookOpen className="h-6 w-6 text-[#A51C30]" />} label="Active Curriculums" value={formatNumber(dashboardStats.active_curriculums)} color="bg-[#A51C30]/5" loading={loadingStats} />
          <StatsCard icon={<GraduationCap className="h-6 w-6 text-[#F2A900]" />} label="Faculty Members" value={formatNumber(dashboardStats.faculty_members)} color="bg-[#F2A900]/5" loading={loadingStats} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldCheck className="h-24 w-24 text-[#A51C30]" />
          </div>
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#A51C30]" /> Recent Institutional Activity
          </h2>
          <div className="space-y-4">
            {loadingStats && (
              <div className="p-4 text-sm text-gray-400 font-serif">Loading recent courses...</div>
            )}
            {!loadingStats && dashboardStats.recent_courses.length === 0 && (
              <div className="p-4 text-sm text-gray-500 font-serif italic">No recent courses found.</div>
            )}
            {!loadingStats && dashboardStats.recent_courses.map((course) => (
              <div key={course.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-all border-b border-gray-100 last:border-0">
                <div className="h-10 w-10 rounded-full bg-[#A51C30]/10 flex items-center justify-center text-[#A51C30]">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-serif font-bold text-gray-900">New Course Added: {course.title}</p>
                  <p className="text-xs text-gray-500 font-serif">
                    {formatTimeAgo(course.created_at)}
                    {course.teacher_name ? ` · ${course.teacher_name}` : ''}
                  </p>
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
          <StatsCard icon={<Users className="h-6 w-6 text-[#A51C30]" />} label="Enrolled Scholars" value={formatNumber(teacherData.stats.enrolled_count)} color="bg-[#A51C30]/5" loading={loadingTeacher} />
          <StatsCard icon={<AlertCircle className="h-6 w-6 text-orange-600" />} label="Pending Evaluations" value={formatNumber(teacherData.stats.pending_eval_count)} color="bg-orange-50" loading={loadingTeacher} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 text-[#A51C30]" />
                  <h2 className="text-lg font-serif font-bold text-gray-900">Action Center</h2>
                </div>
                <Button 
                  size="sm" 
                  className="bg-[#A51C30] hover:bg-[#851626] text-white"
                  onClick={() => navigate('/dashboard/assignments/grading')}
                  disabled={loadingTeacher}
                >
                  Go to Evaluations
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                {loadingTeacher ? 'Loading...' : `${formatNumber(teacherData.action_items.ungraded_count)} assignments to grade`}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-5 w-5 text-[#A51C30]" />
                <h2 className="text-lg font-serif font-bold text-gray-900">Recent Grading History</h2>
              </div>
              {loadingTeacher && <p className="text-sm text-gray-500">Loading...</p>}
              {!loadingTeacher && teacherData.recent_graded.length === 0 && (
                <p className="text-sm text-gray-500 italic">No graded submissions yet.</p>
              )}
              <div className="space-y-4">
                {teacherData.recent_graded.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#A51C30] text-white flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-serif font-bold text-gray-900">{item.assignment_title || 'Assignment'}</p>
                        <p className="text-xs text-gray-500">Student: {item.student_name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">Grade: {item.grade ?? '--'}</p>
                        <p className="text-[11px] text-gray-400 mt-1">{formatTimeAgo(item.graded_at)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-5 w-5 text-[#A51C30]" />
                <h2 className="text-lg font-serif font-bold text-gray-900">Recent Activity Feed</h2>
              </div>
              {loadingTeacher && <p className="text-sm text-gray-500">Loading...</p>}
              {!loadingTeacher && teacherData.activity_feed.length === 0 && (
                <p className="text-sm text-gray-500 italic">No recent activity.</p>
              )}
              <div className="space-y-3">
                {teacherData.activity_feed.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <div className="h-2 w-2 rounded-full bg-[#A51C30] mt-2" />
                    <div>
                      <p className="text-sm font-serif font-bold text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(event.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- STUDENT DASHBOARD ---
  if (user.role === ROLES.STUDENT) {
    return <StudentLibrary />;
  }
}

function StatsCard({ icon, label, value, color, loading = false }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`h-14 w-14 rounded-2xl ${color} flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-serif font-bold uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-serif font-bold text-gray-900 tracking-tight">
          {loading ? '...' : value}
        </p>
      </div>
    </div>
  );
}
