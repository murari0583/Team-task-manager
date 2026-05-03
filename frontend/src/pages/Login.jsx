import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserIcon, LockClosedIcon, IdentificationIcon } from '@heroicons/react/24/solid';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password, role);
    setLoading(false);
    if (!res.success) {
      setError(res.message);
    }
  };

  const btnStyle = {
    width: '100%',
    backgroundColor: loading ? '#128a72' : '#16a085',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '13px',
    fontSize: '16px',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'background 0.2s',
    opacity: loading ? 0.85 : 1,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#16a085', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '380px', backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ backgroundColor: '#16a085', padding: '24px 0', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '600', margin: 0, letterSpacing: '0.5px' }}>Login Form</h2>
        </div>

        {/* Body */}
        <div style={{ padding: '30px 32px' }}>
          <form onSubmit={handleSubmit}>

            {error && (
              <div style={{ background: '#fff0f0', color: '#c0392b', padding: '10px 12px', borderRadius: '4px', fontSize: '13px', marginBottom: '14px', border: '1px solid #ffdada' }}>
                ⚠️ {error}
              </div>
            )}

            {/* Email */}
            <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '18px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#16a085', width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <UserIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
              </div>
              <input
                type="email"
                required
                style={{ width: '100%', padding: '12px 14px', fontSize: '14px', border: 'none', outline: 'none', color: '#444' }}
                placeholder="Email or Phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '12px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#16a085', width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LockClosedIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
              </div>
              <input
                type="password"
                required
                style={{ width: '100%', padding: '12px 14px', fontSize: '14px', border: 'none', outline: 'none', color: '#444' }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Role */}
            <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '12px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#16a085', width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IdentificationIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
              </div>
              <select
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', fontSize: '14px', border: 'none', outline: 'none', color: '#444', backgroundColor: '#fff', appearance: 'none', cursor: 'pointer' }}
              >
                <option value="" disabled>Select role</option>
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Forgot Password */}
            <div style={{ marginBottom: '22px' }}>
              <a href="#" style={{ color: '#16a085', fontSize: '13px', textDecoration: 'none' }}>
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '13px', color: '#555' }}>
            Not a member?{' '}
            <Link to="/register" style={{ color: '#16a085', textDecoration: 'none' }}>
              Signup now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
