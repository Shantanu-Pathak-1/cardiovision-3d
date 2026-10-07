import { useRiskStore } from '../store/useRiskStore';

export default function AnalyticsView() {
  const { riskScore, vitals } = useRiskStore();

  const anatomicalRisks = [
    { zone: 'LAD Coronary Artery', location: 'Anterior Interventricular Sulcus', riskPct: Math.min(99, Math.round(riskScore * 0.96)), severity: riskScore > 60 ? 'Critical' : riskScore > 35 ? 'Moderate' : 'Low', color: riskScore > 60 ? '#ef4444' : riskScore > 35 ? '#f97316' : '#10b981' },
    { zone: 'Left Ventricle Wall', location: 'Anterolateral Myocardium', riskPct: Math.min(95, Math.round(riskScore * 0.82)), severity: riskScore > 60 ? 'High' : riskScore > 35 ? 'Elevated' : 'Optimal', color: riskScore > 60 ? '#f97316' : riskScore > 35 ? '#f59e0b' : '#10b981' },
    { zone: 'Aortic & Mitral Valve', location: 'Aortic Root Base', riskPct: Math.min(90, Math.round(riskScore * 0.68)), severity: riskScore > 60 ? 'Moderate' : 'Optimal', color: riskScore > 60 ? '#f59e0b' : '#10b981' },
    { zone: 'Right Atrium & SA Node', location: 'Posterior Superior Atrial Wall', riskPct: Math.min(85, Math.round(riskScore * 0.50)), severity: 'Normal Rhythm', color: '#10b981' },
  ];

  return (
    <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }} className="custom-scroll">
      {/* Analytics Overview Title */}
      <div className="glass-panel" style={{ padding: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
          📈 Anatomical Risk & Hemodynamic Analytics
        </h2>
        <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
          Algorithmic breakdown of spatial disease probability mapped onto 3D anatomical structures.
        </p>
      </div>

      {/* Spatial Anatomical Occlusion Risk Table */}
      <div className="glass-panel" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>
          🫀 Spatial Anatomical Risk Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {anatomicalRisks.map((item, idx) => (
            <div key={idx} style={{ padding: 14, borderRadius: 6, background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>{item.zone}</span>
                  <span style={{ fontSize: 10, color: '#64748b', marginLeft: 10 }}>{item.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: item.color, background: `${item.color}15`, padding: '2px 8px', borderRadius: 4, border: `1px solid ${item.color}35` }}>
                    {item.severity}
                  </span>
                  <span className="font-mono" style={{ fontSize: 14, fontWeight: 700, color: item.color }}>
                    {item.riskPct}%
                  </span>
                </div>
              </div>

              {/* Minimalist Risk Bar */}
              <div style={{ width: '100%', height: 4, borderRadius: 4, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                <div style={{ width: `${item.riskPct}%`, height: '100%', background: item.color, transition: 'width 0.3s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Baseline Metric Matrix */}
      <div className="glass-panel" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>
          📐 Framingham Model Baseline Thresholds
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <div style={{ padding: 14, borderRadius: 6, background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: 10, color: '#64748b' }}>Hypertension Cutoff</div>
            <div className="font-mono" style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc', marginTop: 4 }}>140 mmHg</div>
            <div style={{ fontSize: 10, color: vitals.bloodPressure >= 140 ? '#ef4444' : '#10b981', marginTop: 4 }}>
              Current: {vitals.bloodPressure} mmHg
            </div>
          </div>

          <div style={{ padding: 14, borderRadius: 6, background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: 10, color: '#64748b' }}>High LDL Threshold</div>
            <div className="font-mono" style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc', marginTop: 4 }}>160 mg/dL</div>
            <div style={{ fontSize: 10, color: vitals.ldlCholesterol >= 160 ? '#f97316' : '#10b981', marginTop: 4 }}>
              Current: {vitals.ldlCholesterol} mg/dL
            </div>
          </div>

          <div style={{ padding: 14, borderRadius: 6, background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: 10, color: '#64748b' }}>Hyperglycemia Cutoff</div>
            <div className="font-mono" style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc', marginTop: 4 }}>126 mg/dL</div>
            <div style={{ fontSize: 10, color: vitals.fastingBloodSugar >= 126 ? '#f59e0b' : '#10b981', marginTop: 4 }}>
              Current: {vitals.fastingBloodSugar} mg/dL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
