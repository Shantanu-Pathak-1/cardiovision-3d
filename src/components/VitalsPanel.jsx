import { useState, useRef } from 'react';
import { useRiskStore } from '../store/useRiskStore';
import RiskGauge from './RiskGauge';
import { User, SlidersHorizontal, Activity, Flame, Droplet, Check, Edit2, UploadCloud, Sparkles, Loader2, FileCheck } from 'lucide-react';

const VITALS = [
  { key: 'bloodPressure',     label: 'Systolic Blood Pressure', unit: 'mmHg', min: 90,  max: 200, thresholds: [120, 130, 140, 180] },
  { key: 'ldlCholesterol',    label: 'LDL Cholesterol Level',   unit: 'mg/dL', min: 50,  max: 250, thresholds: [100, 130, 160, 190] },
  { key: 'fastingBloodSugar', label: 'Fasting Blood Glucose',   unit: 'mg/dL', min: 60,  max: 300, thresholds: [100, 125, 200] },
  { key: 'maxHeartRate',      label: 'Max Peak Heart Rate',     unit: 'bpm',   min: 60,  max: 220, thresholds: [100, 140, 180] },
];

function getVitalStatus(val, thresholds) {
  if (val >= thresholds[3] || val < 80) return { text: 'Critical', color: '#ef4444' };
  if (val >= thresholds[2]) return { text: 'High', color: '#f97316' };
  if (val >= thresholds[1]) return { text: 'Elevated', color: '#f59e0b' };
  return { text: 'Optimal', color: '#10b981' };
}

function Slider({ cfg, value, onChange }) {
  const status = getVitalStatus(value, cfg.thresholds);
  const pct = ((value - cfg.min) / (cfg.max - cfg.min)) * 100;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500 }}>{cfg.label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              padding: '2px 6px',
              borderRadius: 4,
              color: status.color,
              background: `${status.color}15`,
              border: `1px solid ${status.color}30`,
            }}
          >
            {status.text}
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#f8fafc',
              background: 'rgba(30, 41, 59, 0.6)',
              padding: '2px 8px',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {value} <span style={{ color: '#64748b', fontSize: 10, fontWeight: 400 }}>{cfg.unit}</span>
          </span>
        </div>
      </div>

      <input
        type="range"
        min={cfg.min}
        max={cfg.max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="cardio-slider"
        style={{ '--track-fill': `${pct}%`, '--thumb-color': status.color }}
      />
    </div>
  );
}

export default function VitalsPanel() {
  const {
    patient,
    vitals,
    riskScore,
    riskLevel,
    setVital,
    setPatient,
    uploadLabDocument,
    isExtractingVision,
    visionSuccessMessage,
    isAnalyzingML,
  } = useRiskStore();

  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadLabDocument(file);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        height: '100%',
        overflowY: 'auto',
        paddingRight: 4,
      }}
      className="custom-scroll"
    >
      {/* Patient Profile Card */}
      <div className="glass-panel animate-slide-up delay-1" style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              flexShrink: 0,
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <User size={20} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: 14 }}>
                {patient.name}
              </span>
              <button
                onClick={() => setEditing(!editing)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 4,
                  padding: '2px 6px',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  fontSize: 10,
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {editing ? <Check size={12} /> : <Edit2 size={12} />}
                {editing ? 'Save' : 'Edit'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#64748b' }}>
              <span>Age: <b style={{ color: '#cbd5e1', fontWeight: 500 }}>{patient.age} yrs</b></span>
              <span>•</span>
              <span>Gender: <b style={{ color: '#cbd5e1', fontWeight: 500 }}>{patient.gender}</b></span>
            </div>
          </div>

          {/* Quick Score Badge */}
          <div
            className={riskScore > 70 ? 'pulse-critical' : ''}
            style={{
              textAlign: 'center',
              padding: '6px 12px',
              borderRadius: 6,
              flexShrink: 0,
              color: riskLevel.color,
              background: riskLevel.bg,
              border: `1px solid ${riskLevel.color}35`,
              transition: 'all 0.3s ease',
            }}
          >
            <div className="font-mono" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>
              {isAnalyzingML ? '...' : `${riskScore}%`}
            </div>
            <div style={{ fontSize: 9, fontWeight: 600, marginTop: 2, textTransform: 'uppercase' }}>
              {riskLevel.label}
            </div>
          </div>
        </div>

        {/* Edit Form Dropdown */}
        {editing && (
          <div
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 10,
            }}
          >
            <div>
              <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>Name</div>
              <input
                type="text"
                value={patient.name}
                onChange={(e) => setPatient('name', e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 4,
                  color: '#f8fafc',
                  padding: '5px 8px',
                  fontSize: 12,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>Age</div>
              <input
                type="number"
                value={patient.age === '' || patient.age === 0 ? '' : patient.age}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setPatient('age', '');
                  } else {
                    const num = parseInt(val, 10);
                    setPatient('age', isNaN(num) ? '' : num);
                    if (!isNaN(num) && num > 0) {
                      setVital('age', num);
                    }
                  }
                }}
                onBlur={() => {
                  if (!patient.age || Number(patient.age) <= 0) {
                    setPatient('age', 52);
                    setVital('age', 52);
                  }
                }}
                style={{
                  width: '100%',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 4,
                  color: '#f8fafc',
                  padding: '5px 8px',
                  fontSize: 12,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>Gender</div>
              <select
                value={patient.gender}
                onChange={(e) => setPatient('gender', e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 4,
                  color: '#f8fafc',
                  padding: '5px 8px',
                  fontSize: 12,
                  outline: 'none',
                }}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Feature 1: Vision Modality Smart Auto-Fill Zone */}
      <div className="glass-panel animate-slide-up delay-2" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} style={{ color: '#38bdf8' }} />
            <h3 style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1', letterSpacing: 0.8, textTransform: 'uppercase' }}>
              Vision AI Smart Auto-Fill
            </h3>
          </div>
          <span style={{ fontSize: 9, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            AI Vision Extraction
          </span>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,.pdf"
          style={{ display: 'none' }}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className={isExtractingVision ? 'animate-scan' : ''}
          style={{
            border: '1px dashed rgba(255, 255, 255, 0.18)',
            borderRadius: 8,
            padding: '12px 14px',
            textAlign: 'center',
            cursor: 'pointer',
            background: 'rgba(30, 41, 59, 0.4)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.7)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)';
          }}
        >
          {isExtractingVision ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38bdf8', fontSize: 11, fontWeight: 500 }}>
              <Loader2 size={16} className="animate-spin" />
              <span>Parsing Medical Document & ECG…</span>
            </div>
          ) : (
            <>
              <UploadCloud size={18} style={{ color: '#38bdf8' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, color: '#f8fafc', fontWeight: 500 }}>
                  Upload ECG or Lab Report
                </div>
                <div style={{ fontSize: 9, color: '#64748b' }}>
                  Auto-extract BP, LDL & Glucose parameters
                </div>
              </div>
            </>
          )}
        </div>

        {visionSuccessMessage && (
          <div className="animate-slide-up" style={{ marginTop: 10, padding: '6px 10px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', fontSize: 10, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileCheck size={14} />
            <span>{visionSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Dynamic Vitals Parameters Card */}
      <div className="glass-panel animate-slide-up delay-3" style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <SlidersHorizontal size={14} style={{ color: '#38bdf8' }} />
            <h3 style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1', letterSpacing: 0.8, textTransform: 'uppercase' }}>
              Clinical Vitals Parameters
            </h3>
          </div>
          <span style={{ fontSize: 10, color: '#64748b' }}>Realtime Input</span>
        </div>

        {VITALS.map((cfg) => (
          <Slider key={cfg.key} cfg={cfg} value={vitals[cfg.key]} onChange={(v) => setVital(cfg.key, v)} />
        ))}

        {/* Lifestyle Risk Factors */}
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          {[
            { key: 'smoker', label: 'Active Smoker', icon: Flame, cost: '+15%' },
            { key: 'diabetic', label: 'Diabetic History', icon: Droplet, cost: '+10%' },
          ].map(({ key, label, icon: Icon, cost }) => (
            <button
              key={key}
              onClick={() => setVital(key, !vitals[key])}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: vitals[key] ? 'rgba(239, 68, 68, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                border: `1px solid ${vitals[key] ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                color: vitals[key] ? '#f87171' : '#94a3b8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon size={14} />
                <span>{label}</span>
              </div>
              <span
                style={{
                  fontSize: 9,
                  opacity: 0.8,
                  padding: '2px 5px',
                  borderRadius: 4,
                  background: vitals[key] ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.06)',
                  color: '#f8fafc',
                }}
              >
                {cost}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Feature 2: Tabular ML Risk Engine Card */}
      <div className="glass-panel animate-slide-up delay-4" style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={14} style={{ color: '#38bdf8' }} />
            <h3 style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1', letterSpacing: 0.8, textTransform: 'uppercase' }}>
              Live Cardiac Risk Index
            </h3>
          </div>
          <span style={{ fontSize: 10, color: isAnalyzingML ? '#38bdf8' : '#64748b', fontWeight: isAnalyzingML ? 600 : 400 }}>
            {isAnalyzingML ? '⚡ Recalculating Risk…' : 'Clinical Risk Engine'}
          </span>
        </div>

        <RiskGauge />
      </div>
    </div>
  );
}
