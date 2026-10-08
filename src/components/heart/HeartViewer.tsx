import { Suspense, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Activity, Aperture, Crosshair, Move3D, RotateCcw, RotateCw, ScanLine, ZoomIn, ZoomOut } from 'lucide-react';
import { HeartEnvironment, HeartModelMount, type HeartModelAdapter } from './HeartScene';
import { EcgTrace } from '../Telemetry';
import { ConnectionBadge } from '../ConnectionBadge';

type HeartViewerProps = { riskLevel: 'low' | 'moderate' | 'high' | 'severe'; model?: ReactNode | HeartModelAdapter };
const chambers = [
  { key: 'LV', name: 'Left ventricle', stat: 'Pressure · —', meta: 'Connect clinical feed', position: 'pin-left' },
  { key: 'LAD', name: 'LAD coronary artery', stat: 'Ischemia · —', meta: 'Connect vision service', position: 'pin-top' },
  { key: 'RA', name: 'Right atrium', stat: 'Status · —', meta: 'Connect clinical feed', position: 'pin-right' },
];

export function HeartViewer({ riskLevel, model }: HeartViewerProps) {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [crossSection, setCrossSection] = useState(false);
  const [activeChamber, setActiveChamber] = useState('LV');
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const riskLabel = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);

  return (
    <section className={`heart-studio risk-${riskLevel}`} aria-label="Interactive 3D heart viewer">
      <div className="studio-topline"><div><span className="eyebrow"><span className="eyebrow-marker"/> SPATIAL VIEW / ANATOMY</span><h2>Heart studio <span className="studio-version">V.01</span></h2></div><div className="studio-top-right"><ConnectionBadge>GLTF ASSET SLOT</ConnectionBadge><span className={`risk-display-tag risk-display-${riskLevel}`}><i/>{riskLabel} <small>DEMO DISPLAY</small></span></div></div>
      <div className="studio-stage">
        <div className="stage-grid" aria-hidden="true"/><div className="stage-vignette" aria-hidden="true"/>
        <div className="stage-meta"><span><Crosshair size={12}/> MODEL COORDINATES / 3D</span><span>CAMERA 01 <i/> PERSPECTIVE</span></div>
        <div className="stage-tools" aria-label="3D viewer controls">
          <button className={wireframe ? 'active' : ''} onClick={() => setWireframe((value) => !value)} aria-label="Toggle wireframe mode" aria-pressed={wireframe} title="Wireframe mode"><Aperture size={15}/><span>Wireframe</span></button>
          <button className={autoRotate ? 'active' : ''} onClick={() => setAutoRotate((value) => !value)} aria-label="Toggle automatic rotation" aria-pressed={autoRotate} title="Auto-rotate"><RotateCw size={15}/><span>Auto-rotate</span></button>
          <button className={crossSection ? 'active' : ''} onClick={() => setCrossSection((value) => !value)} aria-label="Toggle chamber cross-section" aria-pressed={crossSection} title="Chamber cross-section"><ScanLine size={15}/><span>Cross-section</span></button>
          <button onClick={() => { controls.current?.dollyIn(1.18); controls.current?.update(); }} aria-label="Zoom in" title="Zoom in"><ZoomIn size={15}/><span>Zoom in</span></button>
          <button onClick={() => { controls.current?.dollyOut(1.18); controls.current?.update(); }} aria-label="Zoom out" title="Zoom out"><ZoomOut size={15}/><span>Zoom out</span></button>
          <button onClick={() => controls.current?.reset()} aria-label="Reset camera view" title="Reset camera"><RotateCcw size={15}/><span>Reset view</span></button>
        </div>
        <div className="heart-canvas" role="img" aria-label="Illustrative 3D heart placeholder with interactive orbit controls; connect the clinical GLTF model for anatomical visualization">
          <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0.1, 4.35], fov: 43 }} gl={{ alpha: true, antialias: true }}>
            <Suspense fallback={null}>
              <HeartEnvironment/>
              <HeartModelMount model={model} wireframe={wireframe} crossSection={crossSection}/>
              <OrbitControls ref={controls} makeDefault enablePan={false} enableDamping dampingFactor={0.075} minDistance={2.8} maxDistance={6.2} autoRotate={autoRotate} autoRotateSpeed={0.65} maxPolarAngle={Math.PI * 0.76} minPolarAngle={Math.PI * 0.24}/>
            </Suspense>
          </Canvas>
        </div>
        <div className="stage-axis axis-x"/><div className="stage-axis axis-y"/>
        {chambers.map((chamber) => <div key={chamber.key} className={`anatomy-pin ${chamber.position} ${activeChamber === chamber.key ? 'pin-selected' : ''}`}><span className="pin-marker"><b>{chamber.key}</b><i/></span><span className="pin-leader"/><button type="button" className="anatomy-tag" aria-label={`${chamber.name}: ${chamber.stat}. ${chamber.meta}`} aria-pressed={activeChamber === chamber.key} onMouseEnter={() => setActiveChamber(chamber.key)} onFocus={() => setActiveChamber(chamber.key)} onClick={() => setActiveChamber(chamber.key)}><b>{chamber.name}</b><small>{chamber.stat}</small><small>{chamber.meta}</small></button></div>)}
        <div className="stage-bottom-label"><span><Move3D size={13}/> DRAG TO ORBIT</span><span><ZoomIn size={13}/> SCROLL TO ZOOM</span><i className="model-origin">ASSET SLOT / REPLACE PLACEHOLDER</i></div>
        <span className="stage-corner stage-corner-tl"/><span className="stage-corner stage-corner-br"/>
      </div>
      <div className="viewer-legend"><span><i className="legend-cyan"/> Surface layer</span><span><i className="legend-rose"/> Focal anatomy</span><span><i className="legend-dash"/> Clinical marker (feed unavailable)</span><span className="viewer-legend-end"><Activity size={12}/> Model status: placeholder</span></div>
      <div className="viewer-telemetry"><div className="viewer-telemetry-head"><div><span className="eyebrow">TELEMETRY / ILLUSTRATIVE</span><strong><i className="status-dot"/> Cardiac rhythm strip</strong></div><span className="telemetry-value"><b>76</b> <small>BPM / SAMPLE</small></span></div><div className="viewer-ecg-wrap"><EcgTrace/><span className="viewer-feed-status">NO PATIENT FEED</span></div><div className="viewer-telemetry-foot"><span>Signal preview • not a live patient monitor</span><span>LIVE CLINICAL VALUES UNAVAILABLE</span></div></div>
    </section>
  );
}
