"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Rotating Diamond Crystal - Luxury centerpiece with enhanced refraction
function RotatingDiamond() {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerSparkleRef = useRef<THREE.Points>(null);

  // Create internal sparkle effect
  const sparklePositions = useMemo(() => {
    const positions = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Slow, elegant rotation
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }

    // Animate internal sparkles
    if (innerSparkleRef.current) {
      innerSparkleRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      innerSparkleRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[2, 0]} />
        <meshPhysicalMaterial
          color="#D4AF37"
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.7}
          emissive="#C9A227"
          emissiveIntensity={0.4}
          clearcoat={1}
          clearcoatRoughness={0.05}
          transmission={0.3}
          thickness={0.5}
          ior={2.4}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Internal sparkles for depth */}
      <points ref={innerSparkleRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[sparklePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#ffffff"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Orbiting Gold Particles - elegant orbit around diamond with luxury trails
function OrbitingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const trailsRef = useRef<THREE.Points>(null);
  const count = 150;
  const trailLength = 8;

  const { positions, velocities, trailPositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    const trails = new Float32Array(count * trailLength * 3);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 1.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      vel[i] = 0.3 + Math.random() * 0.2;

      // Initialize trail positions
      for (let j = 0; j < trailLength; j++) {
        const idx = (i * trailLength + j) * 3;
        trails[idx] = pos[i * 3];
        trails[idx + 1] = pos[i * 3 + 1];
        trails[idx + 2] = pos[i * 3 + 2];
      }
    }

    return { positions: pos, velocities: vel, trailPositions: trails };
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current && trailsRef.current) {
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const trailArray = trailsRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const x = posArray[i * 3];
        const z = posArray[i * 3 + 2];
        const angle = Math.atan2(z, x);
        const radius = Math.sqrt(x * x + z * z);

        const newAngle = angle + velocities[i] * 0.005;
        posArray[i * 3] = Math.cos(newAngle) * radius;
        posArray[i * 3 + 2] = Math.sin(newAngle) * radius;

        // Update trail - shift positions back and add current position
        for (let j = trailLength - 1; j > 0; j--) {
          const currentIdx = (i * trailLength + j) * 3;
          const prevIdx = (i * trailLength + j - 1) * 3;
          trailArray[currentIdx] = trailArray[prevIdx];
          trailArray[currentIdx + 1] = trailArray[prevIdx + 1];
          trailArray[currentIdx + 2] = trailArray[prevIdx + 2];
        }
        const headIdx = i * trailLength * 3;
        trailArray[headIdx] = posArray[i * 3];
        trailArray[headIdx + 1] = posArray[i * 3 + 1];
        trailArray[headIdx + 2] = posArray[i * 3 + 2];
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      trailsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Main particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#D4AF37"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Luxury particle trails */}
      <points ref={trailsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trailPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#C9A227"
          transparent
          opacity={0.3}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

// Orbiting Gold Gems - smaller diamonds orbiting main crystal
function OrbitingGems() {
  const group1Ref = useRef<THREE.Group>(null);
  const group2Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group1Ref.current) {
      group1Ref.current.rotation.y = t * 0.2;
    }
    if (group2Ref.current) {
      group2Ref.current.rotation.y = -t * 0.15;
    }
  });

  return (
    <>
      {/* First ring of gold gems */}
      <group ref={group1Ref} position={[0, 0, 0]}>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const radius = 3.5;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle * 3) * 0.5,
                Math.sin(angle) * radius
              ]}
              rotation={[0, angle, 0]}
            >
              <octahedronGeometry args={[0.2, 0]} />
              <meshPhysicalMaterial
                color="#D4AF37"
                metalness={1}
                roughness={0}
                transparent
                opacity={0.7}
                emissive="#C9A227"
                emissiveIntensity={0.6}
              />
            </mesh>
          );
        })}
      </group>

      {/* Second ring of gold gems */}
      <group ref={group2Ref} position={[0, 0, 0]}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 4.2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle * 2) * 0.6,
                Math.sin(angle) * radius
              ]}
              rotation={[0, -angle, Math.PI / 4]}
            >
              <tetrahedronGeometry args={[0.15, 0]} />
              <meshPhysicalMaterial
                color="#C9A227"
                metalness={0.95}
                roughness={0.05}
                transparent
                opacity={0.6}
                emissive="#D4AF37"
                emissiveIntensity={0.5}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

// Golden Aura - pulsing glow around diamond
function GoldenAura() {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.2 + 0.8;
      glowRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <mesh ref={glowRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2.8, 32, 32]} />
      <meshBasicMaterial
        color="#D4AF37"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Light Rays - God rays emanating from diamond
function LightRays() {
  const raysRef = useRef<THREE.Group>(null);
  const rayCount = 8;

  useFrame((state) => {
    if (raysRef.current) {
      raysRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      raysRef.current.children.forEach((ray, i) => {
        const phase = state.clock.elapsedTime * 0.8 + i * 0.3;
        ray.scale.y = 1 + Math.sin(phase) * 0.3;
        const mat = (ray as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.1 + Math.sin(phase) * 0.05;
      });
    }
  });

  return (
    <group ref={raysRef}>
      {Array.from({ length: rayCount }).map((_, i) => {
        const angle = (i / rayCount) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[0, 0, 0]}
            rotation={[0, 0, angle]}
          >
            <planeGeometry args={[0.08, 6]} />
            <meshBasicMaterial
              color="#D4AF37"
              transparent
              opacity={0.12}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Pulsing Glow Rings - Elegant rings around the diamond
function PulsingGlowRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (ring1Ref.current) {
      const pulse1 = Math.sin(t * 0.8) * 0.3 + 1;
      ring1Ref.current.scale.set(pulse1, pulse1, pulse1);
      (ring1Ref.current.material as THREE.MeshBasicMaterial).opacity = (Math.sin(t * 0.8) * 0.15 + 0.25);
    }

    if (ring2Ref.current) {
      const pulse2 = Math.sin(t * 0.8 + Math.PI / 3) * 0.3 + 1;
      ring2Ref.current.scale.set(pulse2, pulse2, pulse2);
      (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = (Math.sin(t * 0.8 + Math.PI / 3) * 0.15 + 0.25);
    }

    if (ring3Ref.current) {
      const pulse3 = Math.sin(t * 0.8 + (Math.PI * 2) / 3) * 0.3 + 1;
      ring3Ref.current.scale.set(pulse3, pulse3, pulse3);
      (ring3Ref.current.material as THREE.MeshBasicMaterial).opacity = (Math.sin(t * 0.8 + (Math.PI * 2) / 3) * 0.15 + 0.25);
    }
  });

  return (
    <>
      <mesh ref={ring1Ref} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.02, 16, 64]} />
        <meshBasicMaterial
          color="#D4AF37"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={ring2Ref} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.015, 16, 64]} />
        <meshBasicMaterial
          color="#C9A227"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={ring3Ref} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4, 0.01, 16, 64]} />
        <meshBasicMaterial
          color="#D4AF37"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

// Prismatic Effect - Rainbow highlights
function PrismaticHighlights() {
  const prismRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (prismRef.current) {
      prismRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      prismRef.current.rotation.x = state.clock.elapsedTime * 0.15;

      // Color shift effect
      const hue = (state.clock.elapsedTime * 0.1) % 1;
      const color = new THREE.Color().setHSL(hue, 0.6, 0.7);
      (prismRef.current.material as THREE.MeshBasicMaterial).color = color;
    }
  });

  return (
    <mesh ref={prismRef} position={[0, 0, 0]}>
      <octahedronGeometry args={[2.2, 0]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
        wireframe={false}
      />
    </mesh>
  );
}

// Floating Luxury Elements - Geometric shapes drifting elegantly
function FloatingLuxuryElements() {
  const elementsRef = useRef<THREE.Group>(null);
  const elementCount = 15;

  const elements = useMemo(() => {
    return Array.from({ length: elementCount }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      type: i % 3, // 0: box, 1: triangle (tetrahedron), 2: octahedron
      speed: 0.1 + Math.random() * 0.15,
      rotationSpeed: 0.2 + Math.random() * 0.3,
      scale: 0.08 + Math.random() * 0.08,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (elementsRef.current) {
      elementsRef.current.children.forEach((element, i) => {
        const data = elements[i];
        const t = state.clock.elapsedTime;

        // Gentle floating motion
        element.position.y += Math.sin(t * data.speed + data.phase) * 0.002;
        element.rotation.x += data.rotationSpeed * 0.01;
        element.rotation.y += data.rotationSpeed * 0.008;
        element.rotation.z += data.rotationSpeed * 0.006;

        // Subtle pulse
        const pulse = 1 + Math.sin(t * 0.5 + data.phase) * 0.1;
        element.scale.set(data.scale * pulse, data.scale * pulse, data.scale * pulse);
      });
    }
  });

  return (
    <group ref={elementsRef}>
      {elements.map((el, i) => {
        const GeometryComponent =
          el.type === 0 ? <boxGeometry args={[1, 1, 1]} /> :
          el.type === 1 ? <tetrahedronGeometry args={[0.7, 0]} /> :
          <octahedronGeometry args={[0.6, 0]} />;

        return (
          <mesh
            key={i}
            position={el.position}
            scale={[el.scale, el.scale, el.scale]}
          >
            {GeometryComponent}
            <meshPhysicalMaterial
              color={i % 2 === 0 ? "#D4AF37" : "#C9A227"}
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.4}
              emissive={i % 2 === 0 ? "#D4AF37" : "#C9A227"}
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Main scene composition
function Scene() {
  return (
    <>
      {/* Lighting - luxury gold tones */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[0, 0, 0]} intensity={2.5} color="#D4AF37" distance={10} />
      <pointLight position={[4, 0, 4]} intensity={1.2} color="#C9A227" distance={8} />
      <pointLight position={[-4, 0, -4]} intensity={1.2} color="#D4AF37" distance={8} />

      {/* Luxury Diamond Elements */}
      <RotatingDiamond />
      <OrbitingParticles />
      <OrbitingGems />
      <GoldenAura />

      {/* New Stunning Enhancements */}
      <LightRays />
      <PulsingGlowRings />
      <PrismaticHighlights />
      <FloatingLuxuryElements />

      {/* Ambient gold sparkles */}
      <Sparkles
        count={100}
        scale={12}
        size={1.5}
        speed={0.15}
        opacity={0.4}
        color="#D4AF37"
      />
    </>
  );
}

// Loading fallback
function Loader() {
  return null;
}

export function HeroScene({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={<Loader />}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HeroScene;
