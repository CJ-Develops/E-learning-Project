import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Lock, Bell, Upload, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/apiClient';

export default function Settings() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || { name: 'Guest', email: 'guest@example.com', avatar: null });
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  const splitName = (name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return { firstName: '', lastName: '' };
    const parts = trimmed.split(/\s+/);
    return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '' };
  };

  const [formData, setFormData] = useState({
    firstName: splitName(user.name).firstName,
    lastName: splitName(user.name).lastName,
    bio: user.bio || '',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    updates: true
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user');
        const apiUser = res.data;
        setUser(apiUser);
        setFormData({
          firstName: splitName(apiUser.name).firstName,
          lastName: splitName(apiUser.name).lastName,
          bio: apiUser.bio || '',
        });
        localStorage.setItem('user', JSON.stringify(apiUser));
      } catch (err) {
        console.error('Failed to load user profile', err);
      }
    };

    fetchUser();
  }, []);

  // Handlers
  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, avatar: imageUrl });
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      const res = await api.put('/user/profile', {
        name,
        bio: formData.bio,
      });
      const updatedUser = res.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error('Failed to update profile', err);
      alert(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/user/change-password', {
        current_password: securityData.currentPassword,
        new_password: securityData.newPassword,
        new_password_confirmation: securityData.confirmPassword,
      });
      setSecurityData({ ...securityData, currentPassword: '', newPassword: '', confirmPassword: '' });
      alert("Password updated successfully!");
    } catch (err) {
      console.error('Failed to update password', err);
      alert(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Navigation for Settings */}
        <div className="space-y-1">
          <button 
            onClick={() => setActiveTab('profile')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm transition-colors",
              activeTab === 'profile' ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <User className="h-4 w-4" /> Profile
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm transition-colors",
              activeTab === 'security' ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <Lock className="h-4 w-4" /> Security
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm transition-colors",
              activeTab === 'notifications' ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <Bell className="h-4 w-4" /> Notifications
          </button>
        </div>

        {/* Main Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold border-4 border-white shadow-sm overflow-hidden group">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload className="h-6 w-6 text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                  </div>
                  <div>
                    <div className="relative">
                      <Button variant="secondary" size="sm" className="pointer-events-none">Change Avatar</Button>
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                      <Input name="firstName" value={formData.firstName} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <Input name="lastName" value={formData.lastName} onChange={handleProfileChange} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <Input value={user.email} disabled className="bg-gray-50 text-gray-500" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Bio</label>
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleProfileChange}
                      className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600" 
                      placeholder="Tell us a little about yourself..."
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button onClick={handleSaveProfile} isLoading={isLoading}>Save Changes</Button>
                </div>
              </div>

            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>
                <form className="space-y-4" onSubmit={handleUpdatePassword}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <div className="relative">
                      <Input 
                        type={showCurrentPassword ? "text" : "password"} 
                        value={securityData.currentPassword} 
                        onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#A51C30] transition-colors"
                        aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                      <Input 
                        type={showNewPassword ? "text" : "password"} 
                        value={securityData.newPassword} 
                        onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#A51C30] transition-colors"
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        value={securityData.confirmPassword} 
                        onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#A51C30] transition-colors"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button type="submit" isLoading={isLoading}>Update Password</Button>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive emails about your account activity.</p>
                    </div>
                    <button 
                      onClick={() => toggleNotification('email')}
                      className={cn("w-11 h-6 rounded-full transition-colors relative", notifications.email ? "bg-primary-600" : "bg-gray-200")}
                    >
                      <span className={cn("absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform", notifications.email ? "translate-x-5" : "translate-x-0")} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                      <p className="text-sm text-gray-500">Receive text messages for urgent alerts.</p>
                    </div>
                    <button 
                      onClick={() => toggleNotification('sms')}
                      className={cn("w-11 h-6 rounded-full transition-colors relative", notifications.sms ? "bg-primary-600" : "bg-gray-200")}
                    >
                      <span className={cn("absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform", notifications.sms ? "translate-x-5" : "translate-x-0")} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Course Updates</h3>
                      <p className="text-sm text-gray-500">Get notified when new materials are added.</p>
                    </div>
                    <button 
                      onClick={() => toggleNotification('updates')}
                      className={cn("w-11 h-6 rounded-full transition-colors relative", notifications.updates ? "bg-primary-600" : "bg-gray-200")}
                    >
                      <span className={cn("absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform", notifications.updates ? "translate-x-5" : "translate-x-0")} />
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
