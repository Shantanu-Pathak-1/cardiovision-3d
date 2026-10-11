import { Suspense, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Activity, Aperture, Crosshair, Move3D, RotateCcw, RotateCw, ScanLine, ZoomIn, ZoomOut, Heart } from 'lucide-react';
import { HeartEnvironment, HeartModelMount, type HeartModelAdapter } from './HeartScene';
import { EcgTrace } from '../Telemetry';
import { ConnectionBadge } from '../ConnectionBadge';
import { useRiskStore } from '../../store/useRiskStore';

type HeartViewerProps = { riskLevel: 'low' | 'moderate' | 'high' | 'severe'; model?: ReactNode | HeartModelAdapter };

export function HeartViewer({ riskLevel, model }: HeartViewerProps) {
  const { riskScore, vitals } = useRiskStore();
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [crossSection, setCrossSection] = useState(false);
  const [activeChamber, setActiveChamber] = useState('LV');
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);

  const riskLabel = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
  const currentBpm = Math.min(180, Math.max(60, Number(vitals.maxHeartRate) || 72));

  const chambers = [
    { 
      key: 'LV', 
      name: 'Left Ventricle', 
      stat: `Pressure: ${vitals.bloodPressure || 120} mmHg`, 
      meta: riskScore > 50 ? 'Elevated Systolic Strain' : 'Normal Elasticity', 
      position: 'pin-left' 
    },
    { 
      key: 'LAD', 
      name: 'LAD Coronary Artery', 
      stat: `Perfusion: ${riskScore > 60 ? '0.4 L/min (Stenosis)' : '1.2 L/min (Normal)'}`, 
      meta: riskScore > 50 ? 'Occlusion Risk Zone' : 'Clear Lumen', 
      position: 'pin-top' 
    },
    { 
      key: 'RA', 
      name: 'Right Atrium', 
      stat: 'SA Node Rhythm: Normal', 
      meta: 'Hemodynamic Stable', 
      position: 'pin-right' 
    },
  ];

  return (
    <section className={`heart-studio risk-${riskLevel}`} aria-label="Interactive 3D heart viewer">
      <div className="studio-topline">
        <div>
          <span className="eyebrow"><span className="eyebrow-marker"/> SPATIAL ANATOMY / 3D CANVAS</span>
          <h2>Heart Studio <span className="studio-version">3D GLTF</span></h2>
        </div>
        <div className="studio-top-right">
          <ConnectionBadge>3D WEBGL ENGINE ACTIVE</ConnectionBadge>
          <span className={`risk-display-tag risk-display-${riskLevel}`}>
            <i/>{riskLabel} Risk ({riskScore}%)
          </span>
        </div>
      </div>

      <div className="studio-stage">
        <div className="stage-grid" aria-hidden="true"/><div className="stage-vignette" aria-hidden="true"/>
        <div className="stage-meta">
          <span><Crosshair size={13}/> REAL-TIME 3D HEART COORDINATES</span>
          <span>CAMERA 01 <i/> 60 FPS ORBIT</span>
        </div>

        <div className="stage-tools" aria-label="3D viewer controls">
          <button className={wireframe ? 'active' : ''} onClick={() => setWireframe((v) => !v)} aria-label="Toggle wireframe mode" aria-pressed={wireframe} title="Wireframe mode">
            <Aperture size={15}/><span>Wireframe</span>
          </button>
          <button className={autoRotate ? 'active' : ''} onClick={() => setAutoRotate((v) => !v)} aria-label="Toggle auto rotation" aria-pressed={autoRotate} title="Auto-rotate">
            <RotateCw size={15}/><span>Auto-rotate</span>
          </button>
          <button className={crossSection ? 'active' : ''} onClick={() => setCrossSection((v) => !v)} aria-label="Toggle cross-section" aria-pressed={crossSection} title="Chamber cross-section">
            <ScanLine size={15}/><span>Cross-section</span>
          </button>
          <button onClick={() => { controls.current?.dollyIn(1.18); controls.current?.update(); }} aria-label="Zoom in" title="Zoom in">
            <ZoomIn size={15}/><span>Zoom in</span>
          </button>
          <button onClick={() => { controls.current?.dollyOut(1.18); controls.current?.update(); }} aria-label="Zoom out" title="Zoom out">
            <ZoomOut size={15}/><span>Zoom out</span>
          </button>
          <button onClick={() => controls.current?.reset()} aria-label="Reset camera view" title="Reset camera">
            <RotateCcw size={15}/><span>Reset view</span>
          </button>
        </div>

        <div className="heart-canvas" role="img" aria-label="Interactive 3D Anatomical Heart Model">
          <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0.1, 4.35], fov: 43 }} gl={{ alpha: true, antialias: true }}>
            <Suspense fallback={null}>
              <HeartEnvironment/>
              <HeartModelMount model={model} wireframe={wireframe} crossSection={crossSection}/>
              <OrbitControls ref={controls} makeDefault enablePan={false} enableDamping dampingFactor={0.075} minDistance={2.4} maxDistance={6.5} autoRotate={autoRotate} autoRotateSpeed={0.65} maxPolarAngle={Math.PI * 0.76} minPolarAngle={Math.PI * 0.24}/>
            </Suspense>
          </Canvas>
        </div>

        <div className="stage-axis axis-x"/><div className="stage-axis axis-y"/>

        {/* Anatomical Pins with Readable Labels */}
        {chambers.map((chamber) => (
          <div key={chamber.key} className={`anatomy-pin ${chamber.position} ${activeChamber === chamber.key ? 'pin-selected' : ''}`}>
            <span className="pin-marker"><b>{chamber.key}</b><i/></span>
            <span className="pin-leader"/>
            <button 
              type="button" 
              className="anatomy-tag" 
              aria-label={`${chamber.name}: ${chamber.stat}`} 
              aria-pressed={activeChamber === chamber.key} 
              onMouseEnter={() => setActiveChamber(chamber.key)} 
              onFocus={() => setActiveChamber(chamber.key)} 
              onClick={() => setActiveChamber(chamber.key)}
            >
              <b>{chamber.name}</b>
              <small>{chamber.stat}</small>
              <small>{chamber.meta}</small>
            </button>
          </div>
        ))}

        <div className="stage-bottom-label">
          <span><Move3D size={13}/> DRAG TO ORBIT</span>
          <span><ZoomIn size={13}/> SCROLL TO ZOOM</span>
          <i className="model-origin">ANATOMICAL MESH ACTIVE</i>
        </div>

        <span className="stage-corner stage-corner-tl"/><span className="stage-corner stage-corner-br"/>
      </div>

      <div className="viewer-legend">
        <span><i className="legend-cyan"/> Myocardium Surface</span>
        <span><i className="legend-rose"/> Coronary Arteries</span>
        <span><i className="legend-dash"/> SA Node Conduction Path</span>
        <span className="viewer-legend-end"><Activity size={13}/> 3D WebGL Engine Online</span>
      </div>

      <div className="viewer-telemetry">
        <div className="viewer-telemetry-head">
          <div>
            <span className="eyebrow">CARDIAC TELEMETRY</span>
            <strong><i className="status-dot"/> Real-Time ECG Rhythm Waveform</strong>
          </div>
          <span className="telemetry-value">
            <Heart size={14} className="text-rose-500 fill-rose-500 inline mr-1 animate-pulse" />
            <b>{currentBpm}</b> <small>BPM</small>
          </span>
        </div>
        <div className="viewer-ecg-wrap">
          <EcgTrace/>
          <span className="viewer-feed-status">SYNCHRONIZED TELEMETRY FEED</span>
        </div>
        <div className="viewer-telemetry-foot">
          <span>Real-time cardiovascular telemetry simulation</span>
          <span>HEMODYNAMICS NORMAL</span>
        </div>
      </div>
    </section>
  );
}
