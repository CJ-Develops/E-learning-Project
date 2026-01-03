import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BookOpen, ArrowLeft, User, GraduationCap, ShieldCheck } from 'lucide-react';
import { cn, ROLES } from '../../lib/utils';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState(ROLES.STUDENT);
  const navigate = useNavigate();

  // Demo credentials matching the SQL Dump
  const demoCredentials = {
    [ROLES.ADMIN]: { email: 'admin@lms.com', password: 'password', name: 'System Admin' },
    [ROLES.TEACHER]: { email: 'teacher@lms.com', password: 'password', name: 'Prof. Snape' },
    [ROLES.STUDENT]: { email: 'student@lms.com', password: 'password', name: 'Harry Potter' },
  };

  const handleDemoClick = (roleId) => {
    setSelectedDemoRole(roleId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate Login Logic matching DB Schema
    setTimeout(() => {
      const email = e.target.email.value;
      
      // Find user based on email (Simulating DB lookup)
      let user = Object.values(demoCredentials).find(u => u.email === email);
      let role = selectedDemoRole;

      if (!user) {
        // Fallback for custom entry
        user = {
          name: 'New User',
          email: email,
        };
      } else {
        // If we found a demo user, ensure the role matches the key
        const foundRole = Object.keys(demoCredentials).find(key => demoCredentials[key].email === email);
        if (foundRole) role = parseInt(foundRole);
      }

      const dbUser = {
        id: Math.floor(Math.random() * 1000), // Simulate DB ID
        name: user.name,
        email: user.email,
        role: role, // Storing Integer as per DB
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(dbUser));
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center px-8 py-12 lg:px-12 xl:px-24 bg-white">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                <BookOpen className="h-7 w-7" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-gray-500">Select a demo user (Matches DB Schema)</p>
          </div>

          {/* Role Selector for Demo */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: ROLES.STUDENT, label: 'Student', icon: User },
              { id: ROLES.TEACHER, label: 'Teacher', icon: GraduationCap },
              { id: ROLES.ADMIN, label: 'Admin', icon: ShieldCheck }
            ].map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleDemoClick(role.id)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all text-xs font-medium",
                  selectedDemoRole === role.id
                    ? "border-primary-600 bg-primary-50 text-primary-700" 
                    : "border-gray-200 hover:bg-gray-50 text-gray-600"
                )}
              >
                <role.icon className="h-4 w-4" />
                {role.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
              <Input 
                id="email" 
                type="email" 
                key={selectedDemoRole} // Force re-render on role change to update default value
                defaultValue={demoCredentials[selectedDemoRole].email} 
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
                <Link to="/auth/forgot-password" className="text-sm font-medium text-primary-600 hover:underline">Forgot password?</Link>
              </div>
              <Input id="password" type="password" defaultValue="password" required />
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <Link to="/auth/signup" className="font-medium text-primary-600 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative bg-primary-900">
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-primary-900/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Library" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative z-20 flex h-full flex-col justify-end p-12 text-white">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed">
              "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
            </p>
            <footer className="text-sm text-primary-200">— Malcolm X</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
