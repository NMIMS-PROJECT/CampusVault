import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Box, Text } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

function VaultBox() {
    const boxRef = useRef();
    const groupRef = useRef();

    useEffect(() => {
        const animate = () => {
            if (groupRef.current) {
                groupRef.current.rotation.x += 0.003;
                groupRef.current.rotation.y += 0.005;
            }
            requestAnimationFrame(animate);
        };
        animate();
    }, []);

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
            <group ref={groupRef}>
                {/* Main vault box */}
                <Box ref={boxRef} args={[3, 3, 3]} position={[0, 0, 0]}>
                    <meshStandardMaterial
                        color="#38bdf8"
                        emissive="#0ea5e9"
                        emissiveIntensity={0.4}
                        metalness={0.8}
                        roughness={0.2}
                    />
                </Box>

                {/* Glow effect */}
                <mesh position={[0, 0, 0]} scale={3.2}>
                    <boxGeometry args={[3, 3, 3]} />
                    <meshBasicMaterial
                        color="#38bdf8"
                        transparent
                        opacity={0.1}
                        wireframe={false}
                    />
                </mesh>

                {/* Corner accent boxes */}
                {[
                    [-1.5, 1.5, 1.5],
                    [1.5, 1.5, 1.5],
                    [-1.5, -1.5, 1.5],
                    [1.5, -1.5, 1.5],
                ].map((pos, i) => (
                    <Box key={i} args={[0.6, 0.6, 0.6]} position={pos}>
                        <meshStandardMaterial
                            color="#06b6d4"
                            emissive="#0891b2"
                            emissiveIntensity={0.6}
                            metalness={0.9}
                            roughness={0.1}
                        />
                    </Box>
                ))}

                {/* Rotating rings */}
                <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
                    <torusGeometry args={[4, 0.15, 16, 100]} />
                    <meshStandardMaterial
                        color="#38bdf8"
                        emissive="#0ea5e9"
                        emissiveIntensity={0.5}
                    />
                </mesh>

                <mesh rotation={[Math.PI / 3, 0, 0]} position={[0, 0, 0]}>
                    <torusGeometry args={[4.2, 0.12, 16, 100]} />
                    <meshStandardMaterial
                        color="#0891b2"
                        emissive="#06b6d4"
                        emissiveIntensity={0.4}
                    />
                </mesh>

                <mesh rotation={[Math.PI / 2, Math.PI / 3, 0]} position={[0, 0, 0]}>
                    <torusGeometry args={[4.4, 0.1, 16, 100]} />
                    <meshStandardMaterial
                        color="#22d3ee"
                        emissive="#38bdf8"
                        emissiveIntensity={0.3}
                    />
                </mesh>
            </group>

            {/* Floating particles around vault */}
            {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const radius = 5;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                return (
                    <mesh key={`particle-${i}`} position={[x, Math.sin(i) * 2, z]}>
                        <sphereGeometry args={[0.15, 16, 16]} />
                        <meshStandardMaterial
                            color="#38bdf8"
                            emissive="#0ea5e9"
                            emissiveIntensity={0.8}
                        />
                    </mesh>
                );
            })}
        </Float>
    );
}

export function FloatingVault3D() {
    return (
        <div className="relative h-full w-full">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 50 }}
                gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.2} color="#38bdf8" />
                <pointLight position={[-10, -10, 10]} intensity={0.8} color="#0891b2" />
                <VaultBox />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={2}
                />
            </Canvas>
        </div>
    );
}
