import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const steps = [
  { icon: '📋', title: 'Fill Application', desc: 'Step-by-step guided form with auto-save' },
  { icon: '📄', title: 'Upload Documents', desc: 'Clear checklist — know exactly what to bring' },
  { icon: '📅', title: 'Book Appointment', desc: 'Pick your nearest Passport Seva Kendra' },
  { icon: '✅', title: 'Get Passport', desc: 'Track your status end-to-end in your dashboard' },
];

const faqs = [
  { q: 'How long does processing take?', a: 'Normal scheme: 30–45 days. Tatkal scheme: 7–14 days after appointment.' },
  { q: 'Do I need to visit a PSK?', a: 'Yes, a physical appointment at your nearest Passport Seva Kendra is mandatory for biometrics.' },
  { q: 'What documents do I need?', a: 'Aadhaar, PAN, birth certificate/school certificate, address proof, and two passport-size photos.' },
  { q: 'Can I save my application midway?', a: 'Yes — our system auto-saves every change so you can return and complete it anytime.' },
];

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 60%, #0d3567 100%)',
        padding: '80px 24px 100px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 400, height: 400, borderRadius: '50%', background: 'rgba(244,132,26,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 300, height: 300, borderRadius: '50%', background: 'rgba(244,132,26,0.05)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative' }}>
          <div style={{ maxWidth: 620 }}>
            <div className="badge badge-submitted animate-fade-up" style={{ marginBottom: 20 }}>
              🇮🇳 Official Passport Services Portal
            </div>
            <h1 className="animate-fade-up stagger-1" style={{ color: 'white', marginBottom: 20 }}>
              Apply for Your Passport — Simple &amp; <span style={{ color: 'var(--saffron)' }}>Digital</span>
            </h1>
            <p className="animate-fade-up stagger-2" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.1rem', marginBottom: 36, lineHeight: 1.7 }}>
              No queues, no confusion. Our step-by-step guided process helps you complete your application in under 20 minutes — with auto-save, document checklists, and instant appointment booking.
            </p>
            <div className="animate-fade-up stagger-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {user ? (
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
                  My Dashboard →
                </button>
              ) : (
                <>
                  <Link to="/signup"><button className="btn btn-primary btn-lg">Start Application</button></Link>
                  <Link to="/login"><button className="btn btn-secondary btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Log In</button></Link>
                </>
              )}
            </div>
            <div className="animate-fade-up stagger-4" style={{ marginTop: 32, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {['Auto-save', 'Tatkal & Normal', 'Online Appointment', 'PDF Receipt'].map(f => (
                <span key={f} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--saffron)' }}>✓</span> {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', background: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2>How It Works</h2>
            <p style={{ marginTop: 8, fontSize: '1.05rem' }}>Four simple steps to your passport</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {steps.map((s, i) => (
              <div key={i} className="card animate-fade-up" style={{ animationDelay: `${i * 0.08}s`, textAlign: 'center', padding: 32 }}>
                <div style={{ fontSize: '2.4rem', marginBottom: 14 }}>{s.icon}</div>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--saffron)', color: 'white', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>{i + 1}</div>
                <h3 style={{ marginBottom: 8, fontSize: '1.1rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.9rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--navy)', padding: '60px 24px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, textAlign: 'center' }}>
            {[
              { n: '15M+', label: 'Applications Yearly' },
              { n: '500+', label: 'Passport Seva Kendras' },
              { n: '~20 min', label: 'Avg. Online Time' },
              { n: '180+', label: 'Countries Accepted' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ font: '700 2rem var(--font-display)', color: 'var(--saffron)' }}>{s.n}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 24px', background: 'var(--off-white)' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <h2 style={{ textAlign: 'center', marginBottom: 40 }}>Common Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {faqs.map((f, i) => (
              <div key={i} className="card" style={{ padding: '20px 24px' }}>
                <div style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: 6 }}>{f.q}</div>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section style={{ background: 'linear-gradient(135deg, var(--saffron) 0%, #e07510 100%)', padding: '72px 24px', textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: 12 }}>Ready to apply?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 28 }}>Create your account and start in minutes.</p>
          <Link to="/signup">
            <button className="btn btn-lg" style={{ background: 'white', color: 'var(--saffron)', fontWeight: 700 }}>
              Create Free Account
            </button>
          </Link>
        </section>
      )}

      {/* Footer */}
      <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.5)', padding: '28px 24px', textAlign: 'center', fontSize: '0.85rem' }}>
        <div>© 2025 PassportSeva Digital — Ministry of External Affairs, Government of India</div>
        <div style={{ marginTop: 6 }}>For assistance call 1800-258-1800 (Toll Free)</div>
      </footer>
    </div>
  );
}
