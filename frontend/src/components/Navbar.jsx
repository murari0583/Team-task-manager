import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { HomeIcon, BriefcaseIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Projects', path: '/projects', icon: BriefcaseIcon },
    { name: 'Tasks', path: '/tasks', icon: ClipboardDocumentCheckIcon },
  ];

  return (
    <nav style={{ backgroundColor: '#16a085', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span style={{ color: '#fff', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Team<span style={{ color: '#a7f3d0' }}>Tasker</span>
          </span>

          {/* Nav Links */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    color: active ? '#fff' : 'rgba(255,255,255,0.75)',
                    backgroundColor: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={e => { if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
                  onMouseOut={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Icon style={{ width: '16px', height: '16px' }} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Info + Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '14px', border: '2px solid rgba(255,255,255,0.4)' }}>
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600', lineHeight: 1.2 }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>{user?.role}</div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s ease' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,0,0,0.3)'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          >
            <ArrowRightOnRectangleIcon style={{ width: '16px', height: '16px' }} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
