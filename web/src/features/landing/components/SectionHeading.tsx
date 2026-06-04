import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Props {
  eyebrow?: string
  title?: string
  subtitle?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'left' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      el.querySelectorAll<HTMLElement>('[data-anim]').forEach((n) => {
        n.style.opacity = '1'
        n.style.transform = 'none'
      })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        defaults: { ease: 'expo.out' },
      })
      tl.fromTo(
        '[data-anim="eyebrow"]',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6 },
      )
        .fromTo(
          '[data-anim="title"]',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.35',
        )
        .fromTo(
          '[data-anim="rule"]',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8 },
          '-=0.3',
        )
        .fromTo(
          '[data-anim="subtitle"]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4',
        )
    }, el)

    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [])

  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <div ref={ref} className={`mb-16 flex flex-col ${alignClass}`}>
      {eyebrow && (
        <p
          data-anim="eyebrow"
          className="mb-4 text-xs font-medium uppercase tracking-[0.32em] text-[var(--color-accent)] opacity-0"
        >
          {eyebrow}
        </p>
      )}
      {title && (
        <h2
          data-anim="title"
          className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-tight opacity-0"
        >
          {title}
        </h2>
      )}
      <div
        data-anim="rule"
        className="mt-5 h-px w-20 origin-left bg-[var(--color-accent)]"
        style={{ transform: 'scaleX(0)' }}
      />
      {subtitle && (
        <p
          data-anim="subtitle"
          className={`mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)] opacity-0`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
