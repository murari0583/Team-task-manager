import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  ClipboardDocumentCheckIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Projects', path: '/projects', icon: BriefcaseIcon },
    { name: 'Tasks', path: '/tasks', icon: ClipboardDocumentCheckIcon },
  ];

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">TeamTasker</span>
            </div>
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === link.path
                      ? 'border-primary text-slate-900'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative flex items-center space-x-4">
              <div className="flex items-center text-sm font-medium text-slate-700">
                 <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold mr-2">
                   {user?.name.charAt(0).toUpperCase()}
                 </div>
                 <div className="flex flex-col">
                   <span>{user?.name}</span>
                   <span className="text-xs text-slate-500">{user?.role}</span>
                 </div>
              </div>
              <button
                onClick={logout}
                className="ml-4 p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                title="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
