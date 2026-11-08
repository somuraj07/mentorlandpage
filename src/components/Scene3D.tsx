"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

/**
 * Two linked rings — a mentor and a learner, held together.
 * Glossy violet + pearl lavender, a lime spark orbiting them.
 */
function Rings({ reduce }: { reduce: boolean }) {
  const group = useRef<THREE.Group>(null);
  const spark = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const s = Math.min(0.8, viewport.width / 5.4);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const scroll = typeof window !== "undefined" ? window.scrollY / window.innerHeight : 0;
    const tx = reduce ? 0 : state.pointer.y * 0.35 + scroll * 0.6;
    const ty = reduce ? 0.5 : state.pointer.x * 0.5 + state.clock.elapsedTime * 0.18 + scroll * 1.2;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tx, 3, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ty, 3, delta);
    if (spark.current && !reduce) {
      const t = state.clock.elapsedTime * 0.9;
      spark.current.position.set(Math.cos(t) * 2.3, Math.sin(t * 1.3) * 0.7, Math.sin(t) * 1.4);
    }
  });

  return (
    <group ref={group} scale={s}>
      <Float speed={reduce ? 0 : 1.6} rotationIntensity={reduce ? 0 : 0.4} floatIntensity={reduce ? 0 : 0.8}>
        <mesh position={[-0.62, 0, 0]} rotation={[0, 0, Math.PI / 9]}>
          <torusGeometry args={[1, 0.34, 96, 192]} />
          <meshPhysicalMaterial
            color="#6b4eff"
            metalness={0.25}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.08}
            iridescence={0.9}
            iridescenceIOR={1.4}
          />
        </mesh>
        <mesh position={[0.62, 0, 0]} rotation={[Math.PI / 2, 0, -Math.PI / 9]}>
          <torusGeometry args={[1, 0.34, 96, 192]} />
          <meshPhysicalMaterial
            color="#e4dbff"
            metalness={0.1}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.1}
            sheen={1}
            sheenColor="#c8b8ff"
            iridescence={0.6}
          />
        </mesh>
        <mesh ref={spark} position={[2.2, 0.4, 0.8]}>
          <sphereGeometry args={[0.16, 48, 48]} />
          <meshStandardMaterial color="#d7f56b" emissive="#b8e04a" emissiveIntensity={0.6} roughness={0.3} />
        </mesh>
      </Float>
    </group>
  );
}

export default function Scene3D({ active = true, reduce = false }: { active?: boolean; reduce?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6.2], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      style={{ pointerEvents: "none" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <directionalLight position={[-4, -2, -3]} intensity={0.8} color="#c8b8ff" />
      <Rings reduce={reduce} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 4, -6]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#c8b8ff" position={[-6, 0, -2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={2} color="#d7f56b" position={[6, -1, -2]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} />
        <Lightformer form="ring" intensity={2} color="#6b4eff" position={[0, -3, 4]} scale={3} />
      </Environment>
    </Canvas>
  );
}
