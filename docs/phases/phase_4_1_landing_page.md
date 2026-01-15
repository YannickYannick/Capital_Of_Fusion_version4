# ✨ Phase 4.1: Landing Page V2 Integration

**Objective**: Implement the immersive "Version 2" Landing Page with full-screen video background, glassmorphism navigation, and premium animations.

## 1. Component Architecture

**Files to Create**:
- `src/components/features/landing/VideoBackground.tsx`
- `src/components/features/landing/HeroSection.tsx`
- `src/components/shared/NavbarV2.tsx` (Transparent/Glass)
- `src/app/(site)/page.tsx` (The Landing Page itself)

## 2. Video Background Logic

**Specs**:
- Must support YouTube Embed Iframe API.
- Must cover entire screen (`object-cover`, `fixed`, `z-0`).
- Must have a dark gradient overlay.

**Code Spec (VideoBackground.tsx)**:
```tsx
// simplified structure
<div className="fixed inset-0 z-0 overflow-hidden">
  <div className="absolute inset-0 z-10 bg-black/60 bg-gradient-to-r from-black/80 to-transparent" />
  <iframe 
    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1`}
    className="w-full h-full scale-150" // Scale to hide controls/black bars
  />
</div>
```

## 3. Navbar V2 (Glassmorphism)

**Specs**:
- Fixed position (`fixed top-0 w-full z-50`).
- Backdrop Blur (`backdrop-blur-md`).
- Background: `bg-black/30` (Semi-transparent).

## 4. Hero Section Animations (Framer Motion)

**Specs**:
- Title "Capital of Fusion France" must fade in and slide up.
- CTA Buttons must have `whileHover={{ scale: 1.05 }}`.

**Code Spec (HeroSection.tsx)**:
```tsx
<motion.h1 
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="text-6xl font-bold text-white"
>
  Capital of Fusion France
</motion.h1>
```

## 5. Integration Context

**Action**: Use `(site)` layout group in Next.js to apply specific layout (no standard navbar, specific font) to the landing page.

**File**: `src/app/(site)/layout.tsx`
```tsx
export default function SiteLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-background font-sans antialiased text-white">
      {/* Navbar V2 is mounted here */}
      <NavbarV2 /> 
      {children}
    </div>
  )
}
```

## 6. Verification

**Checklist**:
- [ ] Video plays automatically on load (muted).
- [ ] Navbar is fixed and transparent.
- [ ] Text is legible over the video (Gradient overlay works).
- [ ] Animations are smooth (60fps).
- [ ] Responsive: Video covers screen on mobile.
