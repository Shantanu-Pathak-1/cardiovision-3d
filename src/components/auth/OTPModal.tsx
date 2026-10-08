import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, Clock3, LockKeyhole, ShieldCheck, X } from 'lucide-react';

type OTPModalProps = { onClose: () => void; onVerify: () => void };

export function OTPModal({ onClose, onVerify }: OTPModalProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [seconds, setSeconds] = useState(240);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const dialogRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (seconds === 0) return;
    const interval = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [seconds]);
  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    inputRefs.current[0]?.focus();
    const handleDialogKeys = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex="0"]');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleDialogKeys);
    return () => {
      document.removeEventListener('keydown', handleDialogKeys);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [onClose]);

  const updateDigit = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    setDigits((current) => current.map((digit, position) => position === index ? clean : digit));
    if (clean && index < 5) inputRefs.current[index + 1]?.focus();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus();
    if (event.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus();
  };
  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (!pasted.length) return;
    event.preventDefault();
    setDigits(Array.from({ length: 6 }, (_, index) => pasted[index] || ''));
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };
  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="otp-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} className="otp-modal" role="dialog" aria-modal="true" aria-labelledby="otp-title">
        <button className="icon-button otp-close" onClick={onClose} aria-label="Close verification dialog"><X size={17}/></button>
        <div className="otp-symbol"><LockKeyhole size={21}/></div>
        <span className="eyebrow">SPLIT-CARD CLINICAL AUTH / 02</span>
        <h2 id="otp-title">Verify your access</h2>
        <p className="otp-subtitle">Enter the six-digit code from your authenticator. This preview cannot send or validate a real verification code.</p>
        <div className="preview-notice"><ShieldCheck size={15}/><span>Presentation flow only — no code was sent.</span></div>
        <div className="otp-input-row" aria-label="Six digit verification code">
          {digits.map((digit, index) => <input key={index} ref={(element) => { inputRefs.current[index] = element; }} className="otp-digit" value={digit} onChange={(event) => updateDigit(index, event.target.value)} onKeyDown={(event) => handleKeyDown(event, index)} onPaste={handlePaste} inputMode="numeric" autoComplete={index === 0 ? 'one-time-code' : 'off'} aria-label={`Verification digit ${index + 1}`} maxLength={1} />)}
        </div>
        <div className="otp-expiration"><span><Clock3 size={14}/> Preview timer <b>{formattedTime}</b></span><button type="button" className="text-link" disabled title="An authentication service is not connected">Resend when connected</button></div>
        <button className="button button-primary otp-verify" type="button" onClick={onVerify} disabled={digits.some((digit) => !digit)}><span>Verify &amp; Enter Studio</span><ArrowRight size={16}/></button>
        <button className="otp-back text-link" onClick={onClose}><ArrowLeft size={14}/> Back to sign in</button>
      </section>
    </div>
  );
}
