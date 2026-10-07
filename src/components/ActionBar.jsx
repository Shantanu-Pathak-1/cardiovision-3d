import { useState } from 'react';
import { useRiskStore } from '../store/useRiskStore';
import { ClipboardList, FileDown, Check } from 'lucide-react';

export default function ActionBar() {
  const { recommendations, riskScore, riskLevel } = useRiskStore();
  const [copied, setCopied] = useState(false);

  const handleExport = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${riskScore > 70 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
      }}
    >
      {/* Title & Engine Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: riskLevel.color,
            background: riskLevel.bg,
            border: `1px solid ${riskLevel.color}35`,
          }}
        >
          <ClipboardList size={18} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>
              Clinical Assessment Protocol
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 4,
                color: riskLevel.color,
                background: riskLevel.bg,
                border: `1px solid ${riskLevel.color}35`,
              }}
            >
              {riskLevel.label} ({riskScore}%)
            </span>
          </div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>
            Framingham Cardiovascular Risk Triage Guidelines
          </div>
        </div>
      </div>

      {/* Recommendation Chips / Items */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flex: 1,
          overflowX: 'auto',
          padding: '2px 0',
        }}
        className="custom-scroll"
      >
        {recommendations.map((rec, i) => (
          <div
            key={i}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              color: '#cbd5e1',
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {rec}
          </div>
        ))}
      </div>

      {/* Action / Export Button */}
      <button
        onClick={handleExport}
        style={{
          flexShrink: 0,
          padding: '8px 14px',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          background: copied ? '#10b981' : '#38bdf8',
          border: 'none',
          color: '#090d16',
          transition: 'all 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {copied ? <Check size={16} /> : <FileDown size={16} />}
        <span>{copied ? 'Report Copied' : 'Export Clinical Report'}</span>
      </button>
    </div>
  );
}
