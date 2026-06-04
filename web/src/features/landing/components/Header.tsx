import { useEffect, useState } from 'react'
import { scrollToSection } from '../hooks/useLenis'
import { useActiveSection } from '../hooks/useActiveSection'

const NAV_LINKS = [
  { id: 'about', label: 'Úvod' },
  { id: 'services', label: 'Služby' },
  { id: 'gallery', label: 'Reference' },
  { id: 'profile', label: 'O mně' },
  { id: 'inquire', label: 'Poptávka' },
  { id: 'contact', label: 'Kontakt' },
]

const SECTION_IDS = NAV_LINKS.map((l) => l.id)

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setMenuOpen(false)
    scrollToSection(id)
  }

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[rgba(13,13,13,0.92)] backdrop-blur-md border-b border-[var(--color-border)]'
          : 'bg-transparent',
      ].join(' ')}
      style={{ height: scrolled ? 64 : 84 }}
    >
      <div className="mx-auto flex h-full max-w-[1180px] items-center justify-between px-6">
        <a
          href="#about"
          onClick={handleClick('about')}
          className="shrink-0"
        >
          <img
            src="/logo.jpeg"
            alt="Adys Social"
            className="h-14 w-14 rounded-full object-cover ring-1 ring-[var(--color-accent)]"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={handleClick(link.id)}
              data-active={active === link.id}
              className="gold-underline text-sm font-medium uppercase tracking-[0.14em] text-[var(--color-text)] hover:text-[var(--color-accent)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#inquire"
          onClick={handleClick('inquire')}
          className="hidden rounded-sm border border-[var(--color-accent)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)] transition-all duration-300 hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] md:inline-block"
        >
          Poptat akci
        </a>

        <button
          type="button"
          aria-label={menuOpen ? 'Zavřít menu' : 'Otevřít menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="relative h-10 w-10 md:hidden"
        >
          <span
            className={[
              'absolute left-2 right-2 h-px bg-[var(--color-text)] transition-all duration-300',
              menuOpen ? 'top-1/2 rotate-45' : 'top-3',
            ].join(' ')}
          />
          <span
            className={[
              'absolute left-2 right-2 top-1/2 h-px bg-[var(--color-text)] transition-opacity duration-200',
              menuOpen ? 'opacity-0' : 'opacity-100',
            ].join(' ')}
          />
          <span
            className={[
              'absolute left-2 right-2 h-px bg-[var(--color-text)] transition-all duration-300',
              menuOpen ? 'top-1/2 -rotate-45' : 'bottom-3',
            ].join(' ')}
          />
        </button>
      </div>

      <div
        className={[
          'overflow-hidden border-t border-[var(--color-border)] bg-[rgba(13,13,13,0.98)] backdrop-blur-md transition-[max-height] duration-400 md:hidden',
          menuOpen ? 'max-h-96' : 'max-h-0',
        ].join(' ')}
      >
        <nav className="flex flex-col px-6 py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={handleClick(link.id)}
              className="border-b border-[var(--color-border)] py-3 text-sm uppercase tracking-[0.14em] last:border-b-0"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
