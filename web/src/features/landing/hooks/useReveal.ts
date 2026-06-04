import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface RevealOptions {
  selector?: string
  y?: number
  stagger?: number
  duration?: number
  delay?: number
  start?: string
  once?: boolean
}

export function useReveal<T extends HTMLElement = HTMLElement>(
  options: RevealOptions = {},
) {
  const ref = useRef<T>(null)
  const {
    selector = '[data-reveal]',
    y = 30,
    stagger = 0.08,
    duration = 0.7,
    delay = 0,
    start = 'top 80%',
    once = true,
  } = options

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = root.querySelectorAll<HTMLElement>(selector)
    if (targets.length === 0) return

    if (prefersReducedMotion) {
      targets.forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return
    }

    gsap.set(targets, { opacity: 0, y })

    const trigger = ScrollTrigger.create({
      trigger: root,
      start,
      once,
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          delay,
          ease: 'expo.out',
        })
      },
    })

    return () => {
      trigger.kill()
    }
  }, [selector, y, stagger, duration, delay, start, once])

  return ref
}
