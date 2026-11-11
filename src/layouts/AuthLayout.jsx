import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center text-white shadow-md shadow-red-200 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-brand-black flex items-center gap-1.5">
            RecallC
            <span className="w-2.5 h-2.5 rounded-full bg-brand-red inline-block"></span>
          </span>
        </Link>
        <p className="mt-2 text-sm text-brand-secondaryGray font-medium">
          Learn Today. Recall Tomorrow.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-200/80 rounded-2xl sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

