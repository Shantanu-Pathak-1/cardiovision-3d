import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, ChevronDown, Eye, EyeOff, Fingerprint, Globe2, HeartPulse, LockKeyhole, Shield, ShieldCheck, Sparkles, UserRound, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandMark } from '../components/BrandMark';
import { ThemeToggle } from '../components/ThemeToggle';
import { ConnectionBadge } from '../components/ConnectionBadge';
import { OTPModal } from '../components/auth/OTPModal';

const quotes = [
  { text: 'Clinical clarity begins when complex signals become understandable.', source: 'CARDIOVISION PRINCIPLE / 01' },
  { text: 'A shared view of anatomy can open a new conversation about care.', source: 'CARDIOVISION PRINCIPLE / 02' },
  { text: 'Better context. More thoughtful questions. Human judgment at the center.', source: 'CARDIOVISION PRINCIPLE / 03' },
];
const roles = [
  { name: 'Cardiologist / Physician', icon: HeartPulse, description: 'CLINICAL ACCESS' },
  { name: 'Patient / Citizen', icon: UserRound, description: 'PERSONAL VIEW' },
  { name: 'Medical Researcher', icon: UsersRound, description: 'RESEARCH ACCESS' },
];

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'create'>(() => new URLSearchParams(window.location.search).get('mode') === 'create' ? 'create' : 'signin');
  const [role, setRole] = useState(roles[0].name);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [otpOpen, setOtpOpen] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const timer = window.setInterval(() => setQuoteIndex((current) => (current + 1) % quotes.length), 5800);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => { document.title = 'Clinical Access — CardioVision.AI'; }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice('Preview only — no credentials were transmitted and no one-time code was sent.');
    setOtpOpen(true);
  };

  return (
    <main className="auth-page">
      <header className="auth-topbar"><Link className="auth-back-home" to="/"><ArrowLeft size={15}/> Back to overview</Link><BrandMark/><div className="auth-top-actions"><span className="auth-environment"><span className="status-dot"/> AUTH FLOW PREVIEW</span><ThemeToggle/></div></header>
      <section className="auth-layout" aria-label="Clinical access">
        <aside className="auth-visual">
          <div className="auth-visual-grid" aria-hidden="true"/><div className="auth-orb auth-orb-one"/><div className="auth-orb auth-orb-two"/>
          <div className="auth-visual-top"><span className="visual-brand-lockup"><span className="brand-glyph"><HeartPulse size={21}/></span><span>CARDIOVISION<i>.AI</i></span></span><span className="auth-number">ACCESS / 01</span></div>
          <div className="auth-artifact" aria-hidden="true"><div className="auth-artifact-ring ring-a"/><div className="auth-artifact-ring ring-b"/><div className="auth-artifact-core"><HeartPulse size={58} strokeWidth={1.1}/></div><div className="auth-artifact-orbit orbit-a"/><div className="auth-artifact-orbit orbit-b"/><span className="auth-coordinate coordinate-a">LV · 01</span><span className="auth-coordinate coordinate-b">LAD · 02</span><span className="auth-coordinate coordinate-c">RA · 03</span></div>
          <div className="auth-visual-copy"><span className="eyebrow-pill auth-visual-badge"><ShieldCheck size={13}/> SPLIT-CARD CLINICAL AUTH</span><h1>Where anatomy<br/>meets <span>insight.</span></h1><p>A considered workspace for cardiovascular visualization, research, and care.</p></div>
          <div className="quote-panel"><span className="quote-mark">“</span><blockquote key={quotes[quoteIndex].text} className="quote-enter">{quotes[quoteIndex].text}</blockquote><div className="quote-meta"><span>{quotes[quoteIndex].source}</span><div className="quote-dots">{quotes.map((quote, index) => <button key={quote.source} aria-label={`Show quote ${index + 1}`} className={quoteIndex === index ? 'selected' : ''} onClick={() => setQuoteIndex(index)} />)}</div></div></div>
          <div className="auth-visual-footer"><span><span className="status-dot"/> PREVIEW SYSTEM</span><span>PRIVACY BY DESIGN*</span></div>
        </aside>

        <section className="auth-form-card">
          <div className="auth-form-head"><div><span className="eyebrow">CLINICAL ACCESS / AUTHENTICATE</span><h2>{mode === 'signin' ? 'Sign in to your studio.' : 'Create your access.'}</h2><p>{mode === 'signin' ? 'Use your account details to continue.' : 'Request access through your organization.'}</p></div><ConnectionBadge>AUTH SERVICE UNCONNECTED</ConnectionBadge></div>
          <div className="auth-tabs" role="tablist" aria-label="Account action"><button role="tab" aria-selected={mode === 'signin'} className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setNotice(''); }}>Sign In</button><button role="tab" aria-selected={mode === 'create'} className={mode === 'create' ? 'active' : ''} onClick={() => { setMode('create'); setNotice(''); }}>Create Account</button></div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-section-heading"><span className="form-step">01</span><div><b>IDENTIFY YOUR ACCESS</b><small>Select the profile that best describes you.</small></div></div>
            <div className="role-selector" role="group" aria-label="User role">
              {roles.map(({ name, icon: Icon, description }) => <button type="button" key={name} onClick={() => setRole(name)} className={`role-option ${role === name ? 'selected' : ''}`} aria-pressed={role === name}><Icon size={16}/><span><b>{name}</b><small>{description}</small></span><span className="role-radio"/></button>)}
            </div>

            {mode === 'create' && <details className="auth-optional-details location-disclosure">
              <summary><span className="form-step">02</span><span className="optional-summary-copy"><b>ORGANIZATION DETAILS</b><small>Location or access code</small></span><span className="optional-summary-tag">OPTIONAL</span><ChevronDown size={14}/></summary>
              <div className="form-two-cols location-inputs">
                <label className="field-label"><span>REGION / STATE <i>OPTIONAL</i></span><span className="input-with-icon"><Globe2 size={14}/><input type="text" name="region" placeholder="Your region or state" autoComplete="address-level1" maxLength={80}/></span></label>
                <label className="field-label"><span>CLINICAL CENTER / CITY <i>OPTIONAL</i></span><span className="input-with-icon"><BadgeCheck size={14}/><input type="text" name="center" placeholder="Clinic or city" autoComplete="organization" maxLength={100}/></span></label>
              </div>
              <label className="field-label access-code-field"><span>CLINICAL ACCESS CODE <i>OPTIONAL IN PREVIEW</i></span><span className="input-with-icon"><Shield size={14}/><input type="text" name="accessCode" placeholder="Organization-issued access code" autoComplete="off" maxLength={80}/></span></label>
            </details>}

            <div className="form-section-heading identity-heading"><span className="form-step">03</span><div><b>YOUR CREDENTIALS</b><small>All values remain in this local preview.</small></div></div>
            {mode === 'create' && <label className="field-label"><span>FULL NAME</span><span className="input-with-icon"><UserRound size={14}/><input type="text" name="fullName" placeholder="e.g. Dr. Alex Morgan" autoComplete="name" required/></span></label>}
            <div className="form-two-cols credentials-row">
              <label className="field-label"><span>CLINICAL EMAIL</span><span className="input-with-icon"><span className="input-at">@</span><input type="email" name="email" placeholder="name@clinic.org" autoComplete="email" required/></span></label>
              <label className="field-label"><span>PASSWORD</span><span className="input-with-icon"><Fingerprint size={14}/><input type={passwordVisible ? 'text' : 'password'} name="password" placeholder="Enter password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={8} required/><button className="password-eye" type="button" aria-label={passwordVisible ? 'Hide password' : 'Show password'} onClick={() => setPasswordVisible((value) => !value)}>{passwordVisible ? <EyeOff size={15}/> : <Eye size={15}/>}</button></span></label>
            </div>
            <label className="preview-check"><input type="checkbox" required/><span>I understand this preview does not authenticate, send a code, or process health information.</span></label>
            {notice && <div className="inline-notice" role="status"><Sparkles size={15}/>{notice}</div>}
            <button className="button button-primary auth-submit" type="submit"><span>{mode === 'signin' ? 'Continue to verification' : 'Create preview request'}</span><ArrowRight size={16}/></button>
            <div className="auth-form-security"><LockKeyhole size={13}/><span>FORM DEMO ONLY</span><i/> <span>Nothing is submitted to an identity service</span></div>
          </form>
          <div className="auth-form-bottom"><p>Clinical access systems should use the connected organization identity provider.</p><Link to="/">Explore the platform <ArrowRight size={13}/></Link></div>
        </section>
      </section>
      <footer className="auth-disclaimer"><ShieldCheck size={14}/><span>* Preview only; security has not been independently certified. Do not enter real patient data.</span></footer>
      {otpOpen && <OTPModal onClose={() => setOtpOpen(false)} onVerify={() => { setOtpOpen(false); setNotice('Verification was not performed — connect your authentication service to enable access.'); }} />}
    </main>
  );
}
