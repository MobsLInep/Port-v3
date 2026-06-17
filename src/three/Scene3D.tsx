import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Clouds, Cloud } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/assets/images/banner/Flower2.glb");
useGLTF.preload("/assets/images/footer/compact_macintosh/scene.gltf");

type ModelProps = {
  url: string;
  scale?: number;
  position?: [number, number, number];
  rotationSpeed?: number;
  /** treat the model as a static art object: no spin, only subtle idle drift */
  float?: boolean;
  /** override every mesh material with a glossy tinted material */
  tint?: string;
  /** vertical water-like float amplitude (world units); 0 disables the bob */
  bob?: number;
};

function SpinningModel({ url, scale = 1, position = [0, 0, 0], rotationSpeed = 0.3, float = false, tint, bob = 0 }: ModelProps) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  // Auto-center at origin and normalize to a target height so framing is
  // predictable regardless of the model's native pivot/units.
  const { model, fit } = useMemo(() => {
    const clone = scene.clone(true);
    if (tint) {
      clone.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(tint),
            roughness: 0.2,
            metalness: 0.7,
            envMapIntensity: 5.1,
          });
        }
      });
    }
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    clone.position.sub(center); // recenter geometry on origin
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return { model: clone, fit: 1 / maxDim };
  }, [scene, tint]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const px = state.pointer.x;
    const py = state.pointer.y;
    if (float) {
      // Static sculpture: a near-imperceptible drift, so the page reads as a
      // print cover that happens to live on the web — composition, not animation.
      const t = state.clock.elapsedTime;
      ref.current.position.y = position[1] + Math.sin(t * 0.32) * 0.03;
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, Math.sin(t * 0.1) * 0.025 + px * 0.03, 0.03);
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -py * 0.025, 0.025);
    } else {
      ref.current.rotation.y += delta * rotationSpeed;
      // mouse parallax: tilt with vertical pointer, slide depth with horizontal
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -py * 0.18, 0.05);
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, position[0] + px * 0.25, 0.05);
      if (bob > 0) {
        // two layered sines (incommensurate frequencies) give an organic,
        // water-like rise/fall instead of a mechanical bounce.
        const t = state.clock.elapsedTime;
        const wave = Math.sin(t * 0.6) * 0.72 + Math.sin(t * 0.93 + 1.3) * 0.28;
        ref.current.position.y = position[1] + wave * bob;
      }
    }
  });

  // `scale` now means "target height in world units" since the model is normalized.
  return (
    <group ref={ref} position={position} scale={scale * fit} rotation={[0, 0, THREE.MathUtils.degToRad(-10)]}>
      <primitive object={model} />
    </group>
  );
}

/** One repeating tile of soft volumetric clouds, banded across the top of the
 *  frame. Two of these abut at exactly TILE units apart so the field reads as a
 *  seamless, period-TILE pattern that can scroll forever without a visible seam. */
const TILE = 30;

function CloudTile() {
  return (
    <Clouds material={THREE.MeshBasicMaterial} limit={500} frustumCulled={false}>
      <Cloud seed={1} segments={50} bounds={[9, 2, 3]} volume={11} color="#ffffff" opacity={0.7} speed={0.18} position={[3, 3.4, -8]} />
      <Cloud seed={2} segments={44} bounds={[8, 1.8, 3]} volume={9} color="#eef4fb" opacity={0.55} speed={0.22} position={[14, 4.6, -10]} />
      <Cloud seed={3} segments={40} bounds={[7, 1.6, 2.5]} volume={8} color="#ffffff" opacity={0.6} speed={0.2} position={[22, 2.8, -7]} />
      <Cloud seed={4} segments={36} bounds={[6, 1.4, 2]} volume={7} color="#e9f1fb" opacity={0.5} speed={0.25} position={[9, 5.4, -12]} />
      <Cloud seed={5} segments={40} bounds={[8, 1.8, 3]} volume={8} color="#ffffff" opacity={0.6} speed={0.2} position={[18, 3.6, -9]} />
      <Cloud seed={6} segments={36} bounds={[7, 1.6, 2.5]} volume={7} color="#f2f7fd" opacity={0.5} speed={0.23} position={[26, 5, -11]} />
      <Cloud seed={7} segments={34} bounds={[6, 1.4, 2]} volume={6} color="#ffffff" opacity={0.55} speed={0.21} position={[6, 4.2, -6]} />
    </Clouds>
  );
}

function DriftingClouds() {
  const a = useRef<THREE.Group>(null);
  const b = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    const v = delta * 0.4; // world units / sec the field drifts
    for (const r of [a, b]) {
      if (!r.current) continue;
      r.current.position.x += v;
      // when a tile drifts a full period past origin, recycle it behind the
      // other tile (x - 2*TILE) so the two always abut — a seamless loop.
      if (r.current.position.x > TILE) r.current.position.x -= 2 * TILE;
    }
  });
  return (
    <>
      <group ref={a} position={[0, 0, 0]}>
        <CloudTile />
      </group>
      <group ref={b} position={[-TILE, 0, 0]}>
        <CloudTile />
      </group>
    </>
  );
}

type Scene3DProps = {
  /** "clouds" renders the drifting sky band on its own layer (behind the oval),
   *  "flower" the rotating sculpture, "macintosh" the footer model. */
  variant: "flower" | "macintosh" | "clouds";
  /** show the HDR as the canvas background (used for the banner sky) */
  showBackground?: boolean;
};

export default function Scene3D({ variant, showBackground = false }: Scene3DProps) {
  const isFlower = variant === "flower";
  const isClouds = variant === "clouds";
  return (
    <Canvas
      camera={{ position: [0, 3, 9], fov: 30 }}
      gl={{ alpha: true, antialias: true, toneMappingExposure: 1.1 }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 6, 5]} intensity={1.7} />
      <directionalLight position={[-6, 1, 2]} intensity={0.7} color="#ffd9e6" />
      <directionalLight position={[-5, -2, -3]} intensity={0.35} />
      <Suspense fallback={null}>
        {isClouds ? (
          <DriftingClouds />
        ) : isFlower ? (
          <>
            <SpinningModel
              url="/assets/images/banner/Flower2.glb"
              scale={9.6}
              position={[0, -2, 0]}
              rotationSpeed={0.4}
              tint="#9e5974"
              bob={0.45}
            />
            <Environment
              files="/assets/images/banner/pretoria_gardens_1k_comp.hdr"
              background={showBackground}
              backgroundBlurriness={0.5}
            />
          </>
        ) : (
          <>
            <SpinningModel
              url="/assets/images/footer/compact_macintosh/scene.gltf"
              scale={2.6}
              position={[0, 0, 0]}
              rotationSpeed={0.5}
            />
            <Environment files="/assets/images/footer/moonless_golf_1k_comp.hdr" />
          </>
        )}
      </Suspense>
    </Canvas>
  );
}
