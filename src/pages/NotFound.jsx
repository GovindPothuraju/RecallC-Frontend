import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-14 h-14 rounded-full bg-red-50 text-brand-red flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-brand-black tracking-tight">404 - Page Not Found</h1>
      <p className="text-sm text-brand-secondaryGray max-w-sm mt-2 mb-6">
        The page you are looking for does not exist or has been moved to another location.
      </p>
      <Link to="/">
        <Button variant="primary">
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}

export default NotFound;

