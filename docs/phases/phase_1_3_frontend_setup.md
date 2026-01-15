# ⚛️ Phase 1.3: Frontend Setup (Next.js + Design V2)

**Objective**: Initialize Next.js 15 with Tailwind, Framer Motion, and the specific V2 Design System assets.

## 1. Next.js Initialization

**Action**: Create the app with strict settings.

```bash
cd frontend

npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

## 2. Dependencies Installation (V2 Specs)

**Action**: Install specific UI/Animation libraries required for the Landing V2.

```bash
# UI Architecture
npm install clsx tailwind-merge lucide-react class-variance-authority

# Animations (CRITICAL FOR V2)
npm install framer-motion@^10.16.5
npm install gsap@^3.12.5

# 3D System (CRITICAL FOR V2 PLANETS)
npm install three @react-three/fiber @react-three/drei

# State & Data
npm install zustand @tanstack/react-query axios
```

## 3. Tailwind Configuration (Design V2)

**Action**: Configure the V2 color palette.

**File**: `tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        background: "#0a0e27", // The deep blue from V2
        primary: "#3b82f6",    // Blue accent
        secondary: "#10b981",  // Green accent
      },
      fontFamily: {
        sans: ["var(--font-inter)"], // Setup Inter in layout.tsx
      },
    }
  }
};
export default config;
```

## 4. App Structure Scaffolding

**Action**: Create the folder hierarchy based on `10-ARCHITECTURE_FICHIERS.md`.

```bash
mkdir -p src/components/ui
mkdir -p src/components/shared
mkdir -p src/components/features/landing
mkdir -p src/components/features/organization
mkdir -p src/lib
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/store
```

## 5. Core Utilities Setup

**Action**: Create `lib/utils.ts` (cn helper).

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## 6. Verification

**Checklist**:
- [ ] `npm run dev` starts the server on port 3000.
- [ ] Tailwind styles are applied (background `#0a0e27`).
- [ ] Framer Motion imports work without error.
