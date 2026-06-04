# Adys Social — Event Manager Website Specification

## Overview

A **single-page** static website for **Adam Kastner** (brand: **Adys Social**), a professional event manager & producer offering end-to-end event planning. The entire experience lives on one continuous scrollable page. The site is a first-person personal marketing tool aimed at prospective clients seeking a premium event experience.

**Brand:** Adys Social (`info@adyssocial.cz`) — gold monogram logo on dark background  
**Language:** Czech throughout  
**Perspective:** First-person (Adam speaks directly to visitors)

**Tech stack:** React 19 · TypeScript · Vite 6 · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis  
**Type:** One-page scroll experience, fully static, no backend  
**Deployment target:** Any static host (Vercel, Netlify, GitHub Pages, etc.)  
**Animation philosophy:** Motion should feel intentional and premium — easing curves over linear, opacity + transform over color/layout, staggered reveals over simultaneous. Every animation respects `prefers-reduced-motion`.

---

## Visual Design

| Token | Value |
|---|---|
| Background | `#0D0D0D` (near-black) |
| Surface | `#1A1A1A` (alternating section bg, cards) |
| Accent | `#C9A84C` (gold — CTAs, highlights, dividers) |
| Text primary | `#F5F5F5` |
| Text muted | `#999999` |
| Text dim | `#555555` |
| Border | `rgba(255,255,255,0.08)` |
| Heading font | `Playfair Display` (serif, Google Fonts) |
| Body font | `Inter` (sans-serif, Google Fonts) |
| Border radius | `2px` (sharp, modern) |
| Max content width | `1180px` centered (Gallery: `1280px`) |

Design tokens live in a Tailwind v4 `@theme` block in `web/src/index.css`. CSS custom properties are referenced as `var(--color-*)`, `var(--font-*)`, etc.

Easing tokens:
- `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` — primary reveal easing
- `--ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1)` — crossing transitions
- `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` — slight overshoot for buttons/hovers

---

## Site Structure

```
┌─ Header (sticky, blurred glass)
│
├─ Section 1 — Hero / Úvod            id="about"    (100svh)
├─ Section 2 — Services / Služby      id="services" (auto)
├─ Section 3 — Gallery / Reference    id="gallery"  (auto)
├─ Section 4 — Profile / Profil       id="profile"  (auto)
├─ Section 5 — Inquiry / Poptávka     id="inquire"  (auto)
└─ Section 6 — Footer / Kontakt       id="contact"  (auto)
```

---

## Section Specifications

### Header (Sticky Navigation)

- Fixed to top, full width, `background: rgba(13,13,13,0.92)` + `backdrop-filter: blur(12px)`
- Left: `logo.jpeg` as circular avatar (`56×56px`, `rounded-full`, gold `ring-1` stroke `#C9A84C`), links to `#about`
- Right: anchor links — *Úvod · Služby · Reference · O mně · Poptávka · Kontakt*
- Far right: "Poptat akci" button (outlined, gold hover) → scrolls to `#inquire`
- Collapses to hamburger menu on mobile (`< 1024px`)
- Smooth scroll via Lenis `scrollToSection(id)` with `~80px` offset
- Active section tracked via ScrollTrigger / IntersectionObserver → gold underline on active link

**Animations:**
- Scroll past hero: height shrinks `84px → 64px` (250ms transition)
- Nav link hover: gold underline grows from left
- Mobile hamburger: lines morph into X (300ms rotate transform)

**File:** `web/src/features/landing/components/Header.tsx`

---

### 1. Hero — Úvod

**Goal:** Immediately communicate identity, credibility, and value.

| Element | Detail |
|---|---|
| Layout | Two-column on desktop (text left, photo right); stacked on mobile |
| Eyebrow | `"Adam Kastner · Eventový manažer & producent"` |
| Headline | `"Vytvářím okamžiky, které trvají věčně"` (H1, Playfair Display, `clamp(2.08rem, 5.6vw, 4.4rem)`) |
| Body copy | Single punchy sentence: *"Mým cílem je vytvořit jedinečný zážitek a zajistit, aby si hosté odnesli nezapomenutelné vzpomínky."* |
| Primary CTA | `"Naplánovat akci"` → scrolls to `#inquire` |
| Secondary CTA | `"Moje služby"` → scrolls to `#services` |
| Right column | Adys Social logo (`/logo.jpeg`) at `317px` (desktop) / `352px` (xl), with radial gradient mask feathering edges into background; desktop only |
| Scroll cue | Mouse icon SVG at bottom center, infinite bounce animation |
| Background | Radial gold gradients on dark, subtle SVG noise overlay |

**Animations (GSAP entrance timeline):**
1. Background fades `opacity: 0 → 1` (1400ms)
2. Eyebrow slides up + fades in (800ms, delay 200ms)
3. Each headline word slides up from word-mask (`y: 100% → 0`, 900ms, 60ms stagger, delay 400ms)
4. Body copy fades + rises (800ms, delay 1000ms)
5. CTA buttons stagger fade + rise (700ms, 100ms stagger, delay 1200ms)
6. Scroll cue fades in (600ms, delay 1600ms)

**File:** `web/src/features/landing/components/Hero.tsx`

---

### 2. Services — Co nabízím

**Goal:** Clearly list offerings so clients self-qualify.

Layout: 2-column grid (`sm:grid-cols-2`), 1-column on mobile. Grid cells separated by `1px` border lines (using `gap-px bg-[var(--color-border)]` trick — no box-shadow needed).

Section heading: *"Co nabízím / Služby"* with subtitle.

Each card contains:
- Circular icon container (bordered, gold icon, rotates on hover)
- H3 service title
- 2–3 sentence description (first-person)

**Services (Czech, first-person):**

| # | Title | Icon | Description |
|---|---|---|---|
| 1 | Rozlučky se svobodou | `sparkles` | Mým cílem je vytvořit nezapomenutelné dny plných zážitků, zábavy a jedinečných momentů, na které budou všichni ještě dlouho rádi vzpomínat. |
| 2 | Svatby a oslavy | `heart` | Zajistím kompletní i částečné svatební plánování. Koordinuji dodavatele, řídím harmonogram a vedu akci na místě. |
| 3 | Soukromé večírky | `pin` | Připravím významná výročí, narozeniny i exkluzivní večeře s doprovodným programem a dekoracemi na míru. |
| 4 | Teambuildingy | `briefcase` | Kompletně koordinuji vše od hledání prostor až po samostatnou realizaci, dle vašich požadavků. |

**Animations:**
- Cards: staggered fade + rise (`y: 40px → 0`, 90ms stagger) via `useReveal` hook on grid container
- Card hover: `translateY(-6px)`, icon rotate `−6deg` + scale `1.1`, border glow on icon container

**Files:** `web/src/features/landing/components/Services.tsx`, `web/src/features/landing/data/services.ts`, `web/src/features/landing/components/ServiceIcon.tsx`

---

### 3. Gallery — Reference

**Goal:** Showcase past work to build trust and inspire clients.

Layout: **Horizontal scroll strip** — free-scroll (`overflow-x: auto`, no snap), fixed-height tiles. `data-lenis-prevent` prevents Lenis from intercepting wheel events. Scroller promoted to GPU compositor layer via `translateZ(0)` + `will-change: transform` + `contain: layout paint` for smooth vertical page scroll over the section.

Section heading: *"Reference / Vybrané akce"* with subtitle (first-person: "…akce, které jsem realizoval…"), centered.

**Filter pills** (above strip): Vše · Akce · Svatby — rounded pill buttons, active state fills gold background.

**Strip:**
- Each image: `h-[300px] sm:h-[340px]`, `w-auto`, `object-cover`, hover `scale(1.03)`
- Each tile: `content-visibility: auto` + `contain: layout paint` to skip offscreen rendering
- Hover overlay: gradient at bottom, category label fades in
- `loading="lazy" decoding="async"` on all images
- Left/right arrow buttons on desktop (`md:flex`)
- Edge gradient fades (left and right) to hint scrollability
- Hint text: `"← Posouvejte pro více →"`

**Lightbox:**
- Opens on tile click, closes on backdrop click or `Escape`
- Keyboard navigation: `←`/`→` cycle through filtered items
- Body scroll locked while open
- All images preloaded on first open (no next/prev load gap)
- Entrance animation runs **only on first mount** (not on image change) — avoids flicker
- Close button (top right), prev/next buttons, counter `"N / total"`, category label

**Assets:**
- Events: `public/gallery/events/1.jpeg` … `23.jpeg` (23 photos)
- Weddings: `public/gallery/weddings/1.jpeg` … `9.jpeg` + `IMG_4779.jpeg` (10 photos)

**Files:** `web/src/features/landing/components/Gallery.tsx`, `web/src/features/landing/data/gallery.ts`

---

### 4. Profile — O mně

**Goal:** Build trust through a human face and credentials.

Layout: Two-column on desktop (photo left, bio right); stacked on mobile.

| Element | Detail |
|---|---|
| Photo | `320×320px` circular crop, `src="/profile.png"`, `.breathe` idle animation |
| Photo ring | SVG `<circle>` with `stroke-dashoffset` draw-in animation (gold, 2px) |
| Name | `"Adam Kastner"` (large Playfair Display, `3xl–4xl`) |
| Tagline | `"Marketing & Event Manager"` (gold, uppercase, tracked) |
| Bio | Two paragraphs. P1: 11 years of marketing & event management experience, range of events (weddings, hen parties, teambuildings, corporate). No employer named. P2: belief that great events feel effortless — achieved only when every detail is planned three steps ahead. |
| Stats | 2 items in a `grid-cols-2` below a separator: (1) count-up `11 / Let zkušeností`; (2) static text `Praha & Středočeský kraj / Oblast působení` |

Section heading: eyebrow *"Seznamte se"*, title *"Váš člověk za kulisami"*.

**Animations (GSAP timeline, ScrollTrigger `start: "top 75%"`):**
1. Photo: scale `0.92 → 1` + fade (900ms)
2. SVG ring: `strokeDashoffset: 1000 → 0` (1400ms, concurrent with photo)
3. Bio paragraphs + tagline: stagger fade + rise (700ms, 80ms stagger, offset −600ms)
4. Stats: stagger fade + rise (600ms, 100ms stagger)
5. "Let zkušeností" number counts up from `0` to `11` via `useCountUp` hook (IntersectionObserver trigger); location stat is static text

**Files:** `web/src/features/landing/components/Profile.tsx`, `web/src/features/landing/hooks/useCountUp.ts`

---

### 5. Inquiry Form — Poptávka

**Goal:** Capture qualified leads directly from the page.

Section heading: *"Začněme plánovat / Poptávka"*, max-w `920px` centered.

**Fields:**

| Field | Label (Czech) | Type | Required |
|---|---|---|---|
| name | Jméno a příjmení | Text | ✓ |
| email | E-mail | Email | ✓ |
| phone | Telefon | Tel | ✓ |
| company | Firma | Text | — (optional) |
| city | Město / lokalita | Select: Praha / Středočeský kraj | ✓ |
| eventType | Typ akce | Select: Firemní / Svatba / Soukromý večírek / Jiné | ✓ |
| guestCount | Přibližný počet hostů | Select: 1–20 / 20–50 / 50–100 / 100–200 / 200+ | ✓ |
| eventDateFrom | Datum od | Date | ✓ |
| eventDateTo | Datum do | Date | ✓ |
| catering | Chci zajistit catering | Select: Ano / Ne | ✓ |
| hasVenue | Už mám prostor? | Select: Ano / Ne, chci nějaký najít | ✓ |
| budget | Odhadovaný rozpočet | Select: Do 50 000 Kč / 50 000–100 000 Kč / Nad 100 000 Kč / Zatím nevím | ✓ |
| message | Vize / zpráva | Textarea | — (optional) |
| honeypot | _(hidden)_ | Text `display:none` | — |

**Validation:**
- All required fields validated on submit
- Invalid fields get red border + shake animation (`translateX` 4px oscillation, 300ms)
- Inline error messages below each invalid field
- Field labels show red `*` asterisk for required fields

**Submit flow:**
1. Button morphs into spinner (width animates to circle)
2. 1.2s simulated delay (real integration would POST here)
3. Success state: form fades out, SVG checkmark draws in, "Děkuji — brzy se vám ozvu." fades up

**File:** `web/src/features/landing/components/InquiryForm.tsx`

---

### 6. Footer — Kontakt

Three-column grid on desktop, stacked on mobile.

| Column | Content |
|---|---|
| Brand | Adys Social logo + tagline |
| Contact | `info@adyssocial.cz` · `+420 736 450 502` · Praha, ČR |
| Social | Instagram icon → `https://www.instagram.com/adyssocial/` |

Section heading: *"Pojďme si promluvit / Plánujete akci?"*  
Copyright: `© 2026 Adam Kastner Events. Všechna práva vyhrazena.`

**File:** `web/src/features/landing/components/Footer.tsx`

---

## Global Animation System

### Libraries

| Library | Purpose |
|---|---|
| **GSAP** (core) | Timeline orchestration, easing, transforms |
| **ScrollTrigger** | Scroll-linked reveals, section entry triggers |
| **Lenis** | Smooth scroll engine, connected to GSAP ticker |

### Reusable Hooks

| Hook | Behavior |
|---|---|
| `useReveal` | Attaches ScrollTrigger to a container; stagger-reveals `[data-card]` or custom selector children |
| `useCountUp` | Animates a number from 0 → target via IntersectionObserver; returns a `ref` for a `<span>` |
| `useActiveSection` | Tracks which `<section id>` is currently in viewport; returns active ID string |
| `useLenis` | Initializes Lenis, syncs to GSAP ticker + ScrollTrigger; exports `scrollToSection` |

### Core Patterns

| Pattern | Where used | Behavior |
|---|---|---|
| **Fade + rise** | All section reveals | `opacity: 0, y: 24–40px` → `opacity: 1, y: 0`, `--ease-out-expo` |
| **Stagger** | Cards, form fields, stats, bio children | 80–100ms between siblings |
| **Word-mask reveal** | Hero headline | Each word in `overflow:hidden` span, slides up |
| **SVG draw-in** | Profile ring, success checkmark | `strokeDashoffset` animation |
| **Count-up** | Profile stats | IntersectionObserver → frame-by-frame interpolation |
| **Shimmer** | Primary CTA button | Pseudo-element gradient sweeps left → right (600ms) |
| **Breathe** | Profile photo | Infinite `scale(1) ↔ scale(1.015)`, 4s ease-in-out |
| **Scroll cue** | Hero bottom | Infinite translateY bounce |

### Reduced Motion

When `prefers-reduced-motion: reduce`:
- All entrance animations resolve instantly (opacity 1, transform none)
- Hover scales/lifts disabled
- Count-up shows final value immediately
- Idle loops (breathe, scroll cue) paused
- Lenis bypassed; native scroll used

---

## Responsive Breakpoints

| Breakpoint | Changes |
|---|---|
| `< 640px` (mobile) | Single column, hamburger nav, stacked hero, gallery strip shorter |
| `640–1024px` (tablet) | 2-column services grid, side-by-side profile |
| `> 1024px` (desktop) | Full layout as described above |

---

## Assets

| Asset | Path |
|---|---|
| Logo | `public/logo.jpeg` (Adys Social — 1254×1254 gold monogram; used in Header nav avatar, Hero right column, and Footer) |
| Profile photo | `public/profile.png` (used in Hero right column and Profile section) |
| Favicon | `public/favicon-ring.svg` — `favicon.png` embedded as base64 with gold `#C9A84C` circle stroke ring; referenced as `<link rel="icon" type="image/svg+xml">` |
| Gallery — events | `public/gallery/events/1.jpeg` … `23.jpeg` (23 files, optimized ≤450 KB each) |
| Gallery — weddings | `public/gallery/weddings/1.jpeg` … `9.jpeg`, `IMG_4779.jpeg` (10 files, optimized) |
| Source originals | `docs/Photos-Events/`, `docs/Photos-Wedding/` (untouched) |

### Image Optimisation

Gallery images are downscaled at build time via `web/scripts/optimize-images.mjs` (Sharp):
- Max long edge: **1600px**
- Format: JPEG, mozjpeg, quality **78**, progressive
- Runs automatically as `prebuild`; also available as `npm run optimize-images`
- Only overwrites if the output is smaller than the original
- Original sources in `docs/` are never touched

---

## Accessibility & Performance

- Semantic HTML5: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- All images: descriptive `alt` text in Czech
- Form fields: associated `<label>` elements, `aria-describedby` for errors
- Lightbox: `role="dialog" aria-modal="true"`, keyboard navigable, body scroll locked
- Color contrast: WCAG AA at large text; gold on dark passes for headings
- Profile photo preloaded: `<link rel="preload" as="image" href="/profile.png" />`
- Gallery images: `loading="lazy" decoding="async"`
- Fonts: Google Fonts with `font-display: swap`
- Animate only `opacity` and `transform` — no layout-triggering properties

---

## Out of Scope

- CMS or admin panel
- Blog / articles
- Payment processing
- Client portal or login
- Multi-language support
- Backend form handling (form submission is currently simulated client-side)
