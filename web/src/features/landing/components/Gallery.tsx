import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { SectionHeading } from './SectionHeading'
import {
  allGalleryItems,
  events,
  weddings,
  type GalleryCategory,
  type GalleryItem,
} from '../data/gallery'

type Filter = 'all' | GalleryCategory

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Vše' },
  { id: 'events', label: 'Akce' },
  { id: 'weddings', label: 'Svatby' },
]

export function Gallery() {
  const [filter, setFilter] = useState<Filter>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const items = useMemo<GalleryItem[]>(() => {
    if (filter === 'events') return events
    if (filter === 'weddings') return weddings
    return allGalleryItems
  }, [filter])

  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
  }, [filter])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight')
        setLightboxIndex((i) => (i === null ? null : (i + 1) % items.length))
      if (e.key === 'ArrowLeft')
        setLightboxIndex((i) =>
          i === null ? null : (i - 1 + items.length) % items.length,
        )
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, items.length])

  const scrollBy = (dir: 1 | -1) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    scroller.scrollBy({ left: scroller.clientWidth * 0.8 * dir, behavior: 'smooth' })
  }

  return (
    <section
      id="gallery"
      className="relative bg-[var(--color-bg)] py-24"
      style={{ contain: 'layout paint' }}
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <SectionHeading
          eyebrow="Reference"
          title="Vybrané akce"
          subtitle="Pohled zpět na akce, které jsem realizoval — od intimních svateb po velké firemní galavečery."
          align="center"
        />

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={[
                'rounded-full border px-5 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300',
                filter === f.id
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-bg)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          data-lenis-prevent
          className="scrollbar-hide flex gap-4 overflow-x-auto px-6 pb-2 sm:px-10 lg:px-16"
          style={{
            touchAction: 'pan-x',
            overscrollBehaviorX: 'contain',
            transform: 'translateZ(0)',
            willChange: 'transform',
            contain: 'layout paint',
          }}
        >
          {items.map((item, idx) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              className="group relative h-[300px] flex-none overflow-hidden rounded-sm bg-[var(--color-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] sm:h-[340px]"
              style={{
                contentVisibility: 'auto',
                containIntrinsicSize: '500px 340px',
                contain: 'layout paint',
              }}
              aria-label={`Otevřít fotografii ${idx + 1}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="block h-full w-auto select-none object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-text)]">
                  {item.category === 'weddings' ? 'Svatba' : 'Akce'}
                </span>
              </div>
            </button>
          ))}
          <div className="w-2 flex-none" aria-hidden />
        </div>

        <button
          type="button"
          aria-label="Předchozí"
          onClick={() => scrollBy(-1)}
          className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-[rgba(13,13,13,0.7)] text-[var(--color-text)] backdrop-blur-md transition-colors duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:flex"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Další"
          onClick={() => scrollBy(1)}
          className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-[rgba(13,13,13,0.7)] text-[var(--color-text)] backdrop-blur-md transition-colors duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:flex"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[var(--color-bg)] to-transparent sm:w-16"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[var(--color-bg)] to-transparent sm:w-16"
        />
      </div>

      <p className="mx-auto mt-6 max-w-[1280px] px-6 text-center text-[10px] uppercase tracking-[0.32em] text-[var(--color-text-dim)]">
        ← Posouvejte pro více →
      </p>

      {lightboxIndex !== null && (
        <Lightbox
          item={items[lightboxIndex]}
          allItems={items}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((i) => (i === null ? null : (i + 1) % items.length))}
          onPrev={() =>
            setLightboxIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length))
          }
          counter={`${lightboxIndex + 1} / ${items.length}`}
        />
      )}
    </section>
  )
}

interface LightboxProps {
  item: GalleryItem
  allItems: GalleryItem[]
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  counter: string
}

function Lightbox({ item, allItems, onClose, onNext, onPrev, counter }: LightboxProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)

  // Animate only on first mount — not when navigating between images.
  useEffect(() => {
    // Preload every image so prev/next has no load gap.
    allItems.forEach((it) => {
      const img = new Image()
      img.src = it.src
    })

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    if (backdropRef.current) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
    }
    if (imgWrapRef.current) {
      gsap.fromTo(
        imgWrapRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'expo.out' },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label="Náhled fotografie"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.92)] backdrop-blur-md"
    >
      <button
        type="button"
        aria-label="Zavřít náhled"
        onClick={onClose}
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-colors duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 6l12 12M6 18L18 6" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Předchozí fotografie"
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-[rgba(13,13,13,0.6)] text-[var(--color-text)] transition-colors duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] sm:left-6"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Další fotografie"
        onClick={(e) => { e.stopPropagation(); onNext() }}
        className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-[rgba(13,13,13,0.6)] text-[var(--color-text)] transition-colors duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] sm:right-6"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div ref={imgWrapRef} onClick={(e) => e.stopPropagation()} className="relative max-h-[85vh] max-w-[92vw]">
        <img src={item.src} alt={item.alt} className="block max-h-[85vh] max-w-[92vw] object-contain" />
        <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          <span>{item.category === 'weddings' ? 'Svatba' : 'Akce'}</span>
          <span>{counter}</span>
        </div>
      </div>
    </div>
  )
}
