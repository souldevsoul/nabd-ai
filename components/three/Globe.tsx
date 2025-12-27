'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Globe({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Rotating group
    const rotatingGroup = new THREE.Group();
    scene.add(rotatingGroup);

    // Primary blue color for Vertex
    const primaryBlue = 0x1e40af;
    const lightBlue = 0x3b82f6;

    // Inner icosahedron (solid light)
    const innerGeometry = new THREE.IcosahedronGeometry(1.2, 2);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xfafafa,
      transparent: true,
      opacity: 0.95,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    rotatingGroup.add(innerMesh);

    // Outer wireframe (blue lines)
    const outerGeometry = new THREE.IcosahedronGeometry(1.25, 2);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: primaryBlue,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const wireframeMesh = new THREE.Mesh(outerGeometry, wireframeMaterial);
    rotatingGroup.add(wireframeMesh);

    // Second wireframe layer (subtle)
    const outerGeometry2 = new THREE.IcosahedronGeometry(1.35, 3);
    const wireframeMaterial2 = new THREE.MeshBasicMaterial({
      color: lightBlue,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireframeMesh2 = new THREE.Mesh(outerGeometry2, wireframeMaterial2);
    rotatingGroup.add(wireframeMesh2);

    // Particles at vertices
    const positions: number[] = [];
    const posAttr = outerGeometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      positions.push(posAttr.getX(i) * 1.26, posAttr.getY(i) * 1.26, posAttr.getZ(i) * 1.26);
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: primaryBlue,
      size: 0.05,
      transparent: true,
      opacity: 0.9,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    rotatingGroup.add(particles);

    // Orbiting ring
    const ringGeometry = new THREE.TorusGeometry(1.8, 0.012, 8, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: primaryBlue,
      transparent: true,
      opacity: 0.4,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.5;
    rotatingGroup.add(ring);

    // Second ring
    const ring2Geometry = new THREE.TorusGeometry(2.0, 0.01, 8, 100);
    const ring2Material = new THREE.MeshBasicMaterial({
      color: lightBlue,
      transparent: true,
      opacity: 0.2,
    });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.x = Math.PI / 1.8;
    ring2.rotation.y = Math.PI / 4;
    rotatingGroup.add(ring2);

    // Third ring for extra depth
    const ring3Geometry = new THREE.TorusGeometry(2.2, 0.008, 8, 100);
    const ring3Material = new THREE.MeshBasicMaterial({
      color: primaryBlue,
      transparent: true,
      opacity: 0.1,
    });
    const ring3 = new THREE.Mesh(ring3Geometry, ring3Material);
    ring3.rotation.x = Math.PI / 3;
    ring3.rotation.z = Math.PI / 6;
    rotatingGroup.add(ring3);

    // Orbiting dots
    const orbitingDotsGroup = new THREE.Group();
    const dotCount = 6;
    for (let i = 0; i < dotCount; i++) {
      const dotGeometry = new THREE.SphereGeometry(0.04, 8, 8);
      const dotMaterial = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? primaryBlue : lightBlue,
        transparent: true,
        opacity: 0.85,
      });
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      const angle = (i / dotCount) * Math.PI * 2;
      dot.position.x = Math.cos(angle) * 1.8;
      dot.position.z = Math.sin(angle) * 1.8;
      dot.position.y = Math.sin(angle * 2) * 0.35;
      orbitingDotsGroup.add(dot);
    }
    rotatingGroup.add(orbitingDotsGroup);

    // Animation
    let time = 0;
    const animate = () => {
      time += 0.004;

      rotatingGroup.rotation.y += 0.002;
      rotatingGroup.rotation.x = Math.sin(time) * 0.08;

      orbitingDotsGroup.rotation.y += 0.008;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}
