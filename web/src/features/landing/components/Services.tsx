import { useReveal } from '../hooks/useReveal'
import { services } from '../data/services'
import { ServiceIcon } from './ServiceIcon'
import { SectionHeading } from './SectionHeading'

export function Services() {
  const gridRef = useReveal<HTMLDivElement>({ selector: '[data-card]', stagger: 0.09 })

  return (
    <section id="services" className="relative py-24">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionHeading
          eyebrow="Co nabízím"
          title="Služby"
          subtitle="Od první vize až po závěrečný přípitek — každou akci tvořím se stejnou pečlivostí v každém detailu."
        />

        <div ref={gridRef} className="grid grid-cols-1 gap-px bg-[var(--color-border)] sm:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.title}
              data-card
              className="group relative cursor-default bg-[var(--color-bg)] p-8 transition-colors duration-500 hover:bg-[var(--color-surface)]"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-accent)] transition-all duration-500 group-hover:rotate-[-6deg] group-hover:scale-110 group-hover:border-[var(--color-accent)]">
                <ServiceIcon name={service.icon} />
              </div>
              <h3 className="mb-3 font-display text-2xl font-semibold">{service.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
