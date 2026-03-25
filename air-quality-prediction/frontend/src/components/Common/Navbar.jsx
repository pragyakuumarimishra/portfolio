import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Wind, LayoutDashboard, History, Settings, LogOut, Bell } from 'lucide-react';

const Navbar = ({ alertCount = 0 }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Wind className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white hidden sm:block">AirQuality Monitor</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block text-sm">{label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {alertCount > 0 && (
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:block">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="nav-link text-red-400 hover:text-red-300 hover:bg-red-900/20"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
