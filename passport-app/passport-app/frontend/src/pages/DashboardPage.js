import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

function StatusBadge({ status }) {
  const map = {
    draft: { cls: 'badge-draft', label: 'Draft' },
    submitted: { cls: 'badge-submitted', label: 'Submitted' },
    approved: { cls: 'badge-approved', label: 'Approved' },
    pending: { cls: 'badge-pending', label: 'Pending Review' },
  };
  const { cls, label } = map[status] || map.draft;
  return <span className={`badge ${cls}`}>{label}</span>;
}

function StepProgress({ step }) {
  const steps = ['Personal', 'Address', 'Documents', 'Appointment'];
  const pct = Math.round(((step - 1) / (steps.length - 1)) * 100);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>Step {step} of {steps.length}: {steps[step - 1]}</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)' }}>{pct}%</span>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    API.get('/applications').then(r => setApps(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const createNew = async () => {
    setCreating(true);
    try {
      const { data } = await API.post('/applications');
      navigate(`/apply/${data.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const deleteApp = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this application?')) return;
    await API.delete(`/applications/${id}`);
    setApps(prev => prev.filter(a => a.id !== id));
  };

  const formatDate = iso => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div style={{ padding: '40px 24px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>My Dashboard</h1>
          <p style={{ margin: 0 }}>Welcome back, <strong>{user?.name}</strong> · {user?.city || 'India'}</p>
        </div>
        <button className="btn btn-primary" onClick={createNew} disabled={creating}>
          {creating ? '…' : '+ New Application'}
        </button>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 36 }}>
        {[
          { label: 'Total', value: apps.length, color: 'var(--navy)' },
          { label: 'Drafts', value: apps.filter(a => a.status === 'draft').length, color: 'var(--gray-600)' },
          { label: 'Submitted', value: apps.filter(a => a.status === 'submitted').length, color: 'var(--saffron)' },
          { label: 'Approved', value: apps.filter(a => a.status === 'approved').length, color: 'var(--green)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Applications list */}
      <h3 style={{ marginBottom: 16 }}>Applications</h3>
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>Loading…</div>
      ) : apps.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
          <h3 style={{ marginBottom: 8 }}>No applications yet</h3>
          <p style={{ marginBottom: 24 }}>Start your passport application — it takes about 18 minutes.</p>
          <button className="btn btn-primary" onClick={createNew} disabled={creating}>
            Start Application
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {apps.map(app => (
            <div key={app.id} className="card" style={{ cursor: 'pointer', transition: 'var(--transition)', ':hover': {} }}
              onClick={() => navigate(`/apply/${app.id}`)}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: 4 }}>
                    Application #{app.id.slice(-8).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                    Created {formatDate(app.createdAt)} · Last saved {formatDate(app.updatedAt)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <StatusBadge status={app.status} />
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', borderColor: 'transparent' }}
                    onClick={e => deleteApp(app.id, e)}>Delete</button>
                </div>
              </div>
              <StepProgress step={app.step || 1} />
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/apply/${app.id}`); }}>
                  {app.status === 'submitted' ? 'View Details →' : 'Continue →'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help box */}
      <div className="card" style={{ marginTop: 32, background: 'var(--navy)', border: 'none', color: 'white' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '2rem' }}>💬</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>Need Help?</div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)' }}>Call 1800-258-1800 (Toll Free) · Mon–Sat, 8AM–8PM</div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
            Chat Support
          </button>
        </div>
      </div>
    </div>
  );
}
