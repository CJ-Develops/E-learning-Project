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
  Bell,
  Search,
  ChevronDown,
  User,
  Check
} from 'lucide-react';
import { cn, getRoleName, ROLES, getRoleId } from '../lib/utils';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user from localStorage
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { role: ROLES.STUDENT, name: 'Guest User' });
  const roleName = getRoleName(user.role);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Assignment 'PHP Login' due tomorrow", 
      time: "2 hours ago", 
      type: "urgent", 
      read: false, link: "/dashboard/assignments" },
    { id: 2, title: "New course material available", 
      time: "5 hours ago", 
      type: "info", 
      read: false, link: "/dashboard/courses" },
    { id: 3, title: "Your submission was graded: 92/100", 
      time: "1 day ago", 
      type: "success", 
      read: true, link: "/dashboard/grading" },
    { id: 4, title: "Welcome to EduLearn Platform", 
      time: "2 days ago", 
      type: "info", 
      read: true, link: "/dashboard" },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notif) => {
    // Mark as read
    setNotifications(notifications.map(n => n.id === notif.id ? { ...n, 
      read: true } : n));
    setIsNotificationsOpen(false);
    navigate(notif.link);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, 
      read: true })));
  };

  const handleSwitchRole = (newRoleName) => {
    const newRoleId = getRoleId(newRoleName);
    const updatedUser = { ...user, role: newRoleId, name: `Demo ${newRoleName}` };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    if (newRoleId === ROLES.ADMIN) navigate('/dashboard/users');
    else if (newRoleId === ROLES.TEACHER) navigate('/dashboard/grading');
    else navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  const getNavItems = () => {
    const common = [];
    const roleSpecific = {
      admin: [
        { icon: LayoutDashboard, 
          label: 'Dashboard', 
          path: '/dashboard'
        },
        { icon: BookOpen, 
          label: 'Courses', 
          path: '/dashboard/courses' },
        { icon: Users, 
          label: 'Users', 
          path: '/dashboard/users' },
      ],
      teacher: [
        { icon: LayoutDashboard, 
          label: 'Dashboard', 
          path: '/dashboard'
        },
        { icon: BookOpen, 
          label: 'Courses', 
          path: '/dashboard/courses' },
        { icon: GraduationCap, 
          label: 'Grading', 
          path: '/dashboard/grading' },
      ],
      student: [
        { icon: LayoutDashboard, 
          label: 'Dashboard', 
          path: '/dashboard'
        },
        { icon: BookOpen, 
          label: 'Courses', 
          path: '/dashboard/courses' },
        { icon: FileText, 
          label: 'Assignments', 
          path: '/dashboard/assignments' },
      ]
    };

    const settings = [
      { icon: Settings, 
        label: 'Settings', 
        path: '/dashboard/settings' },
    ];

    return [...(roleSpecific[roleName] || []), ...settings];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar - Maroon Theme */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link to="/" className="font-bold text-xl flex items-center gap-2">
            <span className="text-primary-200">Edu</span> Platform
          </Link>
          <button className="lg:hidden ml-auto" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5 text-gray-300" />
          </button>
        </div>

        <div className="px-6 py-4">
          <p className="text-xs text-primary-200 uppercase tracking-wider font-semibold mb-4">
            {roleName} View
          </p>
          
          <nav className="space-y-2">
            {getNavItems().map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium",
                    isActive 
                      ? "bg-sidebar-active text-white shadow-lg shadow-black/20" 
                      : "text-gray-300 hover:bg-sidebar-hover hover:text-white"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-300")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-sidebar-hover hover:text-white transition-colors text-sm font-medium"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden p-2 -ml-2 text-gray-600"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                
                type="text"
                placeholder="Search courses, students, or content..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-primary-100 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Role Switcher */}
            <div className="flex items-center gap-2 text-sm text-gray-600 hidden sm:flex">
              <span>Switch View:</span>
              <div className="relative group">
                <button className="flex items-center gap-1 font-medium text-gray-900 hover:text-primary-600">
                  {roleName.charAt(0).toUpperCase() + roleName.slice(1)} <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 hidden group-hover:block">
                  {['Student', 'Teacher', 'Admin'].map(r => (
                    <button 
                      key={r}
                      onClick={() => handleSwitchRole(r)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-500 hover:text-primary-600 transition-colors focus:outline-none"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <button onClick={handleMarkAllRead} className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1">
                      <Check className="h-3 w-3" /> Mark all read
                    </button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        onClick={() => handleNotificationClick(notif)}
                        className={cn(
                          "px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer", 
                          !notif.read && "bg-primary-50/30"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("mt-1 h-2 w-2 rounded-full shrink-0", 
                            notif.
                            type === 'urgent' ? "bg-red-500" : 
                            notif.
                            type === 'success' ? "bg-green-500" : "bg-primary-500"
                          )} />
                          <div>
                            <p className={cn("text-sm text-gray-900", !notif.read && "font-semibold")}>{notif.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.
                            time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 bg-gray-50 text-center border-t border-gray-100">
                    <button 
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        navigate('/dashboard/notifications');
                      }}
                      className="text-xs font-medium text-gray-600 hover:text-primary-600 w-full py-1"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="h-9 w-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm border border-primary-200 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email || 'user@example.com'}</p>
                  </div>
                  <div className="py-1">
                    <Link 
                      to="/dashboard/settings" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <Link 
                      to="/dashboard/settings" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                  </div>
                  <div className="py-1 border-t border-gray-100">
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
