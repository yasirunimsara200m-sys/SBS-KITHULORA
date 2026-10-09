// src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🍯</div>
        <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          Oops! The page you're looking for doesn't exist. Let's get you back home.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link 
            to="/shop" 
            className="px-6 py-3 border-2 border-amber-600 text-amber-600 rounded-full font-semibold hover:bg-amber-50 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" /> Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;