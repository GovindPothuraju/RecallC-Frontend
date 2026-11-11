import React from 'react';

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 ${
        hover ? 'transition-all duration-200 hover:shadow-md hover:border-gray-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 pb-4 border-b border-gray-100 ${className}`}>
      <div>
        <h3 className="text-base font-semibold text-brand-black">{title}</h3>
        {subtitle && <p className="text-xs text-brand-secondaryGray mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export default Card;

