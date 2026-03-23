import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

function AuthCard({ children, title, subtitle }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card card-elevated animate-fade-up" style={{ width: '100%', maxWidth: 440, padding: '40px 36px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🛂</div>
          <h2 style={{ marginBottom: 6 }}>{title}</h2>
          <p style={{ fontSize: '0.9rem' }}>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome Back" subtitle="Log in to your Passport Seva account">
      {error && <div className="alert alert-error mb-4">{error}</div>}
      <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="form-group">
          <label className="form-label">Email Address <span className="req">*</span></label>
          <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password <span className="req">*</span></label>
          <input className="form-input" type="password" placeholder="Enter your password" value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
        </div>
        <button className="btn btn-primary w-full" type="submit" disabled={loading} style={{ marginTop: 4 }}>
          {loading ? 'Logging in…' : 'Log In →'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.9rem', color: 'var(--gray-600)' }}>
        No account? <Link to="/signup">Create one free</Link>
      </div>
      <div className="divider" />
      <div style={{ background: 'var(--gray-100)', borderRadius: 8, padding: '10px 14px', fontSize: '0.8rem', color: 'var(--gray-600)' }}>
        <strong>Demo login:</strong> hire-me@anshumat.org / HireMe@2025!
      </div>
    </AuthCard>
  );
}

export function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '', dob: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handle = async e => {
    e.preventDefault();
    if (!validate()) return;
    setApiError(''); setLoading(true);
    try {
      const { data } = await API.post('/auth/signup', form);
      login(data.token, data.user);
      navigate('/onboarding');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const f = (key, val) => setForm(p => ({ ...p, [key]: val }));

  return (
    <AuthCard title="Create Account" subtitle="Start your passport application today">
      {apiError && <div className="alert alert-error mb-4">{apiError}</div>}
      <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Full Name <span className="req">*</span></label>
          <input className={`form-input ${errors.name ? 'error' : ''}`} placeholder="As on Aadhaar card"
            value={form.name} onChange={e => f('name', e.target.value)} />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Email Address <span className="req">*</span></label>
          <input className={`form-input ${errors.email ? 'error' : ''}`} type="email" placeholder="you@example.com"
            value={form.email} onChange={e => f('email', e.target.value)} />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">City</label>
            <input className="form-input" placeholder="e.g. Mumbai" value={form.city} onChange={e => f('city', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input className="form-input" type="date" value={form.dob} onChange={e => f('dob', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Password <span className="req">*</span></label>
          <input className={`form-input ${errors.password ? 'error' : ''}`} type="password" placeholder="Minimum 6 characters"
            value={form.password} onChange={e => f('password', e.target.value)} />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>
        <button className="btn btn-primary w-full" type="submit" disabled={loading} style={{ marginTop: 4 }}>
          {loading ? 'Creating account…' : 'Create Account →'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.9rem', color: 'var(--gray-600)' }}>
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </AuthCard>
  );
}
