"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export type HomeHeroBackdropProps = {
  /** 一度でも学習した語の数 */
  touched: number;
  /** リスト収録語数 */
  total: number;
  /** 集計完了後 true（未完了時は初期形状のまま） */
  statsReady: boolean;
};

const LERP_SPEED = 3.2;

function SecondaryGeometry({ tier }: { tier: number }) {
  switch (tier) {
    case 0:
      return <octahedronGeometry args={[0.9, 0]} />;
    case 1:
      return <tetrahedronGeometry args={[1.05, 0]} />;
    case 2:
      return <dodecahedronGeometry args={[0.62, 0]} />;
    default:
      return <torusGeometry args={[0.52, 0.14, 28, 18]} />;
  }
}

function HeroShapes({
  isDark,
  progress,
}: {
  isDark: boolean;
  progress: HomeHeroBackdropProps;
}) {
  const group = useRef<THREE.Group>(null);
  const mainMat = useRef<THREE.MeshStandardMaterial>(null);
  const accentMat = useRef<THREE.MeshStandardMaterial>(null);
  const smoothRatio = useRef(0);
  const targetRef = useRef(0);
  const prevMainDetail = useRef(-1);
  const prevSecTier = useRef(-1);

  const targetRatio =
    progress.statsReady && progress.total > 0
      ? Math.min(1, progress.touched / progress.total)
      : 0;
  targetRef.current = targetRatio;

  const palette = useMemo(() => {
    if (isDark) {
      return {
        mainA: "#5c6578",
        mainB: "#9eb0d4",
        accentA: "#454d5c",
        accentB: "#7a8fb8",
        emissiveLo: 0.06,
        emissiveHi: 0.17,
      };
    }
    return {
      mainA: "#b0a090",
      mainB: "#d4a82e",
      accentA: "#c4b8a4",
      accentB: "#e8c860",
      emissiveLo: 0.04,
      emissiveHi: 0.15,
    };
  }, [isDark]);

  const cMainA = useMemo(() => new THREE.Color(palette.mainA), [palette.mainA]);
  const cMainB = useMemo(() => new THREE.Color(palette.mainB), [palette.mainB]);
  const cAccentA = useMemo(() => new THREE.Color(palette.accentA), [palette.accentA]);
  const cAccentB = useMemo(() => new THREE.Color(palette.accentB), [palette.accentB]);
  const tmpMain = useMemo(() => new THREE.Color(), []);
  const tmpAccent = useMemo(() => new THREE.Color(), []);

  const [mainDetail, setMainDetail] = useState(0);
  const [secTier, setSecTier] = useState(0);

  useFrame((_, delta) => {
    const t = Math.min(1, LERP_SPEED * delta);
    smoothRatio.current = THREE.MathUtils.lerp(
      smoothRatio.current,
      targetRef.current,
      t
    );
    const r = smoothRatio.current;

    const g = group.current;
    if (g) {
      const spin = 0.075 + r * 0.15;
      g.rotation.y += delta * spin;
      g.rotation.x += delta * (0.026 + r * 0.042);
      g.scale.setScalar(0.82 + r * 0.26);
    }

    const mMain = mainMat.current;
    const mAccent = accentMat.current;
    if (mMain) {
      tmpMain.copy(cMainA).lerp(cMainB, r);
      mMain.color.copy(tmpMain);
      mMain.emissive.copy(tmpMain);
      mMain.emissiveIntensity =
        palette.emissiveLo + r * (palette.emissiveHi - palette.emissiveLo);
      mMain.metalness = 0.2 + r * 0.34;
      mMain.roughness = 0.54 - r * 0.2;
    }
    if (mAccent) {
      tmpAccent.copy(cAccentA).lerp(cAccentB, r);
      mAccent.color.copy(tmpAccent);
      mAccent.emissive.copy(tmpAccent);
      mAccent.emissiveIntensity = 0.028 + r * 0.11;
      mAccent.metalness = 0.1 + r * 0.3;
      mAccent.roughness = 0.64 - r * 0.22;
    }

    const md = Math.min(3, Math.floor(r * 3.001));
    const st = Math.min(3, Math.floor(r * 2.751 + 0.25));

    if (md !== prevMainDetail.current) {
      prevMainDetail.current = md;
      setMainDetail(md);
    }
    if (st !== prevSecTier.current) {
      prevSecTier.current = st;
      setSecTier(st);
    }
  });

  return (
    <group ref={group}>
      <mesh position={[0.32, 0.08, 0]} rotation={[0.35, 0.45, 0.2]}>
        <icosahedronGeometry args={[0.78, mainDetail]} />
        <meshStandardMaterial
          ref={mainMat}
          color={palette.mainA}
          emissive={palette.mainA}
          emissiveIntensity={palette.emissiveLo}
          metalness={0.2}
          roughness={0.54}
        />
      </mesh>
      <mesh
        position={[-0.42, -0.22, 0.12]}
        rotation={[-0.2, 0.6, 0.15]}
        scale={0.46 + secTier * 0.05}
      >
        <SecondaryGeometry tier={secTier} />
        <meshStandardMaterial
          ref={accentMat}
          color={palette.accentA}
          emissive={palette.accentA}
          emissiveIntensity={0.028}
          metalness={0.1}
          roughness={0.64}
        />
      </mesh>
    </group>
  );
}

/** ホーム用 3D 背景。学習進捗に応じて形状・色が変化する（WebGL・SSR なし） */
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
            <HeroShapes isDark={isDark} progress={progress} />
          </Suspense>
        </Canvas>
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-muted/50 via-muted/25 to-transparent" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/45 to-background/90 dark:from-background/20 dark:via-background/50 dark:to-background/94" />
    </div>
  );
}
