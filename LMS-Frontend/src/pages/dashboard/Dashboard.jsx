import React from 'react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center space-y-6">
        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-4xl">
          🎉
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to the Dashboard!</h1>
        <p className="text-gray-600 text-lg">
          You have successfully logged in. In a real application, this page would show content specific to your role (Admin, Teacher, or Student).
        </p>
        <div className="pt-4">
          <Link to="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
