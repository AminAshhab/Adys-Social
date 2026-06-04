# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `web/`:

```bash
npm run dev          # Vite dev server (HMR)
npm run build        # tsc + vite build (also runs image optimisation)
npm run lint         # ESLint
npm run optimize-images   # Sharp image pipeline only (runs automatically on build)
```

No test suite is configured.

## Repository layout

```
AdysSocial/
├── SPEC.md          # Source of truth for content, copy, and design decisions
├── web/             # The entire frontend (Vite + React + TS + Tailwind v4)
│   ├── public/      # Static assets served at /
│   │   ├── logo.jpeg         # Adys Social gold monogram (nav + footer)
│   │   ├── profile.png       # Adam Kastner portrait (Profile section)
│   │   ├── favicon-ring.svg  # Favicon — logo.jpeg base64-embedded + gold ring
│   │   └── gallery/          # events/ (23 JPEGs) + weddings/ (10 JPEGs)
│   └── src/
│       ├── features/landing/ # All visible sections of the site
│       └── infrastructure/   # DI container, HTTP service (unused in prod)
```

## Architecture

### Single-feature landing page

`App.tsx` calls `useLenis()` (smooth scroll init) and renders the section sequence: `Header → Hero → Services → Gallery → Profile → InquiryForm → Footer`. Everything is in `src/features/landing/`.

### Design tokens

All colours, fonts, and easing curves live in the `@theme` block in `src/index.css` and are consumed as CSS custom properties (`var(--color-accent)`, etc.). Never hardcode colour values — always reference a token.

### Animation system

Two layers:
1. **`useReveal` hook** — attaches a GSAP ScrollTrigger to a container and stagger-reveals children matching a selector (default `[data-reveal]`, Services uses `[data-card]`). Drop the hook on a ref and mark children with the selector attribute.
2. **Manual GSAP timelines** — Hero and Profile each build their own `gsap.context()` timeline in a `useEffect`. Animations target `[data-hero-*]` / `[data-anim]` attribute selectors.

All animations must check `prefers-reduced-motion` before running and resolve instantly if true.

### Smooth scroll

Lenis is initialised once in `useLenis` (called from `App`). The singleton is also stored in module scope so that `scrollToSection(id)` — imported and called from any component — can reach it. Lenis is connected to the GSAP ticker so ScrollTrigger positions stay accurate.

### Path alias

`@/` maps to `src/`. Use it for all cross-folder imports.

### Image optimisation

`web/scripts/optimize-images.mjs` (Sharp) runs as `prebuild`. It resizes gallery images to max 1600px, JPEG quality 78, and only overwrites if the output is smaller. Source originals live in `docs/` and are never touched.

### SPEC.md

`SPEC.md` at the repo root is the authoritative reference for all copy, section content, and design decisions. Update it whenever the implementation changes.
