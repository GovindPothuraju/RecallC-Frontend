import React from 'react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-white rounded-xl border border-dashed border-gray-300">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-brand-red mb-3">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-brand-black">{title}</h3>
      {description && (
        <p className="text-sm text-brand-secondaryGray max-w-sm mt-1 mb-5">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {ActionIcon && <ActionIcon className="w-4 h-4" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;

