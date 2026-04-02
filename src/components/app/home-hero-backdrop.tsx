"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

function HeroShapes({ isDark }: { isDark: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.1;
    g.rotation.x += delta * 0.032;
  });

  const main = isDark ? "#8f9eb5" : "#c4a574";
  const accent = isDark ? "#5a6678" : "#dcc9a4";

  return (
    <group ref={group}>
      <mesh position={[0.32, 0.08, 0]} rotation={[0.35, 0.45, 0.2]}>
        <icosahedronGeometry args={[0.78, 0]} />
        <meshStandardMaterial
          color={main}
          metalness={0.38}
          roughness={0.4}
          emissive={main}
          emissiveIntensity={isDark ? 0.09 : 0.05}
        />
      </mesh>
      <mesh
        position={[-0.42, -0.22, 0.12]}
        rotation={[-0.2, 0.6, 0.15]}
        scale={0.52}
      >
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color={accent}
          metalness={0.22}
          roughness={0.58}
          emissive={accent}
          emissiveIntensity={0.04}
        />
      </mesh>
    </group>
  );
}

/** ホーム用の控えめな 3D 背景（WebGL。SSR では描画しない） */
export function HomeHeroBackdrop() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      aria-hidden
    >
      {mounted ? (
        <Canvas
          camera={{ position: [0, 0, 3.4], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "low-power",
          }}
          className="h-full w-full"
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.58} />
            <directionalLight position={[5, 8, 6]} intensity={0.88} />
            <directionalLight
              position={[-4, -3, -5]}
              intensity={0.32}
              color="#b8c4d4"
            />
            <HeroShapes isDark={isDark} />
          </Suspense>
        </Canvas>
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-muted/50 via-muted/25 to-transparent" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/45 to-background/90 dark:from-background/20 dark:via-background/50 dark:to-background/94" />
    </div>
  );
}
