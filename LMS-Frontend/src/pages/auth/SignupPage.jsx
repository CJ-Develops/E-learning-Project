import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BookOpen, ArrowLeft, User, GraduationCap, ShieldCheck } from 'lucide-react';
import { cn, ROLES, getRoleId } from '../../lib/utils';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [roleId, setRoleId] = useState(ROLES.STUDENT);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam) {
      setRoleId(getRoleId(roleParam));
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call to create user in DB
    setTimeout(() => {
      const userData = {
        id: Math.floor(Math.random() * 10000),
        name: `${e.target.firstName.value} ${e.target.lastName.value}`,
        email: e.target.email.value,
        role: roleId, // Integer 0, 1, or 2
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center px-8 py-12 lg:px-12 xl:px-24 bg-white order-2 lg:order-1">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                <BookOpen className="h-7 w-7" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-gray-500">Join EduLearn today and start your journey</p>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium leading-none">I want to join as a:</label>
            <div className="grid grid-cols-3 gap-4">
              <RoleCard 
                icon={<User className="h-5 w-5" />} 
                label="Student" 
                selected={roleId === ROLES.STUDENT} 
                onClick={() => setRoleId(ROLES.STUDENT)} 
              />
              <RoleCard 
                icon={<GraduationCap className="h-5 w-5" />} 
                label="Teacher" 
                selected={roleId === ROLES.TEACHER} 
                onClick={() => setRoleId(ROLES.TEACHER)} 
              />
              <RoleCard 
                icon={<ShieldCheck className="h-5 w-5" />} 
                label="Admin" 
                selected={roleId === ROLES.ADMIN} 
                onClick={() => setRoleId(ROLES.ADMIN)} 
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium leading-none">First name</label>
                <Input id="firstName" placeholder="John" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium leading-none">Last name</label>
                <Input id="lastName" placeholder="Doe" required />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
              <Input id="password" type="password" required />
            </div>
            
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/auth/login" className="font-medium text-primary-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative bg-primary-600 order-1 lg:order-2">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Students" 
          className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-50"
        />
        <div className="relative z-20 flex h-full flex-col justify-center p-12 text-white">
          <div className="max-w-md mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Start your learning journey</h2>
            <p className="text-primary-100 text-lg">
              "The beautiful thing about learning is that no one can take it away from you."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ icon, label, selected, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center gap-2 transition-all hover:border-primary-400 hover:bg-primary-50",
        selected ? "border-primary-600 bg-primary-50 text-primary-700" : "border-gray-200 bg-white text-gray-600"
      )}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
