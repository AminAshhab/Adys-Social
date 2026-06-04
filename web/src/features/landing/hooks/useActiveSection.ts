import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState<string>(sectionIds[0] ?? '')

  useEffect(() => {
    const triggers = sectionIds.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 40%',
        end: 'bottom 40%',
        onToggle: (self) => {
          if (self.isActive) setActive(id)
        },
      })
    })

    return () => {
      triggers.forEach((t) => t?.kill())
    }
  }, [sectionIds])

  return active
}
