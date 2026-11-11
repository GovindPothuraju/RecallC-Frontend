import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ text = 'Loading...', size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10'
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 gap-3 text-brand-secondaryGray ${className}`}>
      <Loader2 className={`${sizes[size] || sizes.md} animate-spin text-brand-red`} />
      {text && <span className="text-sm font-medium">{text}</span>}
    </div>
  );
}

export default LoadingSpinner;

