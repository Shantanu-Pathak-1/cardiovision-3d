import { Link } from 'react-router-dom';

export function BrandMark({ compact = false, to = '/' }: { compact?: boolean; to?: string }) {
  return (
    <Link to={to} className={`brand-mark ${compact ? 'brand-mark-compact' : ''}`} aria-label="CardioVision.AI home">
      <span className="brand-glyph" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none">
          <path d="M20 34S6.2 25.7 6.2 15.8c0-6.1 7.6-8.5 12.2-2.3l1.6 2.2 1.6-2.2c4.6-6.2 12.2-3.8 12.2 2.3C33.8 25.7 20 34 20 34Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M9.4 20.1h6l2.6-5.4 4.4 11.4 2.4-6h5.8" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {!compact && <span className="brand-type">CARDIO<span>VISION</span><i>.AI</i><small>CLINICAL STUDIO</small></span>}
    </Link>
  );
}
