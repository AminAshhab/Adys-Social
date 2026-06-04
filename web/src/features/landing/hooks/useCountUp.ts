import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useCountUp(target: number, duration = 1.4) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      el.textContent = String(target)
      return
    }

    const counter = { value: 0 }
    el.textContent = '0'

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          value: target,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = String(Math.round(counter.value))
          },
        })
      },
    })

    return () => {
      trigger.kill()
    }
  }, [target, duration])

  return ref
}
