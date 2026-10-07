import { useRef, useEffect, Suspense, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html, ContactShadows, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useRiskStore } from '../store/useRiskStore';
import { Heart, Activity, Search, AlertTriangle, Info, RotateCcw, RefreshCw, Grid, FileDown, Check, Sparkles } from 'lucide-react';

const getAnatomicalZone = (point, riskScore) => {
  const y = point ? point.y : 0;
  const x = point ? point.x : 0;

  if (y > 0.3) {
    return {
      id: 'lad',
      label: 'LAD Coronary Artery',
      location: 'Anterior Interventricular Sulcus',
      pct: Math.min(99, Math.round(riskScore * 0.96)),
      status: riskScore > 60 ? 'Severe Stenosis (Occlusion Risk)' : riskScore > 35 ? 'Moderate Stenosis' : 'Mild Plaque Formation',
      clinicalNote: 'Primary coronary artery supplying anterior LV wall; high occlusion risk under elevated blood pressure & LDL.',
      color: '#ff2244',
      surfacePos: [0.22, 0.45, 0.42],
      labelPos: [0.38, 0.72, 0.58],
    };
  } else if (x > 0.05) {
    return {
      id: 'lv',
      label: 'Left Ventricle Wall',
      location: 'Anterolateral Myocardium',
      pct: Math.min(95, Math.round(riskScore * 0.82)),
      status: riskScore > 60 ? 'Myocardial Hypokinesia' : riskScore > 35 ? 'Elevated Pressure Strain' : 'Normal Elasticity',
      clinicalNote: 'Myocardial wall thickness under continuous pressure overload. Monitor for systolic strain.',
      color: '#ff8800',
      surfacePos: [0.38, -0.15, 0.35],
      labelPos: [0.65, -0.25, 0.55],
    };
  } else if (x < -0.05 && y > 0.1) {
    return {
      id: 'valve',
      label: 'Aortic & Mitral Valve',
      location: 'Aortic Root Base',
      pct: Math.min(90, Math.round(riskScore * 0.68)),
      status: riskScore > 60 ? 'Mild Leaflet Calcification' : riskScore > 35 ? 'Trace Regurgitation' : 'Normal Leaflet Mobility',
      clinicalNote: 'Valve orifice area and peak blood flow velocity within acceptable hemodynamic limits.',
      color: '#ffcc00',
      surfacePos: [-0.22, 0.28, 0.35],
      labelPos: [-0.42, 0.48, 0.55],
    };
  } else {
    return {
      id: 'ra',
      label: 'Right Atrium & Sinus Node',
      location: 'Posterior Superior Atrial Wall',
      pct: Math.min(85, Math.round(riskScore * 0.50)),
      status: 'Normal Sinus Rhythm',
      clinicalNote: 'Sinoatrial (SA) node pacemaker activity generating regular electrical impulses.',
      color: '#00ff88',
      surfacePos: [-0.32, -0.22, 0.28],
      labelPos: [-0.55, -0.38, 0.48],
    };
  }
};

const ANATOMICAL_PARTS = [
  { id: 'lad',   label: 'LAD Coronary Artery', surfacePos: [0.22, 0.45, 0.42], labelPos: [0.38, 0.72, 0.58], color: '#ff2244' },
  { id: 'lv',    label: 'Left Ventricle Wall', surfacePos: [0.38, -0.15, 0.35], labelPos: [0.65, -0.25, 0.55], color: '#ff8800' },
  { id: 'valve', label: 'Aortic & Mitral Valve', surfacePos: [-0.22, 0.28, 0.35], labelPos: [-0.42, 0.48, 0.55], color: '#ffcc00' },
  { id: 'ra',    label: 'Right Atrium & Sinus Node', surfacePos: [-0.32, -0.22, 0.28], labelPos: [-0.55, -0.38, 0.48], color: '#00ff88' },
];

function HeartModel({ riskScore, wireframeMode, autoRotate, selectedZone, setSelectedZone, hoveredZone, setHoveredZone }) {
  const { scene } = useGLTF('/heart.glb');
  const groupRef = useRef();
  const spotlightRef = useRef();
  const { size } = useThree();

  const canvasWidth = size.width;

  // Responsive scale calculation based on viewport width
  const baseScale = useMemo(() => {
    if (canvasWidth < 480) return 1.05;   // Mobile Portrait
    if (canvasWidth < 768) return 1.22;   // Mobile Landscape / Small Tablet
    if (canvasWidth < 1200) return 1.45;  // Medium / Split View
    return 1.62;                          // Full Desktop
  }, [canvasWidth]);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  const shaderUniformsRef = useRef({
    uTargetPoint: { value: new THREE.Vector3(0.22, 0.45, 0.42) },
    uHighlightColor: { value: new THREE.Color('#ff2244') },
    uHighlightIntensity: { value: 1.0 },
    uRadius: { value: 0.45 },
    uTime: { value: 0 },
    uRiskScore: { value: riskScore },
  });

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (!child.isMesh) return;
      const mat = child.material;
      if (!mat) return;

      if (wireframeMode) {
        mat.wireframe = true;
        mat.color.set('#00f2fe');
        mat.emissive.set('#0066ff');
        mat.emissiveIntensity = 0.8;
      } else {
        mat.wireframe = false;
        mat.color.set('#ffffff');
        mat.roughness = 0.45;
        mat.metalness = 0.05;
        mat.emissive.set('#000000');
        mat.emissiveIntensity = 0.0;

        mat.onBeforeCompile = (shader) => {
          shader.uniforms.uTargetPoint = shaderUniformsRef.current.uTargetPoint;
          shader.uniforms.uHighlightColor = shaderUniformsRef.current.uHighlightColor;
          shader.uniforms.uHighlightIntensity = shaderUniformsRef.current.uHighlightIntensity;
          shader.uniforms.uRadius = shaderUniformsRef.current.uRadius;
          shader.uniforms.uTime = shaderUniformsRef.current.uTime;
          shader.uniforms.uRiskScore = shaderUniformsRef.current.uRiskScore;

          shader.vertexShader = `
            varying vec3 vLocalPos;
            ${shader.vertexShader}
          `.replace(
            '#include <worldpos_vertex>',
            `
            #include <worldpos_vertex>
            vLocalPos = position;
            `
          );

          shader.fragmentShader = `
            varying vec3 vLocalPos;
            uniform vec3 uTargetPoint;
            uniform vec3 uHighlightColor;
            uniform float uHighlightIntensity;
            uniform float uRadius;
            uniform float uTime;
            uniform float uRiskScore;
            ${shader.fragmentShader}
          `.replace(
            '#include <dithering_fragment>',
            `
            #include <dithering_fragment>
            
            float distToZone = distance(vLocalPos, uTargetPoint);
            if (distToZone < uRadius && uHighlightIntensity > 0.01) {
              float normDist = distToZone / uRadius;
              float coreGlow = smoothstep(1.0, 0.0, normDist);
              float pulse = 0.85 + 0.3 * sin(uTime * 5.0);
              
              vec3 glowColor = uHighlightColor * coreGlow * uHighlightIntensity * pulse;
              gl_FragColor.rgb += glowColor;
            }
            `
          );
        };
      }
      mat.needsUpdate = true;
    });
  }, [clonedScene, wireframeMode]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const ri = riskScore / 100;

    shaderUniformsRef.current.uTime.value = time;
    shaderUniformsRef.current.uRiskScore.value = riskScore;

    const active = selectedZone || hoveredZone;
    if (active) {
      shaderUniformsRef.current.uTargetPoint.value.set(...active.surfacePos);
      shaderUniformsRef.current.uHighlightColor.value.set(active.color);
      shaderUniformsRef.current.uHighlightIntensity.value = THREE.MathUtils.lerp(
        shaderUniformsRef.current.uHighlightIntensity.value,
        2.2,
        0.1
      );
    } else {
      const ladPart = ANATOMICAL_PARTS[0];
      shaderUniformsRef.current.uTargetPoint.value.set(...ladPart.surfacePos);
      shaderUniformsRef.current.uHighlightColor.value.set(riskScore > 50 ? '#ff2244' : '#ff8800');
      shaderUniformsRef.current.uHighlightIntensity.value = THREE.MathUtils.lerp(
        shaderUniformsRef.current.uHighlightIntensity.value,
        riskScore > 35 ? 1.0 : 0.0,
        0.1
      );
    }

    if (groupRef.current) {
      if (autoRotate && !selectedZone) {
        groupRef.current.rotation.y += 0.004;
      }
      const bpmRate = 1.6 + ri * 0.8;
      const hoverBoost = (selectedZone || hoveredZone) ? 0.06 : 0;
      const targetScale = baseScale + hoverBoost;
      const pulse = targetScale + Math.sin(time * bpmRate) * (0.01 + ri * 0.014);
      groupRef.current.scale.setScalar(pulse);
    }
  });

  const activeZone = selectedZone || hoveredZone;

  return (
    <group ref={groupRef} position={[0, -0.25, 0]}>
      {/* 3D Model Mesh */}
      <primitive
        object={clonedScene}
        onPointerMove={(e) => {
          e.stopPropagation();
          const zone = getAnatomicalZone(e.point, riskScore);
          setHoveredZone(zone);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredZone(null);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          const zone = getAnatomicalZone(e.point, riskScore);
          setSelectedZone(selectedZone?.id === zone.id ? null : zone);
        }}
      />

      {/* Targeted Light Source */}
      {activeZone && (
        <pointLight
          ref={spotlightRef}
          position={activeZone.surfacePos}
          color={activeZone.color}
          intensity={4.5}
          distance={1.5}
        />
      )}

      {/* Render Leader Line & Callout ONLY for Active Selected/Hovered Zone (Zero Ghost Lines) */}
      {ANATOMICAL_PARTS.map((part) => {
        const zoneData = getAnatomicalZone({ x: part.surfacePos[0], y: part.surfacePos[1], z: part.surfacePos[2] }, riskScore);
        const isActive = activeZone?.id === part.id;

        // Strictly eliminate floating ghost lines when part is not selected/hovered
        if (!isActive) return null;

        return (
          <group key={part.id}>
            {/* Crisp 3D Leader Line for Focused Zone */}
            <Line
              points={[part.surfacePos, part.labelPos]}
              color={zoneData.color}
              lineWidth={2.5}
            />

            {/* Focused Anatomical Callout Badge */}
            <Html position={part.labelPos} occlude distanceFactor={3.6} style={{ pointerEvents: 'auto' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedZone(isActive ? null : zoneData);
                }}
                style={{
                  background: zoneData.color,
                  border: `1px solid ${zoneData.color}`,
                  borderRadius: 6,
                  padding: '5px 10px',
                  color: '#ffffff',
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: `0 4px 15px ${zoneData.color}50`,
                  whiteSpace: 'nowrap',
                }}
              >
                <Heart size={12} fill="#ffffff" />
                <span>{part.label}</span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 9,
                    fontWeight: 900,
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '1px 5px',
                    borderRadius: 3,
                    color: '#ffffff',
                  }}
                >
                  {zoneData.pct}%
                </span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

import { downloadClinicalReportPDF } from '../utils/exportReport';

function Loader() {
  return (
    <Html center>
      <div style={{ color: '#38bdf8', fontFamily: 'Inter, sans-serif', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Heart size={32} className="animate-pulse" style={{ color: '#38bdf8', marginBottom: 8 }} />
        <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: 0.5 }}>Loading 3D Cardiac Mesh…</div>
      </div>
    </Html>
  );
}

export default function HeartViewer() {
  const { patient, vitals, riskScore, riskLevel, recommendations, setActiveTab, wireframeMode, toggleWireframe, autoRotate, toggleAutoRotate, chatOpen, toggleChatDrawer } = useRiskStore();
  const [selectedZone, setSelectedZone] = useState(null);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [controlsRef, setControlsRef] = useState(null);
  const [copied, setCopied] = useState(false);

  const activeZone = selectedZone || hoveredZone;

  const resetCamera = () => {
    setSelectedZone(null);
    setHoveredZone(null);
    if (controlsRef) {
      controlsRef.reset();
    }
  };

  const handleExport = () => {
    setCopied(true);
    downloadClinicalReportPDF(patient, vitals, riskScore, riskLevel, recommendations);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Top Left Title */}
      <div style={{ position: 'absolute', top: 16, left: 20, zIndex: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '6px 14px',
            borderRadius: 6,
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Activity size={14} style={{ color: '#10b981' }} />
          <span style={{ color: '#cbd5e1', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            3D Anatomical Mapping
          </span>
        </div>
      </div>

      {/* Top Right Header Toolbar (Heart Rate, AI Assistant & Export Button) */}
      <div style={{ position: 'absolute', top: 16, right: 20, zIndex: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '6px 12px',
            borderRadius: 6,
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Heart size={14} style={{ color: '#ef4444' }} fill="#ef4444" />
          <span className="font-mono" style={{ color: '#ef4444', fontSize: 12, fontWeight: 700 }}>
            {72 + Math.round((riskScore / 100) * 35)} <span style={{ fontSize: 9, color: '#64748b' }}>BPM</span>
          </span>
        </div>

        {/* Top-Right Clinical AI Assistant Button */}
        <button
          onClick={toggleChatDrawer}
          style={{
            background: chatOpen ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.95)',
            border: `1px solid ${chatOpen ? 'rgba(56, 189, 248, 0.6)' : 'rgba(56, 189, 248, 0.35)'}`,
            color: '#f8fafc',
            padding: '6px 14px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            transition: 'all 0.15s ease',
          }}
        >
          <Sparkles size={14} style={{ color: '#38bdf8' }} />
          <span>Clinical AI Assistant</span>
          <span style={{ fontSize: 8, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>
            AI
          </span>
        </button>

        {/* Top-Right Clean Export Button */}
        <button
          onClick={handleExport}
          style={{
            background: copied ? '#10b981' : '#38bdf8',
            border: 'none',
            color: '#090d16',
            padding: '7px 14px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? <Check size={14} /> : <FileDown size={14} />}
          <span>{copied ? 'Report Copied' : 'Export Clinical Report'}</span>
        </button>
      </div>

      {/* Floating Anatomical Part Inspector Overlay on 3D Canvas */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          zIndex: 10,
          background: 'rgba(15, 23, 42, 0.92)',
          border: `1px solid ${activeZone ? activeZone.color : 'rgba(255, 255, 255, 0.1)'}`,
          borderRadius: 10,
          padding: '14px',
          backdropFilter: 'blur(16px)',
          width: 260,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Search size={12} style={{ color: '#38bdf8' }} />
            <span>Anatomical Part Inspector</span>
          </div>
          {activeZone && (
            <button
              onClick={() => { setSelectedZone(null); setHoveredZone(null); }}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 10 }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Anatomical Parts Selection Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: activeZone ? 12 : 0 }}>
          {ANATOMICAL_PARTS.map((part) => {
            const zData = getAnatomicalZone({ x: part.surfacePos[0], y: part.surfacePos[1], z: part.surfacePos[2] }, riskScore);
            const isSel = activeZone?.id === part.id;

            return (
              <button
                key={part.id}
                onClick={() => setSelectedZone(isSel ? null : zData)}
                onMouseEnter={() => setHoveredZone(zData)}
                onMouseLeave={() => setHoveredZone(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: isSel ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${isSel ? zData.color : 'rgba(255, 255, 255, 0.08)'}`,
                  color: isSel ? '#f8fafc' : '#94a3b8',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <span>{part.label}</span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: zData.color,
                  }}
                >
                  {zData.pct}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Part Clinical Diagnostic Details Box */}
        {activeZone && (
          <div
            style={{
              paddingTop: 12,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Heart size={14} style={{ color: activeZone.color }} fill={activeZone.color} />
                <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: 12 }}>
                  {activeZone.label}
                </span>
              </div>
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: activeZone.color,
                  background: `${activeZone.color}15`,
                  padding: '2px 6px',
                  borderRadius: 4,
                  border: `1px solid ${activeZone.color}35`,
                }}
              >
                {activeZone.pct}% Risk
              </span>
            </div>

            <div style={{ fontSize: 10, color: '#64748b', marginBottom: 6 }}>
              Location: <b style={{ color: '#cbd5e1', fontWeight: 500 }}>{activeZone.location}</b>
            </div>

            <div
              style={{
                marginBottom: 6,
                padding: '6px 8px',
                borderRadius: 4,
                background: `${activeZone.color}10`,
                border: `1px solid ${activeZone.color}30`,
              }}
            >
              <div style={{ fontSize: 8, color: activeZone.color, textTransform: 'uppercase', fontWeight: 600 }}>Condition Status</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#f8fafc', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertTriangle size={12} style={{ color: activeZone.color }} />
                <span>{activeZone.status}</span>
              </div>
            </div>

            <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.4, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <Info size={14} style={{ flexShrink: 0, marginTop: 2, color: '#38bdf8' }} />
              <span>{activeZone.clinicalNote}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Toolbar */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          zIndex: 10,
          display: 'flex',
          gap: 8,
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '6px 12px',
          borderRadius: 8,
          backdropFilter: 'blur(12px)',
        }}
      >
        <button
          onClick={resetCamera}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: 11,
            fontWeight: 500,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = '#f8fafc')}
          onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <RotateCcw size={12} />
          <span>Reset View</span>
        </button>

        <div style={{ width: 1, background: 'rgba(255, 255, 255, 0.1)' }} />

        <button
          onClick={toggleAutoRotate}
          style={{
            background: autoRotate ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            border: `1px solid ${autoRotate ? 'rgba(56, 189, 248, 0.3)' : 'transparent'}`,
            color: autoRotate ? '#38bdf8' : '#94a3b8',
            fontSize: 11,
            fontWeight: 500,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s ease',
          }}
        >
          <RefreshCw size={12} className={autoRotate ? 'animate-spin' : ''} />
          <span>Auto Rotate: <b>{autoRotate ? 'ON' : 'OFF'}</b></span>
        </button>

        <div style={{ width: 1, background: 'rgba(255, 255, 255, 0.1)' }} />

        <button
          onClick={toggleWireframe}
          style={{
            background: wireframeMode ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            border: `1px solid ${wireframeMode ? 'rgba(56, 189, 248, 0.3)' : 'transparent'}`,
            color: wireframeMode ? '#38bdf8' : '#94a3b8',
            fontSize: 11,
            fontWeight: 500,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s ease',
          }}
        >
          <Grid size={12} />
          <span>Wireframe</span>
        </button>
      </div>

      {/* R3F Canvas Container */}
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={2.4} color="#ffffff" />
        <hemisphereLight intensity={1.6} color="#ffffff" groundColor="#334155" />
        <directionalLight position={[10, 12, 10]} intensity={3.2} color="#ffffff" />
        <directionalLight position={[-10, 6, 8]} intensity={2.2} color="#bae6fd" />
        <directionalLight position={[0, -10, 8]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[0, -8, -8]} intensity={1.8} color="#e0f2fe" />
        <directionalLight position={[0, 10, -10]} intensity={1.6} color="#818cf8" />

        <Suspense fallback={<Loader />}>
          <HeartModel
            riskScore={riskScore}
            wireframeMode={wireframeMode}
            autoRotate={autoRotate}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
            hoveredZone={hoveredZone}
            setHoveredZone={setHoveredZone}
          />
          <ContactShadows position={[0, -2.1, 0]} opacity={0.5} scale={6} blur={2.5} color="#000022" />
        </Suspense>

        <OrbitControls
          ref={setControlsRef}
          enablePan={false}
          minDistance={2.2}
          maxDistance={7.5}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/heart.glb');
