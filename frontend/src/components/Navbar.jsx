import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Navigation Links (No Logo) */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-700">
          <Link to="/petitions" className="hover:text-[#F97316] transition-colors duration-150">
            Explore Petitions
          </Link>
          <Link to="/petitions/create" className="hover:text-[#F97316] transition-colors duration-150">
            Create Petition
          </Link>
          {isAuthenticated && (
            <Link to="/my-petitions" className="hover:text-[#F97316] transition-colors duration-150">
              My Petitions
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-xs font-bold hover:bg-purple-100 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-purple-600" />
              Admin Portal
            </Link>
          )}
        </div>

        {/* Mobile Left Brand Link */}
        <div className="md:hidden flex items-center text-sm font-extrabold text-[#0F172A]">
          <Link to="/">Petitions Platform</Link>
        </div>

        {/* Right Side: Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1 text-xs">
                <div className="w-6 h-6 rounded-full bg-[#F97316] text-white font-extrabold flex items-center justify-center text-xs">
                  {userInitial}
                </div>
                <span className="font-bold text-slate-800 text-xs max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-full transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-sm font-semibold">
              <Link to="/login" className="px-3 py-1.5 text-slate-700 hover:text-[#2563EB] transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#F97316] hover:bg-[#ea580c] text-white px-4 py-2 rounded-full font-bold shadow-sm transition-all duration-150 text-xs"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 pt-2 pb-4 space-y-3 text-sm font-semibold">
          <Link
            to="/petitions"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 hover:text-[#F97316]"
          >
            Explore Petitions
          </Link>
          <Link
            to="/petitions/create"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 hover:text-[#F97316]"
          >
            Create Petition
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-petitions"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-[#F97316]"
            >
              My Petitions
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-purple-700 font-bold"
            >
              Admin Portal
            </Link>
          )}
          <div className="border-t pt-3 flex items-center justify-between">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-red-600 font-bold text-xs flex items-center">
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </button>
            ) : (
              <div className="flex space-x-3 w-full">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2 border rounded-full text-xs font-bold text-slate-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2 bg-[#F97316] text-white rounded-full text-xs font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
