import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { Activity, AlertTriangle, ArrowRight, BadgeCheck, Check, FileImage, FileText, HeartPulse, Info, LockKeyhole, ShieldAlert, Upload, UserRound, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useRiskStore } from '../../store/useRiskStore';
import { downloadClinicalReportPDF } from '../../utils/exportReport';

export function VitalsPanel() {
  const {
    patient,
    vitals,
    setVital,
    riskScore,
    riskLevel,
    recommendations,
    uploadLabDocument,
    isExtractingVision,
    visionSuccessMessage,
    isAnalyzingML
  } = useRiskStore();

  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const receiveFile = async (file?: File) => {
    if (!file) return;
    const supported = file.type === 'application/pdf' || file.type.startsWith('image/');
    if (!supported) { 
      setNotice('Please select an ECG image or lab report PDF.'); 
      return; 
    }
    setNotice(null);
    try {
      await uploadLabDocument(file);
    } catch (err) {
      setNotice('Error analyzing lab document with Vision AI.');
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault(); 
    setDragging(false); 
    if (event.dataTransfer.files[0]) {
      receiveFile(event.dataTransfer.files[0]);
    }
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      receiveFile(event.target.files[0]);
    }
  };

  const handleExportPDF = () => {
    downloadClinicalReportPDF(patient, vitals, riskScore, riskLevel, recommendations);
    setNotice('✓ Clinical PDF Report generated & downloaded.');
    setTimeout(() => setNotice(null), 3000);
  };

  const sliders = [
    { key: 'bloodPressure', label: 'Blood Pressure', unit: 'mmHg', min: 80, max: 200, icon: Activity },
    { key: 'ldlCholesterol', label: 'LDL Cholesterol', unit: 'mg/dL', min: 40, max: 260, icon: HeartPulse },
    { key: 'fastingBloodSugar', label: 'Fasting Blood Sugar', unit: 'mg/dL', min: 55, max: 250, icon: Activity },
    { key: 'maxHeartRate', label: 'Max Heart Rate', unit: 'BPM', min: 80, max: 220, icon: HeartPulse },
    { key: 'age', label: 'Age', unit: 'years', min: 18, max: 95, icon: UserRound },
  ] as const;

  return (
    <aside className="vitals-panel" aria-label="Patient inputs and risk engine">
      {/* Patient Header Card */}
      <div className="patient-card">
        <div className="patient-avatar"><UserRound size={19}/><span/></div>
        <div className="patient-meta">
          <span className="eyebrow">CLINICAL PROFILE / CV–042</span>
          <h2>{patient.name}</h2>
          <p>{vitals.age} years <i/> {patient.gender || 'Male'} <i/> Active Record</p>
        </div>
        <div className="risk-gauge-badge" style={{ borderColor: `${riskLevel.color}40`, background: riskLevel.bg }}>
          <span className="gauge-overline">10-YR CVD RISK</span>
          <strong style={{ color: riskLevel.color }}>{riskScore}%</strong>
          <span className="risk-state-label" style={{ color: riskLevel.color }}>{riskLevel.label.toUpperCase()}</span>
        </div>
      </div>

      <div className="panel-disclaimer">
        <Info size={14}/>
        <span>Live Framingham &amp; ASCVD multi-metric risk engine active. Values update predictions dynamically.</span>
      </div>

      <div className="risk-tier-row">
        <span>RISK CLASSIFICATION</span>
        <div>
          <i className="tier-low"/>LOW
          <i className="tier-moderate"/>MODERATE
          <i className="tier-high"/>HIGH
          <i className="tier-severe"/>SEVERE
        </div>
      </div>

      {/* 01 Vitals Sliders */}
      <div className="panel-section-title">
        <div>
          <span className="section-counter">01</span>
          <h3>Cardiovascular Vitals</h3>
        </div>
        {isAnalyzingML && <span className="text-[10px] font-mono text-sky-400 animate-pulse">Calculating ML Risk…</span>}
      </div>

      <div className="vitals-list">
        {sliders.map(({ key, label, unit, min, max, icon: Icon }) => {
          const value = vitals[key] || min;
          const progress = ((Number(value) - min) / (max - min)) * 100;
          return (
            <label className="vital-slider" key={key}>
              <span className="vital-slider-head">
                <span className="vital-icon"><Icon size={14}/></span>
                <span className="vital-name">{label}</span>
                <span className="vital-value"><strong>{value}</strong><small>{unit}</small></span>
              </span>
              <input 
                type="range" 
                min={min} 
                max={max} 
                value={Number(value)} 
                style={{ '--range-progress': `${progress}%` } as React.CSSProperties} 
                onChange={(e) => setVital(key, Number(e.target.value))} 
                aria-label={label}
              />
              <span className="range-bounds">
                <span>{min} {unit}</span>
                <span>{max} {unit}</span>
              </span>
            </label>
          );
        })}
      </div>

      {/* Risk Factor Toggles */}
      <div className="risk-factor-row">
        <span className="risk-factor-title"><ShieldAlert size={15}/> RISK FACTORS</span>
        <div className="risk-toggles">
          <button 
            role="switch" 
            aria-checked={vitals.smoker} 
            onClick={() => setVital('smoker', !vitals.smoker)} 
            className={`risk-switch ${vitals.smoker ? 'on' : ''}`}
          >
            <span className="switch-name">Smoker</span>
            <span className="switch-state">{vitals.smoker ? 'YES' : 'NO'}</span>
            <span className="switch-track"><i/></span>
          </button>
          <button 
            role="switch" 
            aria-checked={vitals.diabetic} 
            onClick={() => setVital('diabetic', !vitals.diabetic)} 
            className={`risk-switch ${vitals.diabetic ? 'on' : ''}`}
          >
            <span className="switch-name">Diabetic</span>
            <span className="switch-state">{vitals.diabetic ? 'YES' : 'NO'}</span>
            <span className="switch-track"><i/></span>
          </button>
        </div>
      </div>

      {/* 02 Multimodal Vision AI Dropzone */}
      <div className="vision-section">
        <div className="panel-section-title vision-title">
          <div>
            <span className="section-counter">02</span>
            <h3>Multimodal Vision AI</h3>
          </div>
          <span className="vision-offline" style={{ color: '#4ade80', borderColor: 'rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.1)' }}>
            <i style={{ background: '#4ade80' }}/> GEMINI FLASH VISION
          </span>
        </div>

        <input ref={fileRef} className="sr-only" type="file" accept="image/*,application/pdf" onChange={onFileChange}/>
        <div 
          className={`dropzone ${dragging ? 'is-dragging' : ''} ${isExtractingVision ? 'is-extracting' : ''}`} 
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }} 
          onDragLeave={() => setDragging(false)} 
          onDrop={onDrop}
        >
          {isExtractingVision && <div className="scanner-sweep" aria-hidden="true"/>}
          <div className="dropzone-icon">
            {isExtractingVision ? <Sparkles size={18} className="animate-spin text-sky-400" /> : <Upload size={18}/>}
          </div>
          <div className="dropzone-copy">
            <strong>{isExtractingVision ? 'Analyzing Lab / ECG with Vision AI…' : 'Drop ECG Strip or Lab Report PDF'}</strong>
            <span>{isExtractingVision ? 'Extracting BP, Cholesterol & Vitals' : 'Auto-fills vitals via Gemini 2.5 Flash Vision'}</span>
          </div>
          <button className="button button-quiet dropzone-browse" type="button" onClick={() => fileRef.current?.click()}>
            Browse
          </button>
          <div className="dropzone-foot"><FileText size={11}/> SECURE VISION PIPELINE <i/> <LockKeyhole size={11}/> HIPAA SAFE</div>
        </div>

        {visionSuccessMessage && (
          <p className="panel-notice text-emerald-400 border-emerald-500/30 bg-emerald-500/10" role="status">
            <CheckCircle2 size={13}/>{visionSuccessMessage}
          </p>
        )}

        {notice && (
          <p className="panel-notice" role="status">
            <AlertTriangle size={13}/>{notice}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="vitals-action-bar">
        <button 
          className="button button-primary recalc-button" 
          type="button" 
          onClick={() => setVital('bloodPressure', vitals.bloodPressure)}
        >
          <Activity size={15}/>
          <span>Recalculate Risk Index</span>
          <ArrowRight size={15}/>
        </button>

        <button 
          className="button button-outline export-button" 
          type="button" 
          onClick={handleExportPDF}
        >
          <FileText size={15}/>
          <span>Export Clinical PDF Report</span>
        </button>

        <div className="action-safe-note">
          <LockKeyhole size={12}/> Encrypted Transport <i/> <BadgeCheck size={12}/> Verified Clinical Model
        </div>
      </div>
    </aside>
  );
}
