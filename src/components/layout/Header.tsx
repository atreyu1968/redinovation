import React, { useState } from 'react';
import { LogOut, User, Bell, Settings, HelpCircle, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Logo from './Logo';

const Header = () => {
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
      logout();
    }
  };

  return (
    <header className="bg-[#2A2F8F] px-6 py-3 shadow-md">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and title */}
        <div className="flex items-center space-x-4">
          <button className="lg:hidden p-2 hover:bg-[#373FAF] rounded-lg">
            <Menu className="w-6 h-6 text-white" />
          </button>
          <Link to="/dashboard" className="flex items-center space-x-3">
            <Logo className="h-8 w-auto" invert={true} />
            <span className="text-xl font-semibold text-white hidden sm:inline">
              Red de Innovación FP
            </span>
          </Link>
        </div>

        {/* Right side - User menu and actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-white hover:bg-[#373FAF] rounded-lg relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Help */}
          <Link 
            to="/help"
            className="p-2 text-white hover:bg-[#373FAF] rounded-lg"
          >
            <HelpCircle className="w-6 h-6" />
          </Link>

          {/* Admin Settings - Only show for admin users */}
          {user?.role === 'admin' && (
            <Link 
              to="/admin"
              className="p-2 text-white hover:bg-[#373FAF] rounded-lg"
            >
              <Settings className="w-6 h-6" />
            </Link>
          )}

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-[#373FAF] rounded-lg"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="hidden md:block text-left text-white">
                <div className="text-sm font-medium">
                  {user?.name} {user?.lastName}
                </div>
                <div className="text-xs text-blue-200">
                  {user?.role === 'admin' && 'Administrador'}
                  {user?.role === 'general_coordinator' && 'Coordinador General'}
                  {user?.role === 'subnet_coordinator' && 'Coordinador de Red'}
                  {user?.role === 'manager' && 'Gestor'}
                </div>
              </div>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                <div className="px-4 py-2 border-b md:hidden">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.name} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;