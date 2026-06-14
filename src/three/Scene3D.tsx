import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
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
};

function SpinningModel({ url, scale = 1, position = [0, 0, 0], rotationSpeed = 0.3, float = false, tint }: ModelProps) {
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
            roughness: 0.12,
            metalness: 0.9,
            envMapIntensity: 2.1,
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
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -py * 0.18, 0.05);
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, position[0] + px * 0.25, 0.05);
    }
  });

  // `scale` now means "target height in world units" since the model is normalized.
  return (
    <group ref={ref} position={position} scale={scale * fit}>
      <primitive object={model} />
    </group>
  );
}

type Scene3DProps = {
  variant: "flower" | "macintosh";
  /** show the HDR as the canvas background (used for the banner sky) */
  showBackground?: boolean;
};

export default function Scene3D({ variant, showBackground = false }: Scene3DProps) {
  const isFlower = variant === "flower";
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 30 }}
      gl={{ alpha: true, antialias: true, toneMappingExposure: 1.1 }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 6, 5]} intensity={1.7} />
      <directionalLight position={[-6, 1, 2]} intensity={0.7} color="#ffd9e6" />
      <directionalLight position={[-5, -2, -3]} intensity={0.35} />
      <Suspense fallback={null}>
        {isFlower ? (
          <>
            <SpinningModel
              url="/assets/images/banner/Flower2.glb"
              scale={9.6}
              position={[0.35, -1.6, 0]}
              rotationSpeed={0.4}
              tint="#b01f42"
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
