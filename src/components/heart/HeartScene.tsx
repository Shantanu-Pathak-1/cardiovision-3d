import { useMemo, useRef, type ComponentType } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { ReactNode } from 'react';

function Vessel({ points, color, radius }: { points: THREE.Vector3[]; color: string; radius: number }) {
  const geometry = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 36, radius, 10, false), [points, radius]);
  return <mesh geometry={geometry}><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} roughness={0.38} metalness={0.28}/></mesh>;
}

export function GLTFHeartModel({ wireframe, crossSection }: { wireframe: boolean; crossSection: boolean }) {
  const { scene } = useGLTF('/heart.glb');
  const group = useRef<THREE.Group>(null);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
          if (mat) {
            mat.wireframe = wireframe;
            if (wireframe) {
              mat.color.set('#38bdf8');
              mat.emissive.set('#0284c7');
              mat.emissiveIntensity = 0.5;
            } else {
              mat.wireframe = false;
              mat.roughness = 0.35;
              mat.metalness = 0.1;
            }
            mat.needsUpdate = true;
          }
        }
      }
    });
    return clone;
  }, [scene, wireframe]);

  useFrame(({ clock }) => {
    if (group.current) {
      const pulse = 1.35 + Math.sin(clock.elapsedTime * 2.2) * 0.02;
      group.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={group} position={[0, -0.25, 0]}>
      <primitive object={clonedScene} />
      {crossSection && (
        <mesh position={[0, 0, 0.35]}>
          <planeGeometry args={[2.5, 2.5]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

useGLTF.preload('/heart.glb');

export type HeartModelControls = { wireframe: boolean; crossSection: boolean };
export type HeartModelAdapter = ComponentType<HeartModelControls>;

export function HeartModelMount({ model, wireframe, crossSection }: { model?: ReactNode | HeartModelAdapter; wireframe: boolean; crossSection: boolean }) {
  if (typeof model === 'function') {
    const Model = model;
    return <group><Model wireframe={wireframe} crossSection={crossSection}/></group>;
  }
  return <group>{model ?? <GLTFHeartModel wireframe={wireframe} crossSection={crossSection}/>}</group>;
}

export function HeartEnvironment() {
  return (
    <>
      <ambientLight intensity={0.85}/>
      <directionalLight position={[4, 5, 4]} intensity={2.5} castShadow/>
      <directionalLight position={[-4, 2, -2]} intensity={1.2} color="#38bdf8"/>
      <pointLight position={[-3, 0.6, 2.5]} color="#38bdf8" intensity={1.8}/>
      <pointLight position={[2.4, 0.8, -1.5]} color="#f43f5e" intensity={1.5}/>
    </>
  );
}
