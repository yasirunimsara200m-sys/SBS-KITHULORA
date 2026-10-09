import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut } from 'lucide-react';
import CartDrawer from './CartDrawer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-amber-100/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 cursor-pointer group">
              <div className="w-11 h-11 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all border border-amber-200 bg-white flex items-center justify-center p-0.5 shrink-0">
                <img src="/icon.jpg" alt="SBS KITHULORA Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-gray-900 leading-none">
                  SBS <span className="text-amber-600">KITHULORA</span>
                </span>
                <span className="text-[10px] font-bold text-amber-700 tracking-wider uppercase mt-1">
                  Pure Kithul. Pure Sri Lanka.
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-600 hover:text-amber-600 transition-colors font-medium relative group">
                Home<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link to="/shop" className="text-gray-600 hover:text-amber-600 transition-colors font-medium relative group">
                Shop<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-amber-600 transition-colors font-medium relative group">
                About<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-amber-600 transition-colors font-medium relative group">
                Contact<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-amber-600 hover:text-amber-700 font-semibold border border-amber-300 px-3 py-1 rounded-full text-sm">
                  Admin
                </Link>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-amber-500 transition-all">
                <Search className="w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search products..." className="bg-transparent outline-none px-2 text-sm w-40 placeholder:text-gray-400" />
              </div>

              {/* User / Auth */}
              {isAuthenticated ? (
                <div className="flex items-center gap-1">
                  <Link to={isAdmin ? "/admin" : "/profile"} className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-amber-600 px-3 py-2 rounded-full hover:bg-amber-50 transition-colors">
                    <User className="w-4 h-4" />
                    <span>{user?.name.split(' ')[0]}</span>
                    {isAdmin && <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">Admin</span>}
                  </Link>
                  <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-full transition-colors text-gray-500 hover:text-red-500" title="Logout">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="p-2 hover:bg-amber-50 rounded-full transition-colors">
                  <User className="w-5 h-5 text-gray-600 hover:text-amber-600" />
                </Link>
              )}

              {/* Cart */}
              <button onClick={() => setIsCartOpen(true)} className="p-2 hover:bg-amber-50 rounded-full transition-colors relative group">
                <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-amber-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 hover:bg-amber-50 rounded-full transition-colors">
                {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-gray-600 hover:text-amber-600 font-medium py-2 px-3 hover:bg-amber-50 rounded-lg">Home</Link>
                <Link to="/shop" className="text-gray-600 hover:text-amber-600 font-medium py-2 px-3 hover:bg-amber-50 rounded-lg">Shop</Link>
                <Link to="/about" className="text-gray-600 hover:text-amber-600 font-medium py-2 px-3 hover:bg-amber-50 rounded-lg">About</Link>
                <Link to="/contact" className="text-gray-600 hover:text-amber-600 font-medium py-2 px-3 hover:bg-amber-50 rounded-lg">Contact</Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="text-gray-600 hover:text-amber-600 font-medium py-2 px-3 hover:bg-amber-50 rounded-lg">Profile</Link>
                    {isAdmin && <Link to="/admin" className="text-amber-600 font-semibold py-2 px-3 hover:bg-amber-50 rounded-lg">Admin Dashboard</Link>}
                    <button onClick={handleLogout} className="text-left text-red-500 font-medium py-2 px-3 hover:bg-red-50 rounded-lg">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="text-amber-600 font-semibold py-2 px-3 hover:bg-amber-50 rounded-lg">Login / Register</Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;