import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  History,
  BarChart3,
  Settings,
  LogOut,
  BrainCircuit
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Sidebar({ onCloseMobile }) {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Topics', path: '/topics', icon: BookOpen },
    { name: 'Add Topic', path: '/topics/new', icon: PlusCircle },
    { name: 'Revision History', path: '/history', icon: History },
    { name: 'Progress', path: '/progress', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200/80 flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-brand-red flex items-center justify-center text-white shadow-sm shadow-red-200">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-brand-black flex items-center gap-1.5">
            RecallC
            <span className="w-2 h-2 rounded-full bg-brand-red inline-block"></span>
          </h1>
          <p className="text-[11px] font-medium text-brand-secondaryGray -mt-0.5 tracking-wide">
            Learn Today. Recall Tomorrow.
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-50 text-brand-red font-semibold'
                    : 'text-gray-600 hover:text-brand-black hover:bg-gray-50'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-brand-black text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-brand-black truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-[11px] text-brand-secondaryGray truncate">
                {user?.email || ''}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

