"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export type HomeHeroBackdropProps = {
  touched: number;
  total: number;
  statsReady: boolean;
};

const LERP_SPEED = 2.4;

const LIGHT_PALETTE = [
  "#FF6B6B", // coral
  "#4ECDC4", // teal
  "#FFE66D", // yellow
  "#A8E6CF", // mint
  "#DDA0DD", // plum
  "#FF8A5C", // orange
  "#88D8B0", // green
  "#B8A9C9", // lavender
];

const DARK_PALETTE = [
  "#FF8A80", // soft coral
  "#64FFDA", // teal glow
  "#FFD54F", // warm yellow
  "#69F0AE", // mint glow
  "#CE93D8", // plum
  "#FFAB91", // soft orange
  "#80CBC4", // green
  "#B39DDB", // lavender
];

type BubbleConfig = {
  position: [number, number, number];
  scale: number;
  shape: "cube" | "sphere" | "torus" | "pill";
  colorIdx: number;
  speed: number;
  phase: number;
  rotSpeed: [number, number, number];
};

function generateBubbles(count: number, seed: number): BubbleConfig[] {
  let s = seed;
  function rand() {
    s = (s * 16807 + 0) % 2147483647;
    return (s & 0x7fffffff) / 0x7fffffff;
  }

  const shapes: BubbleConfig["shape"][] = ["cube", "sphere", "torus", "pill"];
  const configs: BubbleConfig[] = [];

  for (let i = 0; i < count; i++) {
    configs.push({
      position: [
        (rand() - 0.5) * 3.6,
        (rand() - 0.5) * 2.8,
        (rand() - 0.5) * 1.6,
      ],
      scale: 0.12 + rand() * 0.22,
      shape: shapes[Math.floor(rand() * shapes.length)],
      colorIdx: Math.floor(rand() * LIGHT_PALETTE.length),
      speed: 0.3 + rand() * 0.6,
      phase: rand() * Math.PI * 2,
      rotSpeed: [
        (rand() - 0.5) * 0.8,
        (rand() - 0.5) * 0.8,
        (rand() - 0.5) * 0.4,
      ],
    });
  }
  return configs;
}

function BubbleShape({ shape }: { shape: BubbleConfig["shape"] }) {
  switch (shape) {
    case "cube":
      return <boxGeometry args={[1, 1.3, 0.4]} />;
    case "sphere":
      return <sphereGeometry args={[0.6, 16, 16]} />;
    case "torus":
      return <torusGeometry args={[0.45, 0.18, 12, 24]} />;
    case "pill":
      return <capsuleGeometry args={[0.3, 0.6, 8, 16]} />;
  }
}

function FloatingBubble({
  config,
  palette,
  visible,
  clock,
}: {
  config: BubbleConfig;
  palette: string[];
  visible: boolean;
  clock: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const targetOpacity = visible ? 1 : 0;
  const currentOpacity = useRef(0);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;

    currentOpacity.current = THREE.MathUtils.lerp(
      currentOpacity.current,
      targetOpacity,
      delta * 2.5
    );
    if (mat.current) {
      mat.current.opacity = currentOpacity.current;
    }
    m.visible = currentOpacity.current > 0.01;

    const t = clock;
    const bob = Math.sin(t * config.speed + config.phase) * 0.12;
    const sway = Math.cos(t * config.speed * 0.7 + config.phase) * 0.06;
    m.position.set(
      config.position[0] + sway,
      config.position[1] + bob,
      config.position[2]
    );
    m.rotation.x += delta * config.rotSpeed[0];
    m.rotation.y += delta * config.rotSpeed[1];
    m.rotation.z += delta * config.rotSpeed[2];
  });

  const color = palette[config.colorIdx % palette.length];

  return (
    <mesh ref={mesh} scale={config.scale} visible={false}>
      <BubbleShape shape={config.shape} />
      <meshStandardMaterial
        ref={mat}
        color={color}
        emissive={color}
        emissiveIntensity={0.15}
        metalness={0.05}
        roughness={0.55}
        transparent
        opacity={0}
      />
    </mesh>
  );
}

function CenterBook({
  isDark,
  ratio,
}: {
  isDark: boolean;
  ratio: React.RefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const coverMat = useRef<THREE.MeshStandardMaterial>(null);
  const pageMat = useRef<THREE.MeshStandardMaterial>(null);

  const coverColor = isDark ? "#CE93D8" : "#FF6B6B";
  const pageColor = isDark ? "#2a2a3e" : "#fffef5";

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.15;
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    const s = 0.7 + (ratio.current ?? 0) * 0.35;
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, s, delta * 2));

    if (coverMat.current) {
      const r = ratio.current ?? 0;
      coverMat.current.emissiveIntensity = 0.08 + r * 0.15;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[0.7, 0.9, 0.06]} />
        <meshStandardMaterial
          ref={coverMat}
          color={coverColor}
          emissive={coverColor}
          emissiveIntensity={0.08}
          metalness={0.05}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[0.62, 0.82, 0.08]} />
        <meshStandardMaterial
          ref={pageMat}
          color={pageColor}
          metalness={0.0}
          roughness={0.9}
        />
      </mesh>
      <mesh position={[-0.34, 0, 0.02]}>
        <boxGeometry args={[0.04, 0.9, 0.14]} />
        <meshStandardMaterial
          color={coverColor}
          emissive={coverColor}
          emissiveIntensity={0.06}
          metalness={0.05}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}

function Scene({
  isDark,
  progress,
}: {
  isDark: boolean;
  progress: HomeHeroBackdropProps;
}) {
  const clockRef = useRef(0);
  const smoothRatio = useRef(0);
  const targetRef = useRef(0);

  const targetRatio =
    progress.statsReady && progress.total > 0
      ? Math.min(1, progress.touched / progress.total)
      : 0;
  targetRef.current = targetRatio;

  const bubbles = useMemo(() => generateBubbles(18, 42), []);
  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;

  const minVisible = 6;
  const maxVisible = bubbles.length;

  useFrame((_, delta) => {
    clockRef.current += delta;
    const t = Math.min(1, LERP_SPEED * delta);
    smoothRatio.current = THREE.MathUtils.lerp(
      smoothRatio.current,
      targetRef.current,
      t
    );
  });

  const visibleCount = Math.round(
    minVisible + (maxVisible - minVisible) * smoothRatio.current
  );

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={0.9} />
      <directionalLight
        position={[-3, -2, -4]}
        intensity={0.3}
        color={isDark ? "#8080ff" : "#ffd4b8"}
      />

      <CenterBook isDark={isDark} ratio={smoothRatio} />

      {bubbles.map((b, i) => (
        <FloatingBubble
          key={i}
          config={b}
          palette={palette}
          visible={i < visibleCount}
          clock={clockRef.current}
        />
      ))}
    </>
  );
}

export function HomeHeroBackdrop({
  touched = 0,
  total = 0,
  statsReady = false,
}: HomeHeroBackdropProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  const progress = useMemo(
    () => ({ touched, total, statsReady }),
    [touched, total, statsReady]
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      aria-hidden
    >
      {mounted ? (
        <Canvas
          camera={{ position: [0, 0, 4], fov: 38 }}
          dpr={[1, 1.5]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "low-power",
          }}
          className="h-full w-full"
        >
          <Suspense fallback={null}>
            <Scene isDark={isDark} progress={progress} />
          </Suspense>
        </Canvas>
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-muted/50 via-muted/25 to-transparent" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background/40 to-background/88 dark:from-background/10 dark:via-background/45 dark:to-background/92" />
    </div>
  );
}
