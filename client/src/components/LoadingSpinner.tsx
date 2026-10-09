// LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 border-4 border-amber-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin" />
          <div className="absolute inset-2 border-4 border-orange-200 rounded-full" />
          <div className="absolute inset-2 border-4 border-orange-500 rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        <p className="text-sm text-gray-400">Please wait while we prepare your content</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;