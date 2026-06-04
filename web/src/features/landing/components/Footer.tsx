import { useReveal } from '../hooks/useReveal'

export function Footer() {
  const ref = useReveal<HTMLDivElement>({ selector: '[data-foot]', stagger: 0.08, start: 'top 90%' })

  return (
    <footer id="contact" className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <div ref={ref} className="mx-auto max-w-[1180px] px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div data-foot className="opacity-0">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.32em] text-[var(--color-accent)]">
              Pojďme si promluvit
            </p>
            <p className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Plánujete akci?
            </p>
            <p className="mt-3 max-w-sm text-sm text-[var(--color-text-muted)]">
              Pro nové rezervace, mediální dotazy a přednášky.
            </p>
          </div>

          <div data-foot className="opacity-0">
            <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
              Kontakt
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:info@adyssocial.cz"
                  className="gold-underline text-[var(--color-text)] hover:text-[var(--color-accent)]"
                >
                  info@adyssocial.cz
                </a>
              </li>
              <li>
                <a
                  href="tel:+420736450502"
                  className="gold-underline text-[var(--color-text)] hover:text-[var(--color-accent)]"
                >
                  +420 736 450 502
                </a>
              </li>
              <li className="text-[var(--color-text-muted)]">Praha, ČR</li>
            </ul>
          </div>

          <div data-foot className="opacity-0">
            <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[var(--color-text-dim)]">
              Sledujte
            </p>
            <div className="flex items-center gap-3">
              <SocialLink label="Instagram" href="https://www.instagram.com/adyssocial/">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="3.6" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                </svg>
              </SocialLink>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-[var(--color-border)] pt-8 text-xs text-[var(--color-text-dim)] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Adam Kastner Events. Všechna práva vyhrazena.</p>
          <p className="uppercase tracking-[0.18em]">Navrženo v Praze · Realizujeme kdekoliv</p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] transition-all duration-300 hover:scale-110 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
    >
      {children}
    </a>
  )
}
