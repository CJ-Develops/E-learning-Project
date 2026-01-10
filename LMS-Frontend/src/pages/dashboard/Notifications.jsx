import React, { useState } from 'react';
import { Bell, Check, Clock, BookOpen, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export default function Notifications() {
  
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Assignment 'PHP Login' due tomorrow", time: "2 hours ago", type: "urgent", read: false, link: "/dashboard/assignments" },
    { id: 2, title: "New course material available", time: "5 hours ago", type: "info", read: false, link: "/dashboard/courses" },
    { id: 3, title: "Your submission was graded: 92/100", time: "1 day ago", type: "success", read: true, link: "/dashboard/grading" },
    { id: 4, title: "Welcome to EduLearn Platform", time: "2 days ago", type: "info", read: true, link: "/dashboard" },
    { id: 5, title: "System Maintenance Scheduled", time: "3 days ago", type: "warning", read: true, link: "#" },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleMarkRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'urgent': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'success': return <Check className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default: return <Bell className="h-5 w-5 text-primary-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500">Stay updated with your course activities.</p>
        </div>
        <Button variant="secondary" onClick={handleMarkAllRead} className="gap-2">
          <Check className="h-4 w-4" /> Mark all as read
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={cn(
                  "p-4 hover:bg-gray-50 transition-colors flex gap-4",
                  !notif.read ? "bg-primary-50/30" : ""
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                  notif.type === 'urgent' ? "bg-red-100" : 
                  notif.type === 'success' ? "bg-green-100" : 
                  notif.type === 'warning' ? "bg-orange-100" : "bg-primary-100"
                )}>
                  {getIcon(notif.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <Link 
                      to={notif.link} 
                      onClick={() => handleMarkRead(notif.id)}
                      className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                    >
                      {notif.title}
                    </Link>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{notif.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notif.type === 'urgent' ? 'Action required immediately.' : 'Click to view details.'}
                  </p>
                </div>

                {!notif.read && (
                  <button 
                    onClick={() => handleMarkRead(notif.id)}
                    className="self-center h-2 w-2 rounded-full bg-primary-600"
                    title="Mark as read"
                  />
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>No notifications yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
