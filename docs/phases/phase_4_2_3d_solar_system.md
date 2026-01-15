# 🌌 Phase 4.2: 3D Solar System Implementation

**Objective**: Build the interactive "Planetary System" using Three.js / React Three Fiber to visualize the "Capital of Fusion" organization.

## 1. Scene Setup (R3F)

**Action**: Initialize the 3D Canvas in `src/components/features/organization/PlanetarySystem.tsx`.

**Stack**:
- `@react-three/fiber`: React reconciler for Three.js.
- `@react-three/drei`: Component helpers (OrbitControls, Stars, Text).

```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'

export default function PlanetarySystem() {
  return (
    <div className="h-screen w-full bg-black">
      <Canvas camera={{ position: [0, 20, 25], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
        <OrbitControls enableZoom={true} maxDistance={50} minDistance={5} />
        
        {/* The Solar System Group */}
        <CapitalOfFusionSystem />
      </Canvas>
    </div>
  )
}
```

## 2. The "Sun" (Root Node)

**Action**: Create the central node "Capital of Fusion".

```tsx
function Sun({ onClick }) {
  return (
    <mesh onClick={onClick}>
      <sphereGeometry args={[2.5, 32, 32]} />
      <meshStandardMaterial emissive="#fbbf24" emissiveIntensity={2} color="#fbbf24" />
      <Html distanceFactor={15}>
        <div className="text-white font-bold text-lg select-none">
          Capital of Fusion
        </div>
      </Html>
    </mesh>
  )
}
```

## 3. The "Planets" (Orbits)

**Action**: Create orbiting planets for "Bachata Vibe", "Kompa Vibe", etc.

**Logic**:
- Each planet has an `orbitRadius` and `speed`.
- Use `useFrame` to animate rotation around the sun.

```tsx
function Planet({ name, radius, color, speed, onClick }) {
  const ref = useRef()
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.z = Math.sin(t) * radius
  })

  return (
    <group>
      {/* Orbit Ring */}
      <Ring args={[radius, radius + 0.1, 64]} rotation={[-Math.PI / 2, 0, 0]} />
      
      {/* The Planet Mesh */}
      <mesh ref={ref} onClick={onClick}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}
```

## 4. Interactions & Data Fetching

**Action**: Connect to the API endpoint `/api/organization/structure/`.

1. **Fetch**: Use `useQuery` to get the nodes.
2. **Map**: Map nodes to `Sun` (ROOT) and `Planet` (BRANCH).
3. **Click**: On click, open a Side Panel (Zustand store `useOrganizationStore`) with the node details.

## 5. Verification

**Checklist**:
- [ ] The Canvas renders a black scene with stars.
- [ ] The Central Sun is visible and glowing.
- [ ] Planets orbit around the sun.
- [ ] Clicking a planet triggers a console log (or opens panel).
- [ ] Performance stays > 30fps.
