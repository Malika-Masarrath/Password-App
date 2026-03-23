import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const slides = [
  {
    icon: '👋',
    title: 'Welcome to Passport Seva',
    body: 'India\'s simplified, digital passport application portal. We\'ve redesigned the process to be clear, guided, and stress-free.',
    highlight: null,
  },
  {
    icon: '📋',
    title: 'Step-by-step Application',
    body: 'Our smart form breaks the application into 4 clear steps — Personal Info, Address, Documents, and Appointment. Your progress is saved automatically.',
    highlight: '⏱ Average completion time: 18 minutes',
  },
  {
    icon: '📄',
    title: 'Know Exactly What to Bring',
    body: 'No more guessing. We show you a personalised document checklist based on your application type before your PSK visit.',
    highlight: '📌 Clear list — no surprises at the counter',
  },
  {
    icon: '📅',
    title: 'Book Your Appointment Online',
    body: 'Choose from available slots at your nearest Passport Seva Kendra. Reschedule anytime from your dashboard.',
    highlight: '✅ Instant confirmation sent to your email',
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const current = slides[step];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, var(--navy) 0%, #0d3567 50%, #162847 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40 }}>
          {slides.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 28 : 8, height: 8, borderRadius: 4,
              background: i === step ? 'var(--saffron)' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease', cursor: 'pointer',
            }} onClick={() => setStep(i)} />
          ))}
        </div>

        {/* Card */}
        <div key={step} className="card card-elevated animate-fade-up" style={{ padding: '48px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 24 }}>{current.icon}</div>
          <h2 style={{ marginBottom: 16 }}>{current.title}</h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.8, marginBottom: current.highlight ? 20 : 0 }}>
            {current.body}
          </p>
          {current.highlight && (
            <div style={{ background: 'var(--saffron-pale)', border: '1px solid #ffd59e', borderRadius: 8, padding: '10px 16px', fontSize: '0.9rem', fontWeight: 500, color: '#9a4e00' }}>
              {current.highlight}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }}>
          <button className="btn btn-ghost btn-sm" style={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.15)', visibility: step === 0 ? 'hidden' : 'visible' }}
            onClick={() => setStep(s => s - 1)}>
            ← Back
          </button>

          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>
            {step + 1} of {slides.length}
          </span>

          {step < slides.length - 1 ? (
            <button className="btn btn-primary btn-sm" onClick={() => setStep(s => s + 1)}>
              Next →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ padding: '10px 24px' }}>
              Go to Dashboard →
            </button>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}>
            Skip intro
          </button>
        </div>
      </div>
    </div>
  );
}
