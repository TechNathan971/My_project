import { Canvas } from '@react-three/fiber'
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import { Mesh } from 'three'

function FloatingGeometry({ position, color, scale = 1 }: { position: [number, number, number], color: string, scale?: number }) {
  const meshRef = useRef<Mesh>(null)
  
  const geometry = useMemo(() => {
    const shapes = ['sphere', 'box', 'torus', 'octahedron']
    return shapes[Math.floor(Math.random() * shapes.length)]
  }, [])

  return (
    <Float
      speed={1 + Math.random() * 2}
      rotationIntensity={0.5 + Math.random() * 0.5}
      floatIntensity={0.5 + Math.random() * 0.5}
    >
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
        {geometry === 'box' && <boxGeometry args={[0.8, 0.8, 0.8]} />}
        {geometry === 'torus' && <torusGeometry args={[0.6, 0.2, 16, 32]} />}
        {geometry === 'octahedron' && <octahedronGeometry args={[0.7]} />}
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.6}
          distort={0.3}
          speed={2}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </Float>
  )
}

function Background3D() {
  const shapes = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ] as [number, number, number],
      color: [
        '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981',
        '#f59e0b', '#ef4444', '#ec4899', '#6366f1'
      ][Math.floor(Math.random() * 8)],
      scale: 0.5 + Math.random() * 0.5
    }))
  }, [])

  return (
    <div className="fixed inset-0 -z-10 opacity-30">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Stars
          radius={100}
          depth={50}
          count={1000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        
        {shapes.map((shape) => (
          <FloatingGeometry
            key={shape.id}
            position={shape.position}
            color={shape.color}
            scale={shape.scale}
          />
        ))}
      </Canvas>
    </div>
  )
}

export default Background3D