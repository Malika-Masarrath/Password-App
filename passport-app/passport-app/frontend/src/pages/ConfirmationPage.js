import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

export default function ConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [app, setApp] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    API.get(`/applications/${id}`).then(r => setApp(r.data)).catch(() => navigate('/dashboard'));
  }, [id]);

  const appRef = id.slice(-8).toUpperCase();
  const shareUrl = `${window.location.origin}/application/${appRef}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Generate and "download" a text receipt as PDF-like content
  const downloadReceipt = () => {
    if (!app) return;
    const pi = app.personalInfo || {};
    const addr = app.addressInfo || {};
    const appt = app.appointment || {};
    const content = `
PASSPORT SEVA KENDRA — APPLICATION RECEIPT
==========================================
Application ID   : ${appRef}
Date             : ${new Date().toLocaleDateString('en-IN')}
Applicant        : ${pi.firstName || ''} ${pi.lastName || ''}
Passport Type    : ${pi.type || '—'}
Mobile           : ${pi.mobile || '—'}

APPOINTMENT DETAILS
-------------------
PSK Office       : ${appt.office || '—'}
Date             : ${appt.date || '—'}
Time             : ${appt.time || '—'}

PRESENT ADDRESS
---------------
${addr.line1 || ''}, ${addr.line2 || ''}
${addr.city || ''} - ${addr.pin || ''}, ${addr.state || ''}

--
Please carry this receipt along with original documents to the PSK.
Helpline: 1800-258-1800 | www.passportindia.gov.in
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `Passport_Receipt_${appRef}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  if (!app) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--gray-400)' }}>Loading…</div>;

  const pi = app.personalInfo || {};
  const appt = app.appointment || {};
  const formatDate = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : '—';

  return (
    <div style={{ padding: '40px 24px', maxWidth: 640, margin: '0 auto' }}>
      {/* Success banner */}
      <div className="animate-fade-up" style={{
        background: 'linear-gradient(135deg, var(--green) 0%, #1a9c22 100%)',
        color: 'white', borderRadius: 'var(--radius-lg)', padding: '40px 32px',
        textAlign: 'center', marginBottom: 28,
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: 'white', marginBottom: 8 }}>Application Submitted!</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 20, fontSize: '1rem' }}>
          Your passport application has been successfully submitted.
        </p>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px 20px', display: 'inline-block' }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: 2 }}>Application Reference ID</div>
          <div style={{ fontFamily: 'monospace', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.1em' }}>{appRef}</div>
        </div>
      </div>

      {/* Appointment summary */}
      {appt.office && (
        <div className="card animate-fade-up stagger-1" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ fontSize: '2rem' }}>📅</div>
            <div>
              <h3 style={{ marginBottom: 6, fontSize: '1.1rem' }}>Your Appointment</h3>
              <div style={{ fontSize: '0.95rem', color: 'var(--gray-800)', fontWeight: 600 }}>{appt.office}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginTop: 2 }}>{formatDate(appt.date)} at {appt.time}</div>
            </div>
          </div>
        </div>
      )}

      {/* Applicant summary */}
      <div className="card animate-fade-up stagger-2" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Application Summary</h3>
        <div style={{ display: 'grid', gap: 10 }}>
          {[
            ['Name', `${pi.firstName || ''} ${pi.lastName || ''}`.trim() || '—'],
            ['Type', pi.type === 'fresh' ? 'Fresh Passport' : pi.type === 'renew' ? 'Renewal' : pi.type === 'tatkal' ? 'Tatkal' : '—'],
            ['Mobile', pi.mobile || '—'],
            ['Submitted', new Date().toLocaleString('en-IN')],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--gray-400)' }}>{label}</span>
              <span style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What's next */}
      <div className="card animate-fade-up stagger-3" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>What Happens Next?</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: '📱', title: 'Confirmation SMS', desc: 'You\'ll receive an SMS with your appointment details.' },
            { icon: '📋', title: 'Prepare Documents', desc: 'Carry originals + self-attested copies of all required documents.' },
            { icon: '🏛️', title: 'Visit PSK', desc: `Arrive 15 minutes before your appointment at ${appt.office || 'your selected PSK'}.` },
            { icon: '📬', title: 'Receive Passport', desc: 'Delivered to your address within 30–45 days (Normal) or 7–14 days (Tatkal).' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy)' }}>{item.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: 2 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="animate-fade-up stagger-4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={downloadReceipt}>
          ⬇ Download Receipt
        </button>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={copyLink}>
          {copied ? '✓ Copied!' : '🔗 Share Application ID'}
        </button>
      </div>

      <Link to="/dashboard">
        <button className="btn btn-ghost w-full">← Back to Dashboard</button>
      </Link>
    </div>
  );
}
