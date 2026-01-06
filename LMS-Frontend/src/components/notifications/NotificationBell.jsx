import React, { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import api from '../../lib/apiClient';
import { cn } from '../../lib/utils';

const POLL_INTERVAL_MS = 60000;

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const bellRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
      if (typeof res.data.unread_count === 'number') {
        setUnreadCount(res.data.unread_count);
      } else {
        setUnreadCount(res.data.notifications?.length || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.post('/notifications/mark-read');
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notifications read', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative" ref={bellRef}>
      <button onClick={handleToggle} className="relative p-2 text-gray-400 hover:text-[#A51C30] transition-colors">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 h-2 w-2 bg-[#F2A900] rounded-full ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-serif font-bold text-gray-900">Notifications</h3>
            <button onClick={markAllRead} className="text-[10px] font-bold uppercase tracking-widest text-[#A51C30] hover:underline">
              Mark all read
            </button>
          </div>
          <div className="max-h-[350px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 py-6 text-sm text-gray-500">No new notifications.</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "px-5 py-4 border-b border-gray-50 last:border-0",
                    !notif.read_at && "bg-[#A51C30]/5"
                  )}
                >
                  <div className="flex gap-4">
                    <div
                      className={cn(
                        "mt-1.5 h-2 w-2 rounded-full shrink-0",
                        notif.data?.type === 'urgent'
                          ? "bg-red-600"
                          : notif.data?.type === 'success'
                            ? "bg-green-600"
                            : "bg-[#A51C30]"
                      )}
                    />
                    <div>
                      <p className="text-sm font-serif font-bold text-gray-900">
                        {notif.data?.message || 'Notification update'}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">
                        {notif.created_at}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
