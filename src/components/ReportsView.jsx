import { useState } from 'react';
import { useRiskStore } from '../store/useRiskStore';
import { downloadClinicalReportPDF } from '../utils/exportReport';

export default function ReportsView() {
  const { patient, vitals, riskScore, riskLevel, recommendations } = useRiskStore();
  const [copied, setCopied] = useState(false);

  const handleExport = () => {
    setCopied(true);
    downloadClinicalReportPDF(patient, vitals, riskScore, riskLevel, recommendations);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }} className="custom-scroll">
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>
            Clinical Assessment Report — {patient.name}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
            Patient ID: #CV-8921 • Generated: {new Date().toLocaleDateString()} • Framingham Algorithmic Protocol v2.4
          </div>
        </div>

        <button
          onClick={handleExport}
          style={{
            padding: '10px 18px',
            borderRadius: 6,
            background: copied ? '#10b981' : '#38bdf8',
            color: '#090d16',
            fontWeight: 600,
            fontSize: 12,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? '✅ Report Copied' : '📄 Export Official Report'}
        </button>
      </div>

      {/* Grid Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        {/* Risk Score Summary Card */}
        <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 8 }}>
            Overall Cardiovascular Risk Index
          </div>
          <div className="font-mono" style={{ fontSize: 48, fontWeight: 700, color: riskLevel.color, lineHeight: 1 }}>
            {riskScore}%
          </div>
          <div
            style={{
              marginTop: 10,
              padding: '4px 12px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              color: riskLevel.color,
              background: riskLevel.bg,
              border: `1px solid ${riskLevel.color}35`,
              textTransform: 'uppercase',
            }}
          >
            {riskLevel.label}
          </div>
        </div>

        {/* AI Recommendations List */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>
            📋 Automated Clinical Triage Recommendations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recommendations.map((rec, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 14px',
                  borderRadius: 6,
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: 12,
                  color: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Vitals Diagnostic Breakdown */}
      <div className="glass-panel" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>
          📊 Recorded Clinical Parameters
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'Systolic Blood Pressure', value: `${vitals.bloodPressure} mmHg`, status: vitals.bloodPressure > 140 ? 'High' : 'Normal', color: vitals.bloodPressure > 140 ? '#ef4444' : '#10b981' },
            { label: 'LDL Cholesterol', value: `${vitals.ldlCholesterol} mg/dL`, status: vitals.ldlCholesterol > 160 ? 'High' : 'Normal', color: vitals.ldlCholesterol > 160 ? '#f97316' : '#10b981' },
            { label: 'Fasting Blood Glucose', value: `${vitals.fastingBloodSugar} mg/dL`, status: vitals.fastingBloodSugar > 125 ? 'Elevated' : 'Normal', color: vitals.fastingBloodSugar > 125 ? '#f59e0b' : '#10b981' },
            { label: 'Max Peak Heart Rate', value: `${vitals.maxHeartRate} bpm`, status: 'Recorded', color: '#38bdf8' },
          ].map((item, idx) => (
            <div key={idx} style={{ padding: 14, borderRadius: 6, background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 10, color: '#64748b' }}>{item.label}</div>
              <div className="font-mono" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginTop: 4 }}>{item.value}</div>
              <div style={{ fontSize: 9, color: item.color, fontWeight: 600, marginTop: 4 }}>● {item.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
