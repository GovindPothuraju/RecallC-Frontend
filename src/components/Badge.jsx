import React from 'react';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-gray-100 text-gray-700 border border-gray-200',
    red: 'bg-red-50 text-brand-red border border-red-200',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
    // Status specific
    overdue: 'bg-red-100 text-brand-deepRed border border-red-300 font-semibold',
    dueToday: 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold',
    completed: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    pending: 'bg-gray-100 text-gray-700 border border-gray-200',
    // Understanding
    easy: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    medium: 'bg-amber-50 text-amber-700 border border-amber-200',
    hard: 'bg-red-50 text-brand-red border border-red-200'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;

