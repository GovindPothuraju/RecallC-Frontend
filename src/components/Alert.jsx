import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export function Alert({ type = 'error', message, onClose, className = '' }) {
  if (!message) return null;

  const styles = {
    error: {
      bg: 'bg-red-50 border-red-200 text-red-800',
      icon: AlertCircle,
      iconColor: 'text-brand-red'
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600'
    }
  };

  const current = styles[type] || styles.error;
  const Icon = current.icon;

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-lg border text-sm ${current.bg} ${className}`}
      role="alert"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${current.iconColor}`} />
      <div className="flex-1 font-medium">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 transition-colors p-0.5"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default Alert;

