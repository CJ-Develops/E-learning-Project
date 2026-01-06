import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/apiClient';
import { 
  BookOpen, Users, Settings, LogOut, LayoutDashboard, 
  GraduationCap, FileText, Search, Bell, 
  Trash2, Edit, Plus, CheckCircle, TrendingUp,
  BarChart3 
} from 'lucide-react';

// --- MAIN DASHBOARD COMPONENT ---
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/auth/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  if (!user) return <div className="p-8 text-center">Loading Access...</div>;

  const role = String(user.role).toLowerCase().trim();

  // ROUTING LOGIC
  if (role === '1' || role === 'teacher' || role === 'faculty') {
    return <TeacherView user={user} onLogout={handleLogout} />;
  }
  if (role === '2' || role === 'admin') {
    return <AdminView user={user} onLogout={handleLogout} />;
  }
  return <StudentView user={user} onLogout={handleLogout} />;
}

// ==========================================
// 1. ADMIN VIEW (Now with Navigation!)
// ==========================================
function AdminView({ user, onLogout }) {
  // State to switch between 'overview' and 'scholars'
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen bg-gray-50 font-serif">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2b0a0f] text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-[#F2A900] flex items-center justify-center text-[#2b0a0f] font-bold shadow-md">L</div>
            <span className="text-lg font-bold tracking-widest text-[#F2A900]">LAON</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-4 px-4 mt-2">Admin Portal</div>
            
            {/* Clickable Sidebar Items */}
            <SidebarItem 
                icon={LayoutDashboard} 
                label="Overview" 
                active={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')}
            />
            <SidebarItem icon={BookOpen} label="Curriculums" />
            <SidebarItem 
                icon={Users} 
                label="Scholars" 
                active={activeTab === 'scholars'} 
                onClick={() => setActiveTab('scholars')}
            />
            <SidebarItem icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-white/10">
            <button onClick={onLogout} className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/10 w-full px-4 py-3 rounded-lg transition-all">
                <LogOut size={20} /> Logout
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-gray-50 relative">
        {/* Decorative Blob */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#A51C30]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        {/* Dynamic Content Switching */}
        {activeTab === 'overview' ? (
             <AdminOverview user={user} />
        ) : (
             <ScholarsView /> 
        )}
      </main>
    </div>
  );
}

// ==========================================
// SCHOLARS VIEW (With Delete & Add User)
// ==========================================
function ScholarsView() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState({});
    const [activeTab, setActiveTab] = useState('all');
    
    // MODAL STATE (For the "Add User" Popup)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: '0' // Default to Student
    });

    // 1. Fetch Users
    useEffect(() => {
        fetchUsers();
        fetchCourses();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users'); 
            setUsers(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            setIsLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses');
            setCourses(response.data || []);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    // 2. Delete User
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            // Send DELETE command to Laravel
            await api.delete(`/users/${id}`);
            
            // Remove from screen ONLY if backend succeeds
            setUsers(users.filter(user => user.id !== id));
            
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete user. Check console for details.");
        }
    };

    // 3. Add User Functions
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users', formData);
            setUsers([...users, response.data.user]); // Add new user to list
            setIsModalOpen(false); // Close popup
            setFormData({ name: '', email: '', password: '', role: '0' }); // Reset form
            alert("User created successfully!");
        } catch (error) {
            alert("Failed to create user. Email might be taken.");
        }
    };

    const handleEnroll = async (userId, courseId) => {
        if (!courseId) return;
        try {
            const { data } = await api.post('/admin/enroll', { user_id: userId, course_id: courseId });
            const course = courses.find((c) => String(c.id) === String(courseId));
            alert(`User enrolled in ${course?.title || 'course'}`);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to enroll user.');
        } finally {
            setSelectedCourse((prev) => ({ ...prev, [userId]: '' }));
        }
    };

    const normalizeRole = (role) => {
        const r = String(role);
        if (r === '2') return 'admin';
        if (r === '1') return 'teacher';
        return 'student';
    };

    const displayedUsers = activeTab === 'all'
        ? users
        : users.filter((user) => normalizeRole(user.role) === activeTab);

    // Helper for Badges
    const getRoleBadge = (role) => {
        const r = String(role);
        if (r === '2') return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">Admin</span>;
        if (r === '1') return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">Faculty</span>;
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">Student</span>;
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 relative">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 italic">Manage system access and roles.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#A51C30] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-md hover:bg-[#851626] transition-all"
                >
                    <Plus size={18} /> Add New User
                </button>
            </div>

            {/* Role Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {[
                    { key: 'all', label: 'All Users' },
                    { key: 'student', label: 'Students' },
                    { key: 'teacher', label: 'Teachers' },
                    { key: 'admin', label: 'Admins' },
                ].map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                                isActive
                                    ? 'bg-[#A51C30] text-white border-[#A51C30] shadow-sm'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#A51C30]/40 hover:text-[#A51C30]'
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-serif font-bold uppercase tracking-wider">
                        <tr>
                            <th className="p-4 w-32">Role</th>
                            <th className="p-4">User</th>
                            <th className="p-4 w-64">Enroll Course</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr><td colSpan="4" className="p-8 text-center text-gray-400">Loading Scholars...</td></tr>
                        ) : displayedUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">{getRoleBadge(user.role)}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-[#A51C30]/10 text-[#A51C30] flex items-center justify-center font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{user.name}</p>
                                            <p className="text-gray-500 text-xs">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <select
                                        className="w-full p-2 border rounded-lg text-sm bg-white"
                                        value={selectedCourse[user.id] || ''}
                                        onChange={(e) => {
                                            const courseId = e.target.value;
                                            setSelectedCourse((prev) => ({ ...prev, [user.id]: courseId }));
                                            if (courseId) handleEnroll(user.id, courseId);
                                        }}
                                    >
                                        <option value="">Select Course to Enroll...</option>
                                        {courses.map((course) => (
                                            <option key={course.id} value={course.id}>{course.title}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-4 text-right w-24">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            title="Delete user"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ADD USER MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New User</h2>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full p-3 border rounded-lg mt-1" placeholder="Juan Dela Cruz" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                                <input name="email" type="email" value={formData.email} onChange={handleInputChange} required className="w-full p-3 border rounded-lg mt-1" placeholder="juan@lms.com" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                                <input name="password" type="password" value={formData.password} onChange={handleInputChange} required className="w-full p-3 border rounded-lg mt-1" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Role</label>
                                <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-3 border rounded-lg mt-1 bg-white">
                                    <option value="0">Student</option>
                                    <option value="1">Faculty</option>
                                    <option value="2">Admin</option>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-[#A51C30] text-white font-bold rounded-lg hover:bg-[#851626]">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// ==========================================
// 3. ADMIN OVERVIEW (Your existing layout)
// ==========================================
function AdminOverview({ user }) {
    const [dashboardStats, setDashboardStats] = useState({
        total_scholars: 0,
        active_curriculums: 0,
        faculty_members: 0,
        recent_courses: [],
    });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
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
    }, []);

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

    return (
        <>
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm px-8 py-4 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-96 border border-gray-200">
                    <Search className="text-gray-400 w-4 h-4" />
                    <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none ml-3 w-full text-sm text-gray-600" />
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-xs font-bold text-[#A51C30] uppercase tracking-wider bg-[#fdf2f2] px-3 py-1 rounded-full">Admin View</span>
                    <Bell className="w-5 h-5 text-gray-400 hover:text-[#A51C30] cursor-pointer" />
                    <div className="h-10 w-10 bg-[#A51C30] text-white rounded-lg flex items-center justify-center font-bold shadow-md">
                        {user.name.charAt(0)}
                    </div>
                </div>
            </header>

            <div className="p-8 max-w-7xl mx-auto space-y-8 relative z-0">
                <div className="border-l-4 border-[#A51C30] pl-6 py-2">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Chancellor's Overview</h1>
                    <p className="text-gray-500 italic text-lg">System-wide management and institutional analytics.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        label="Total Scholars" 
                        value={formatNumber(dashboardStats.total_scholars)} 
                        icon={Users} 
                        color="text-[#A51C30]" 
                        bg="bg-[#fdf2f2]"
                        loading={loadingStats}
                    />
                    <StatCard 
                        label="Active Curriculums" 
                        value={formatNumber(dashboardStats.active_curriculums)} 
                        icon={BookOpen} 
                        color="text-[#A51C30]" 
                        bg="bg-[#fdf2f2]"
                        loading={loadingStats}
                    />
                    <StatCard 
                        label="Faculty Members" 
                        value={formatNumber(dashboardStats.faculty_members)} 
                        icon={GraduationCap} 
                        color="text-[#F2A900]" 
                        bg="bg-[#fffbeb]"
                        loading={loadingStats}
                    />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <TrendingUp className="h-24 w-24 text-[#A51C30]" />
                    </div>
                    <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10">
                        <TrendingUp className="h-5 w-5 text-[#A51C30]" /> Recent Institutional Activity
                    </h2>
                    <div className="space-y-4 relative z-10">
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
                                    <p className="text-sm font-serif font-bold text-gray-900">
                                        New Course Added: {course.title}
                                    </p>
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
        </>
    );
}

// ==========================================
// 4. STUDENT LAYOUT
// ==========================================
function StudentView({ user, onLogout }) {
  return (
    <div className="flex h-screen bg-[#fffcfc] font-serif">
      <aside className="w-64 bg-[#2b0a0f] text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
             <div className="h-8 w-8 rounded bg-transparent border border-[#F2A900] flex items-center justify-center text-[#F2A900]"><ShieldCheckIcon size={18} /></div>
             <div><div className="text-xs font-bold text-[#F2A900] tracking-widest">LAON</div><div className="text-sm font-bold text-white tracking-widest">ATHENAEUM</div></div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <div className="text-xs text-[#F2A900] uppercase tracking-widest mb-4 px-4 mt-4 font-bold">Student Portal</div>
            <SidebarItem icon={LayoutDashboard} label="Course Library" active />
            <SidebarItem icon={BarChart3} label="Grades" />
            <SidebarItem icon={FileText} label="Assignments" />
        </nav>
        <div className="p-4 border-t border-white/10">
            <button onClick={onLogout} className="flex items-center gap-3 text-gray-400 hover:text-white w-full px-4 py-2 transition-colors"><LogOut size={20} /> Logout</button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8"><h1 className="text-3xl font-bold">Welcome Scholar {user.name}</h1></main>
    </div>
  );
}

// ==========================================
// 5. TEACHER LAYOUT
// ==========================================
function TeacherView({ user, onLogout }) {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="text-center p-10 bg-white shadow-xl rounded-xl">
                <h1 className="text-3xl font-bold text-[#A51C30] mb-2">Faculty Portal</h1>
                <p className="text-gray-600 mb-6">Welcome, Professor {user.name}</p>
                <button onClick={onLogout} className="bg-[#2b0a0f] text-white px-6 py-2 rounded-lg hover:bg-[#A51C30]">Logout</button>
            </div>
        </div>
    )
}

// --- HELPER COMPONENTS ---

function SidebarItem({ icon: Icon, label, active, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-[#A51C30] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
        >
            <Icon size={18} />
            <span className="font-medium text-sm tracking-wide">{label}</span>
        </button>
    );
}

function StatCard({ label, value, icon: Icon, color, bg, loading = false }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`h-14 w-14 rounded-xl ${bg} ${color} flex items-center justify-center`}><Icon size={28} /></div>
            <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">{label}</p>
                <p className="text-3xl font-bold text-gray-900 font-serif">
                    {loading ? '...' : value}
                </p>
            </div>
        </div>
    );
}

function ShieldCheckIcon({ size = 24 }) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>)
}
