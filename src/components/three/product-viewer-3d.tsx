'use client'

import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stage, Html, useProgress } from '@react-three/drei'
import { Maximize2, RotateCcw, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as THREE from 'three'

// Loader progress
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-zinc-500">
        <div className="h-1 w-32 overflow-hidden rounded-full bg-zinc-200">
          <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs">{Math.round(progress)}%</p>
      </div>
    </Html>
  )
}

// Hotspot điểm chú thích nổi trên model
interface HotspotProps {
  position: [number, number, number]
  label: string
  description: string
}

function Hotspot({ position, label, description }: HotspotProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <Html position={position} center distanceFactor={6}>
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-lg shadow-blue-300 transition-transform hover:scale-125">
          <Info className="h-3 w-3" />
        </div>
        {hovered && (
          <div className="absolute left-8 top-1/2 z-10 w-40 -translate-y-1/2 rounded-xl border border-zinc-100 bg-white p-2.5 shadow-xl">
            <p className="text-xs font-semibold text-zinc-900">{label}</p>
            <p className="mt-0.5 text-[10px] leading-snug text-zinc-500">{description}</p>
          </div>
        )}
      </div>
    </Html>
  )
}

// Fallback: model iPhone bằng geometry đơn giản khi chưa có .glb
function IPhoneModel({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.3
  })

  return (
    <group>
      {/* Body */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.4, 3, 0.16]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.15} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.085]}>
        <boxGeometry args={[1.25, 2.7, 0.01]} />
        <meshStandardMaterial color="#111" emissive="#0a0a1a" emissiveIntensity={0.3} roughness={0} />
      </mesh>
      {/* Dynamic Island */}
      <mesh position={[0, 1.15, 0.092]}>
        <capsuleGeometry args={[0.1, 0.25, 4, 8]} />
        <meshStandardMaterial color="#050505" roughness={0} />
      </mesh>
      {/* Camera bump */}
      <mesh position={[-0.38, 0.9, -0.1]}>
        <boxGeometry args={[0.55, 0.55, 0.06]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Camera lenses */}
      {[[-0.25, 1.05], [-0.52, 1.05], [-0.25, 0.78], [-0.52, 0.78]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, -0.07]}>
          <circleGeometry args={[0.1, 16]} />
          <meshStandardMaterial color="#050505" roughness={0} metalness={1} />
        </mesh>
      ))}
      {/* Action button */}
      <mesh position={[-0.72, 0.6, 0]}>
        <boxGeometry args={[0.04, 0.3, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

const HOTSPOTS: HotspotProps[] = [
  { position: [1.2, 1.1, 0], label: 'Hệ thống camera', description: 'Camera 48MP chính, telephoto 5x, ultrawide 12MP' },
  { position: [1.2, -0.2, 0], label: 'Dynamic Island', description: 'Hiển thị thông báo, hoạt động trực tiếp thông minh' },
  { position: [-1.2, 0.6, 0], label: 'Action Button', description: 'Nút tùy chỉnh hành động nhanh' },
  { position: [0, -1.8, 0], label: 'USB-C', description: 'Sạc nhanh 45W, USB 3 tốc độ cao' },
]

const COLOR_OPTIONS = [
  { label: 'Desert Titanium', hex: '#C4A882' },
  { label: 'Black Titanium', hex: '#3D3731' },
  { label: 'Natural Titanium', hex: '#E3D5C3' },
  { label: 'White Titanium', hex: '#F1EEE9' },
]

export function ProductViewer3D() {
  const [activeColor, setActiveColor] = useState(COLOR_OPTIONS[0])
  const [showHotspots, setShowHotspots] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-950">
      {/* Canvas */}
      <div className="h-[420px] w-full">
        <Canvas camera={{ position: [0, 0, 7], fov: 40 }} shadows>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#6699ff" />
          <Suspense fallback={<Loader />}>
            <Stage environment="city" intensity={0.5} shadows={false}>
              <IPhoneModel color={activeColor.hex} />
            </Stage>
            {showHotspots && HOTSPOTS.map((h, i) => <Hotspot key={i} {...h} />)}
          </Suspense>
          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={1.5}
            enablePan={false}
            minDistance={4}
            maxDistance={12}
          />
        </Canvas>
      </div>

      {/* Controls overlay */}
      <div className="absolute right-3 top-3 flex flex-col gap-2">
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 bg-white/90 backdrop-blur-sm"
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? 'Dừng xoay' : 'Tự động xoay'}
        >
          <RotateCcw className={`h-3.5 w-3.5 ${autoRotate ? 'text-blue-600' : 'text-zinc-400'}`} />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 bg-white/90 backdrop-blur-sm"
          onClick={() => setShowHotspots(!showHotspots)}
          title={showHotspots ? 'Ẩn chú thích' : 'Hiện chú thích'}
        >
          <Info className={`h-3.5 w-3.5 ${showHotspots ? 'text-blue-600' : 'text-zinc-400'}`} />
        </Button>
      </div>

      {/* Color picker */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-zinc-900/80 px-3 py-2 backdrop-blur-md">
          <span className="text-[11px] text-zinc-400">Màu:</span>
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.label}
              onClick={() => setActiveColor(c)}
              title={c.label}
              className={`h-5 w-5 rounded-full border-2 transition-transform hover:scale-125 ${
                activeColor.hex === c.hex ? 'border-white scale-125' : 'border-transparent'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
          <span className="text-[11px] text-zinc-300">{activeColor.label}</span>
        </div>
      </div>

      {/* Label */}
      <div className="absolute left-3 top-3">
        <span className="rounded-full bg-blue-600/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          3D Interactive
        </span>
      </div>
    </div>
  )
}
