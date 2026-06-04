import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCountUp } from '../hooks/useCountUp'
import { SectionHeading } from './SectionHeading'

const STATS = [
  { value: 11, suffix: '', label: 'Let zkušeností' },
]

export function Profile() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const yearsRef = useCountUp(STATS[0].value)
  const refs = [yearsRef]

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      el.querySelectorAll<HTMLElement>('[data-anim]').forEach((n) => {
        n.style.opacity = '1'
        n.style.transform = 'none'
      })
      el.querySelectorAll<SVGCircleElement>('[data-ring]').forEach((c) => {
        c.style.strokeDashoffset = '0'
      })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 75%', once: true },
        defaults: { ease: 'expo.out' },
      })

      tl.fromTo(
        '[data-anim="photo"]',
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.9 },
      )
        .fromTo('[data-ring]', { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.4 }, '<')
        .fromTo(
          '[data-anim="bio"] > *',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
          '-=0.6',
        )
        .fromTo(
          '[data-anim="stat"]',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          '-=0.4',
        )
    }, el)

    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [])

  return (
    <section id="profile" className="relative bg-[var(--color-surface)] py-24" ref={sectionRef}>
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionHeading eyebrow="Seznamte se" title="Váš člověk za kulisami" />

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[auto_1fr]">
          <div data-anim="photo" className="relative mx-auto opacity-0">
            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 320 320"
              aria-hidden
            >
              <circle
                data-ring
                cx="160"
                cy="160"
                r="158"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeDasharray="1000"
                strokeDashoffset="1000"
              />
            </svg>
            <div className="breathe overflow-hidden rounded-full" style={{ width: 320, height: 320 }}>
              <img
                src="/profile.png"
                alt="Portrét Adama Kastnera"
                className="h-full w-full object-cover"
                width={320}
                height={320}
              />
            </div>
          </div>

          <div data-anim="bio" className="max-w-2xl">
            <p className="mb-2 font-display text-3xl font-semibold sm:text-4xl">Adam Kastner</p>
            <p className="mb-6 text-sm uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Marketing & Event Manager
            </p>
            <p className="text-base leading-relaxed text-[var(--color-text-muted)]">
              S více než 11 lety praxe v oblasti marketingu a event managementu
              jsem získal rozsáhlé zkušenosti s organizací a realizací
              nejrůznějších typů akcí — od svateb a rozluček se svobodou přes
              teambuildingy až po firemní a společenské události.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)]">
              Věřím, že skvělé akce působí na hosty jako samozřejmost a na
              hostitele bez námahy — a že toho lze dosáhnout jen tehdy, když
              je každý detail promyšlený o tři kroky dopředu.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[var(--color-border)] pt-8">
              <div data-anim="stat" className="opacity-0">
                <p className="font-display text-4xl font-semibold text-[var(--color-accent)]">
                  <span ref={refs[0]}>0</span>
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Let zkušeností
                </p>
              </div>
              <div data-anim="stat" className="opacity-0">
                <p className="font-display text-2xl font-semibold text-[var(--color-accent)] leading-tight">
                  Praha &<br />Středočeský kraj
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Oblast působení
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
