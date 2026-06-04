import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { scrollToSection } from '../hooks/useLenis'

const HEADLINE_WORDS = ['Vytvářím', 'okamžiky,', 'které', 'trvají', 'věčně']

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.fromTo(
        '[data-hero-bg]',
        { opacity: 0 },
        { opacity: 1, duration: 1.4 },
        0,
      )
        .fromTo(
          '[data-hero-eyebrow]',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          0.2,
        )
        .to(
          '[data-headline-word] > span',
          { y: '0%', duration: 0.9, stagger: 0.06 },
          0.4,
        )
        .fromTo(
          '[data-hero-body]',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          1.0,
        )
        .fromTo(
          '[data-hero-cta]',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          1.2,
        )
        .fromTo(
          '[data-scroll-cue]',
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          1.6,
        )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="about"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-32 pb-24"
    >
      <div
        data-hero-bg
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 80% 30%, rgba(201,168,76,0.18), transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(201,168,76,0.08), transparent 60%), linear-gradient(180deg, #0a0a0a 0%, #0d0d0d 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-12 px-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p
            data-hero-eyebrow
            className="mb-6 text-xs font-medium uppercase tracking-[0.32em] text-[var(--color-accent)] opacity-0"
          >
            Adam Kastner · Eventový manažer & producent
          </p>

          <h1 className="font-display text-[clamp(2.08rem,5.6vw,4.4rem)] font-semibold leading-[1.05] tracking-tight">
            {HEADLINE_WORDS.map((word, i) => (
              <span key={i} data-headline-word className="word-mask mr-[0.25em]">
                <span>{word}</span>
              </span>
            ))}
          </h1>

          <p
            data-hero-body
            className="mt-8 max-w-xl text-base leading-relaxed text-[var(--color-text-muted)] opacity-0 sm:text-lg"
          >
            Mým cílem je vytvořit jedinečný zážitek a zajistit, aby si hosté
            odnesli nezapomenutelné vzpomínky.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              data-hero-cta
              type="button"
              onClick={() => scrollToSection('inquire')}
              className="shimmer-btn rounded-sm bg-[var(--color-accent)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-bg)] opacity-0 transition-transform duration-300 hover:-translate-y-0.5"
            >
              Naplánovat akci
            </button>
            <button
              data-hero-cta
              type="button"
              onClick={() => scrollToSection('services')}
              className="rounded-sm border border-[var(--color-border)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-text)] opacity-0 transition-all duration-300 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Moje služby
            </button>
          </div>
        </div>

        <div className="relative hidden lg:flex items-center justify-center">
          <img
            src="/logo.jpeg"
            alt="Adys Social"
            className="w-[317px] xl:w-[352px] object-cover"
            loading="eager"
            style={{
              maskImage: 'radial-gradient(ellipse 72% 72% at 50% 50%, black 45%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse 72% 72% at 50% 50%, black 45%, transparent 75%)',
            }}
          />
        </div>
      </div>

      <button
        data-scroll-cue
        type="button"
        onClick={() => scrollToSection('services')}
        aria-label="Přejít na služby"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0"
      >
        <span className="scroll-cue block text-[var(--color-text-muted)]">
          <svg width="22" height="38" viewBox="0 0 22 38" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="1" y="1" width="20" height="36" rx="10" />
            <circle cx="11" cy="11" r="2" fill="currentColor" stroke="none" />
          </svg>
        </span>
      </button>
    </section>
  )
}
