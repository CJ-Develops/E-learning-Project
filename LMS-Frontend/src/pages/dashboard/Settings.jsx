import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Lock, Bell, Trash2, Upload, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || { name: 'Guest', email: 'guest@example.com', avatar: null });
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    firstName: user.name.split(' ')[0] || '',
    lastName: user.name.split(' ')[1] || '',
    bio: user.bio || '',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    is2FAEnabled: user.is2FAEnabled || false
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    updates: true
  });

  // Handlers
  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a fake local URL for the image
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, avatar: imageUrl });
    }
  };

  const handleSaveProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedUser = {
        ...user,
        name: `${formData.firstName} ${formData.lastName}`,
        bio: formData.bio
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsLoading(false);
      alert("Profile updated successfully!");
    }, 800);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      localStorage.removeItem('user');
      navigate('/auth/login');
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (securityData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSecurityData({ ...securityData, currentPassword: '', newPassword: '', confirmPassword: '' });
      alert("Password updated successfully!");
    }, 1000);
  };

  const toggle2FA = () => {
    const newState = !securityData.is2FAEnabled;
    setSecurityData({ ...securityData, is2FAEnabled: newState });
    
    // Persist to local storage for demo
    const updatedUser = { ...user, is2FAEnabled: newState };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    alert(newState ? "Two-Factor Authentication Enabled" : "Two-Factor Authentication Disabled");
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

              <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-red-600">Delete Account</h2>
                    <p className="text-sm text-gray-500 mt-1">Permanently remove your account and all of its contents.</p>
                  </div>
                  <Button 
                    variant="danger" 
                    className="bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:text-red-700 shadow-none"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
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
                    <Input 
                      type="password" 
                      value={securityData.currentPassword} 
                      onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <Input 
                      type="password" 
                      value={securityData.newPassword} 
                      onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <Input 
                      type="password" 
                      value={securityData.confirmPassword} 
                      onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button type="submit" isLoading={isLoading}>Update Password</Button>
                  </div>
                </form>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
                    <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account.</p>
                  </div>
                  <Button 
                    variant={securityData.is2FAEnabled ? "primary" : "secondary"} 
                    onClick={toggle2FA}
                  >
                    {securityData.is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
                  </Button>
                </div>
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
