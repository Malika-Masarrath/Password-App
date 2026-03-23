import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';

// ── Save indicator
function SaveIndicator({ status }) {
  const map = {
    idle: { label: 'All changes saved', cls: 'saved' },
    saving: { label: 'Saving…', cls: 'saving' },
    saved: { label: 'Saved just now', cls: 'saved' },
    error: { label: 'Save failed', cls: '' },
  };
  const { label, cls } = map[status] || map.idle;
  return (
    <span className={`save-indicator ${cls}`}>
      <span className={`save-dot ${status === 'saving' ? 'pulse' : ''}`} />
      {label}
    </span>
  );
}

// ── Step Wizard header
function StepHeader({ step, steps }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', gap: 0, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--gray-200)', marginBottom: 12 }}>
        {steps.map((s, i) => {
          const done = i < step - 1;
          const active = i === step - 1;
          return (
            <div key={i} style={{
              flex: 1, padding: '12px 8px', textAlign: 'center',
              background: done ? 'var(--navy)' : active ? 'var(--saffron)' : 'var(--gray-100)',
              color: done || active ? 'white' : 'var(--gray-400)',
              fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.3s ease',
              borderRight: i < steps.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none',
            }}>
              <div style={{ fontSize: '1.1rem', marginBottom: 2 }}>{done ? '✓' : s.icon}</div>
              <div style={{ display: 'none' }}>{s.label}</div>
              <div style={{ display: 'block', fontSize: '0.7rem', marginTop: 2 }}>{s.label}</div>
            </div>
          );
        })}
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }} />
      </div>
      <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 4 }}>
        Step {step} of {steps.length}
      </div>
    </div>
  );
}

// ── Step 1: Personal Info
function PersonalInfoStep({ data, onChange }) {
  const f = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h3 style={{ marginBottom: 4 }}>Personal Information</h3>
      <p style={{ marginTop: 0, fontSize: '0.9rem' }}>Enter your details exactly as they appear on your Aadhaar card.</p>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Given Name <span className="req">*</span></label>
          <input className="form-input" placeholder="First name" value={data.firstName || ''} onChange={e => f('firstName', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Surname <span className="req">*</span></label>
          <input className="form-input" placeholder="Last name" value={data.lastName || ''} onChange={e => f('lastName', e.target.value)} />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Date of Birth <span className="req">*</span></label>
          <input className="form-input" type="date" value={data.dob || ''} onChange={e => f('dob', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Gender <span className="req">*</span></label>
          <select className="form-select" value={data.gender || ''} onChange={e => f('gender', e.target.value)}>
            <option value="">Select…</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="T">Transgender</option>
          </select>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Place of Birth <span className="req">*</span></label>
          <input className="form-input" placeholder="City of birth" value={data.placeOfBirth || ''} onChange={e => f('placeOfBirth', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Aadhaar Number <span className="req">*</span></label>
          <input className="form-input" placeholder="XXXX XXXX XXXX" maxLength={14} value={data.aadhaar || ''} onChange={e => f('aadhaar', e.target.value.replace(/[^0-9 ]/g, ''))} />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Mobile Number <span className="req">*</span></label>
          <input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" value={data.mobile || ''} onChange={e => f('mobile', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" placeholder="Optional" value={data.email || ''} onChange={e => f('email', e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Passport Type <span className="req">*</span></label>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[{ v: 'fresh', label: 'Fresh Passport', sub: 'First time' }, { v: 'renew', label: 'Renewal', sub: 'Existing passport' }, { v: 'tatkal', label: 'Tatkal', sub: 'Urgent (7–14 days)' }].map(opt => (
            <label key={opt.v} style={{
              flex: 1, minWidth: 120, padding: '14px', border: `2px solid ${data.type === opt.v ? 'var(--saffron)' : 'var(--gray-200)'}`,
              borderRadius: 8, cursor: 'pointer', background: data.type === opt.v ? 'var(--saffron-pale)' : 'white',
              transition: 'all 0.2s ease',
            }}>
              <input type="radio" name="type" value={opt.v} checked={data.type === opt.v} onChange={e => f('type', e.target.value)} style={{ marginRight: 8 }} />
              <strong style={{ fontSize: '0.9rem' }}>{opt.label}</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 2 }}>{opt.sub}</div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Address Info
function AddressStep({ data, onChange }) {
  const f = (k, v) => onChange({ ...data, [k]: v });
  const states = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h3 style={{ marginBottom: 4 }}>Present Address</h3>
      <p style={{ marginTop: 0, fontSize: '0.9rem' }}>Must match your address proof document.</p>

      <div className="form-group">
        <label className="form-label">House / Flat No. &amp; Building <span className="req">*</span></label>
        <input className="form-input" placeholder="e.g. Flat 4B, Sunrise Apartments" value={data.line1 || ''} onChange={e => f('line1', e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Street / Locality</label>
        <input className="form-input" placeholder="e.g. 12, M.G. Road" value={data.line2 || ''} onChange={e => f('line2', e.target.value)} />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">City <span className="req">*</span></label>
          <input className="form-input" placeholder="City" value={data.city || ''} onChange={e => f('city', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">PIN Code <span className="req">*</span></label>
          <input className="form-input" placeholder="6-digit PIN" maxLength={6} value={data.pin || ''} onChange={e => f('pin', e.target.value.replace(/\D/g, ''))} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">State <span className="req">*</span></label>
        <select className="form-select" value={data.state || ''} onChange={e => f('state', e.target.value)}>
          <option value="">Select State…</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ background: 'var(--gray-100)', borderRadius: 8, padding: '14px 16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <input type="checkbox" checked={data.permanentSame || false} onChange={e => f('permanentSame', e.target.checked)} style={{ width: 16, height: 16 }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--navy)' }}>Permanent address is the same as present address</span>
        </label>
      </div>
    </div>
  );
}

// ── Step 3: Documents
const DOCS = [
  { id: 'aadhaar', label: 'Aadhaar Card', desc: 'Front and back', required: true },
  { id: 'pan', label: 'PAN Card', desc: 'Clear scan', required: true },
  { id: 'birth', label: 'Birth Certificate / Class X Certificate', desc: 'For proof of DOB', required: true },
  { id: 'address', label: 'Address Proof', desc: 'Utility bill, bank statement (not older than 3 months)', required: true },
  { id: 'photo', label: 'Passport Photos', desc: '2 photos, 35×45mm, white background', required: true },
  { id: 'prev_passport', label: 'Previous Passport', desc: 'If renewal — original + copy of first & last pages', required: false },
];

function DocumentsStep({ data, onChange }) {
  const toggle = id => {
    const updated = { ...data, [id]: !data[id] };
    onChange(updated);
  };
  const done = DOCS.filter(d => data[d.id]).length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h3 style={{ marginBottom: 4 }}>Document Checklist</h3>
        <p style={{ fontSize: '0.9rem', marginBottom: 16 }}>Confirm you have each document ready for your PSK visit. Originals + self-attested copies required.</p>
        <div style={{ background: 'var(--saffron-pale)', border: '1px solid #ffd59e', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem', fontWeight: 500, color: '#9a4e00', marginBottom: 16 }}>
          ✅ {done} of {DOCS.length} documents confirmed
        </div>
      </div>
      {DOCS.map(doc => (
        <label key={doc.id} style={{
          display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px',
          border: `2px solid ${data[doc.id] ? 'var(--green)' : 'var(--gray-200)'}`,
          borderRadius: 8, cursor: 'pointer',
          background: data[doc.id] ? 'var(--green-light)' : 'white',
          transition: 'all 0.2s ease',
        }}>
          <input type="checkbox" checked={data[doc.id] || false} onChange={() => toggle(doc.id)} style={{ width: 18, height: 18, marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.95rem' }}>
              {doc.label} {doc.required && <span style={{ color: 'var(--error)', fontSize: '0.75rem' }}>Required</span>}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--gray-600)', marginTop: 2 }}>{doc.desc}</div>
          </div>
        </label>
      ))}
      <div className="alert alert-info" style={{ marginTop: 4 }}>
        💡 At the PSK, you will submit physical documents. This checklist is for your preparation only.
      </div>
    </div>
  );
}

// ── Step 4: Appointment
function AppointmentStep({ data, onChange }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffice, setSelectedOffice] = useState(data.office || '');

  useEffect(() => {
    API.get('/slots').then(r => { setSlots(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const offices = [...new Set(slots.map(s => s.office))];
  const officeSlots = slots.filter(s => s.office === selectedOffice && s.available);
  const dateGroups = officeSlots.reduce((acc, s) => {
    if (!acc[s.date]) acc[s.date] = [];
    acc[s.date].push(s);
    return acc;
  }, {});

  const selectSlot = slot => onChange({ ...data, slotId: slot.id, office: slot.office, date: slot.date, time: slot.time });
  const formatDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h3 style={{ marginBottom: 4 }}>Book Appointment</h3>
        <p style={{ fontSize: '0.9rem' }}>Choose your nearest Passport Seva Kendra and a convenient slot.</p>
      </div>

      <div className="form-group">
        <label className="form-label">Select Passport Seva Kendra <span className="req">*</span></label>
        {loading ? <div style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Loading offices…</div> : (
          <select className="form-select" value={selectedOffice} onChange={e => { setSelectedOffice(e.target.value); onChange({ ...data, office: e.target.value, slotId: null, date: null, time: null }); }}>
            <option value="">Choose a PSK…</option>
            {offices.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        )}
      </div>

      {selectedOffice && (
        <div>
          <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>Available Slots</label>
          {Object.entries(dateGroups).slice(0, 5).map(([date, daySlots]) => (
            <div key={date} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                {formatDate(date)}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {daySlots.map(slot => (
                  <button key={slot.id} className={`btn btn-sm ${data.slotId === slot.id ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ minWidth: 90 }} onClick={() => selectSlot(slot)}>
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(dateGroups).length === 0 && (
            <div className="alert alert-info">No available slots for this PSK. Please try another office.</div>
          )}
        </div>
      )}

      {data.slotId && (
        <div className="alert alert-success">
          ✅ Selected: <strong>{data.office}</strong> on <strong>{formatDate(data.date)}</strong> at <strong>{data.time}</strong>
        </div>
      )}
    </div>
  );
}

// ── Main Application Form
const STEPS = [
  { icon: '👤', label: 'Personal' },
  { icon: '🏠', label: 'Address' },
  { icon: '📄', label: 'Documents' },
  { icon: '📅', label: 'Appointment' },
];

export default function ApplicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle');
  const saveTimer = useRef(null);

  useEffect(() => {
    API.get(`/applications/${id}`).then(r => { setApp(r.data); setLoading(false); }).catch(() => navigate('/dashboard'));
  }, [id]);

  const save = useCallback(async (data) => {
    setSaveStatus('saving');
    try {
      const { data: updated } = await API.patch(`/applications/${id}`, data);
      setApp(updated);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
    }
  }, [id]);

  const autoSave = useCallback((data) => {
    setSaveStatus('saving');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(data), 1200);
  }, [save]);

  const updateSection = (section, val) => {
    const updated = { ...app, [section]: val };
    setApp(updated);
    autoSave(updated);
  };

  const nextStep = () => {
    const updated = { ...app, step: Math.min(app.step + 1, 4) };
    setApp(updated);
    save(updated);
  };

  const prevStep = () => {
    const updated = { ...app, step: Math.max(app.step - 1, 1) };
    setApp(updated);
    save(updated);
  };

  const submit = async () => {
    const updated = { ...app, status: 'submitted', step: 4 };
    await save(updated);
    navigate(`/confirmation/${id}`);
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--gray-400)' }}>Loading application…</div>;

  const step = app.step || 1;
  const isLastStep = step === 4;

  return (
    <div style={{ padding: '32px 24px', maxWidth: 700, margin: '0 auto' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <SaveIndicator status={saveStatus} />
      </div>

      <div className="card card-elevated" style={{ padding: '32px 28px' }}>
        <StepHeader step={step} steps={STEPS} />

        {step === 1 && <PersonalInfoStep data={app.personalInfo || {}} onChange={v => updateSection('personalInfo', v)} />}
        {step === 2 && <AddressStep data={app.addressInfo || {}} onChange={v => updateSection('addressInfo', v)} />}
        {step === 3 && <DocumentsStep data={app.documents || {}} onChange={v => updateSection('documents', v)} />}
        {step === 4 && <AppointmentStep data={app.appointment || {}} onChange={v => updateSection('appointment', v)} />}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--gray-200)' }}>
          <button className="btn btn-ghost" onClick={prevStep} disabled={step === 1}>← Previous</button>
          {isLastStep ? (
            <button className="btn btn-primary" onClick={submit} disabled={!app.appointment?.slotId}>
              Submit Application ✓
            </button>
          ) : (
            <button className="btn btn-primary" onClick={nextStep}>
              Save &amp; Continue →
            </button>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.8rem', color: 'var(--gray-400)' }}>
        Your progress is automatically saved. You can safely close this page and return later.
      </div>
    </div>
  );
}
