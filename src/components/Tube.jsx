
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TUBE_WIDTH = 0.8;
const TUBE_HEIGHT = 3.2;
const CAPACITY = 4;

function GlassTube({ layers, selected, pouring }) {
  const group = useRef();

  useFrame((_, delta) => {
    if (!group.current) return;

    const targetRotation = pouring ? -0.45 : 0;
    const targetY = selected ? 0.2 : 0;

    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      targetRotation,
      5,
      delta
    );

    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      targetY,
      5,
      delta
    );
  });

  return (
    <group ref={group}>
      {/* Glass body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry
          args={[TUBE_WIDTH / 2, TUBE_WIDTH / 2, TUBE_HEIGHT, 48, 1, true]}
        />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0.08}
          transmission={0.92}
          thickness={0.25}
          ior={1.45}
          transparent
          opacity={0.32}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Glass rim */}
      <mesh position={[0, TUBE_HEIGHT / 2, 0]}>
        <torusGeometry args={[TUBE_WIDTH / 2, 0.045, 12, 48]} />
        <meshPhysicalMaterial
          color="#e8f5ff"
          roughness={0.08}
          metalness={0.1}
          transmission={0.7}
        />
      </mesh>

      {/* Glass bottom */}
      <mesh position={[0, -TUBE_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[TUBE_WIDTH / 2, TUBE_WIDTH / 2, 0.12, 48]} />
        <meshPhysicalMaterial
          color="#d8efff"
          roughness={0.08}
          transmission={0.7}
          thickness={0.2}
        />
      </mesh>

      {/* Liquid layers */}
      {layers.map((color, index) => {
        const liquidHeight = (TUBE_HEIGHT * 0.82) / CAPACITY;
        const y =
          -TUBE_HEIGHT / 2 +
          0.12 +
          liquidHeight * index +
          liquidHeight / 2;

        return (
          <mesh key={index} position={[0, y, 0]}>
            <cylinderGeometry
              args={[
                TUBE_WIDTH / 2 - 0.055,
                TUBE_WIDTH / 2 - 0.055,
                liquidHeight,
                48,
              ]}
            />
            <meshPhysicalMaterial
              color={color}
              roughness={0.12}
              metalness={0.05}
              clearcoat={1}
              clearcoatRoughness={0.05}
            />
          </mesh>
        );
      })}

      {/* Glass highlights */}
      <mesh position={[-0.25, 0, 0.18]}>
        <boxGeometry args={[0.035, 2.75, 0.025]} />
        <meshBasicMaterial color="white" transparent opacity={0.65} />
      </mesh>

      <mesh position={[0.25, 0, 0.18]}>
        <boxGeometry args={[0.018, 2.4, 0.02]} />
        <meshBasicMaterial color="white" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function Tube({
  index,
  layers = [],
  selected = false,
  pouring = false,
  disabled = false,
  onClick,
}) {
  return (
    <div
      className="tube-3d"
      onClick={() => {
        if (!disabled) onClick(index);
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Tube ${index + 1}`}
      aria-pressed={selected}
      aria-disabled={disabled}
      onKeyDown={(event) => {
        if (!disabled && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick(index);
        }
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 35 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 5]} intensity={2} />
        <pointLight position={[-3, 1, 3]} intensity={1.2} />

        <GlassTube
          layers={layers}
          selected={selected}
          pouring={pouring}
        />
      </Canvas>
    </div>
  );
}
