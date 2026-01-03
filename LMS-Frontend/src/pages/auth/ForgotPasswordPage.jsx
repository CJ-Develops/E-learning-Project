import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BookOpen, ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center px-8 py-12 lg:px-12 xl:px-24 bg-white">
        <Link to="/auth/login" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>
        
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                <BookOpen className="h-7 w-7" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
            <p className="text-gray-500">
              {!isSubmitted 
                ? "Enter your email address and we'll send you a link to reset your password." 
                : "Check your email for the reset link."}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" placeholder="m@example.com" className="pl-9" required />
                </div>
              </div>
              
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex flex-col items-center text-center space-y-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <h3 className="font-medium text-green-900">Link Sent Successfully!</h3>
                <p className="text-sm text-green-700">
                  We've sent a password reset link to your email. Please check your inbox and spam folder.
                </p>
              </div>
              <Button onClick={() => navigate('/auth/login')} variant="secondary" className="w-full">
                Return to Login
              </Button>
            </div>
          )}

          <div className="text-center text-sm">
            <span className="text-gray-500">Remember your password? </span>
            <Link to="/auth/login" className="font-medium text-primary-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative bg-primary-900">
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-primary-900/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Books" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative z-20 flex h-full flex-col justify-end p-12 text-white">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed">
              "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
            </p>
            <footer className="text-sm text-primary-200">— Brian Herbert</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
