import React from 'react';
import { Menu, Plus, UserCircle, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar({ onOpenMobile }) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <span className="text-xs font-semibold text-brand-secondaryGray uppercase tracking-wider">
            Workspace
          </span>
          <h2 className="text-sm font-bold text-brand-black -mt-0.5">
            Personal Learning Desk
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/topics/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-red text-white hover:bg-brand-deepRed transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Topic</span>
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-2 p-1.5 text-gray-600 hover:text-brand-black hover:bg-gray-100 rounded-lg transition-colors"
          title="Account Settings"
        >
          <UserCircle className="w-5 h-5" />
          <span className="hidden md:inline text-xs font-medium">{user?.name}</span>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;

