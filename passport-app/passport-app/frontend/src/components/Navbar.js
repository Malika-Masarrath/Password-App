import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
          🛂 Passport<span>Seva</span>
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)', marginRight: 8 }}>
                {user.name}
              </span>
              <Link to="/dashboard">
                <button className="btn btn-ghost btn-sm" style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.2)' }}>
                  Dashboard
                </button>
              </Link>
              <button className="btn btn-ghost btn-sm" style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.2)' }} onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn btn-ghost btn-sm" style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.2)' }}>
                  Log In
                </button>
              </Link>
              <Link to="/signup">
                <button className="btn btn-primary btn-sm">Get Started</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
