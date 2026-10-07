import { useRef, useEffect } from 'react';
import { useRiskStore } from '../store/useRiskStore';

export default function RiskGauge() {
  const { riskScore, riskLevel } = useRiskStore();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    const cx = W / 2;
    const cy = H - 24;
    const r = 88;
    const lineWidth = 8; // Minimalist thin gauge track

    ctx.clearRect(0, 0, W, H);

    // 1. Sleek Track Background Arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineCap = 'round';
    ctx.stroke();

    // 2. Dynamic Semantic Risk Arc
    const currentAngle = Math.PI + (riskScore / 100) * Math.PI;

    if (riskScore > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI, currentAngle);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = riskLevel.color;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // 3. Subtle Needle Indicator
    const needleLen = r - 8;
    const nx = cx + needleLen * Math.cos(currentAngle);
    const ny = cy + needleLen * Math.sin(currentAngle);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#f8fafc';
    ctx.stroke();

    // Center Pivot
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = riskLevel.color;
    ctx.stroke();

    // 4. Subtle Scale End Labels
    ctx.font = '500 10px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    ctx.fillText('0%', cx - r - 6, cy + 16);

    ctx.textAlign = 'right';
    ctx.fillText('100%', cx + r + 6, cy + 16);
  }, [riskScore, riskLevel]);

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <canvas
        ref={canvasRef}
        width={280}
        height={140}
        style={{ width: '100%', maxWidth: '280px', display: 'block' }}
      />

      {/* Clean Clinical Readout */}
      <div
        style={{
          position: 'absolute',
          top: '48%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          className="font-mono"
          style={{
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1,
            color: '#f8fafc',
            letterSpacing: -0.5,
          }}
        >
          {riskScore}<span style={{ fontSize: 16, color: '#64748b', fontWeight: 500 }}>%</span>
        </div>

        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            marginTop: 4,
            padding: '2px 10px',
            borderRadius: 4,
            color: riskLevel.color,
            background: riskLevel.bg,
            border: `1px solid ${riskLevel.color}35`,
            display: 'inline-block',
          }}
        >
          {riskLevel.label}
        </div>
      </div>
    </div>
  );
}
