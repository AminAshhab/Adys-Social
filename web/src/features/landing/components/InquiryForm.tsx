import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionHeading } from './SectionHeading'

type EventType = 'Rozlučky se svobodou' | 'Svatby a oslavy' | 'Soukromé večírky' | 'Teambuildingy' | 'Jiné'
type Budget = 'Do 50 000 Kč' | '50 000 – 100 000 Kč' | 'Nad 100 000 Kč' | 'Zatím nevím'
type City = 'Praha' | 'Středočeský kraj'
type Catering = 'Ano' | 'Ne'
type HasVenue = 'Ano' | 'Ne, chci nějaký najít'

interface FormState {
  name: string
  email: string
  phone: string
  company: string
  city: City | ''
  eventType: EventType | ''
  guestCount: string
  eventDateFrom: string
  eventDateTo: string
  catering: Catering | ''
  hasVenue: HasVenue | ''
  budget: Budget | ''
  message: string
  honeypot: string
}

const INITIAL: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  city: '',
  eventType: '',
  guestCount: '',
  eventDateFrom: '',
  eventDateTo: '',
  catering: '',
  hasVenue: '',
  budget: '',
  message: '',
  honeypot: '',
}

export function InquiryForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const formEl = useRef<HTMLFormElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      el.querySelectorAll<HTMLElement>('[data-field]').forEach((n) => {
        n.style.opacity = '1'
        n.style.transform = 'none'
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-field]',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.07,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 70%', once: true },
        },
      )
    }, el)
    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) next.name = 'Povinné pole'
    if (!form.email.trim()) next.email = 'Povinné pole'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Neplatný e-mail'
    if (!form.phone.trim()) next.phone = 'Povinné pole'
    if (!form.city) next.city = 'Povinné pole'
    if (!form.eventType) next.eventType = 'Povinné pole'
    if (!form.guestCount.trim()) next.guestCount = 'Povinné pole'
    if (!form.eventDateFrom) next.eventDateFrom = 'Povinné pole'
    if (!form.eventDateTo) next.eventDateTo = 'Povinné pole'
    if (!form.catering) next.catering = 'Povinné pole'
    if (!form.hasVenue) next.hasVenue = 'Povinné pole'
    if (!form.budget) next.budget = 'Povinné pole'
    setErrors(next)

    if (Object.keys(next).length > 0) {
      Object.keys(next).forEach((key) => {
        const field = formEl.current?.querySelector(`[data-field-name="${key}"]`)
        field?.classList.remove('shake')
        void (field as HTMLElement | null)?.offsetWidth
        field?.classList.add('shake')
      })
    }
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.honeypot) return
    if (!validate()) return
    setSubmitting(true)
    setSubmitError(false)
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          subject: `Poptávka: ${form.eventType} – ${form.name}`,
          from_name: form.name,
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company || '—',
          city: form.city,
          event_type: form.eventType,
          guest_count: form.guestCount,
          event_date_from: form.eventDateFrom.split('-').reverse().join('.'),
          event_date_to: form.eventDateTo.split('-').reverse().join('.'),
          catering: form.catering,
          has_venue: form.hasVenue,
          budget: form.budget,
          message: form.message || '—',
          botcheck: form.honeypot,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        setSubmitError(true)
      }
    } catch {
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section ref={sectionRef} id="inquire" className="relative py-24">
      <div className="mx-auto max-w-[920px] px-6">
        <SectionHeading
          eyebrow="Začněme plánovat"
          title="Povězte mi o své akci"
          subtitle="Sdělte mi několik detailů a ozvu se vám do 24 hodin."
          align="center"
        />

        <div className="relative">
          {submitted && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[var(--color-bg)]">
              <SuccessCheck />
              <p className="mt-6 font-display text-3xl">Děkuji — brzy se vám ozvu.</p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Odpověď můžete očekávat do 24 hodin.
              </p>
            </div>
          )}

          <form
            ref={formEl}
            onSubmit={onSubmit}
            noValidate
            className={[
              'grid grid-cols-1 gap-6 sm:grid-cols-2 transition-opacity duration-500',
              submitted ? 'pointer-events-none opacity-0' : 'opacity-100',
            ].join(' ')}
          >
            {/* honeypot */}
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              value={form.honeypot}
              onChange={(e) => update('honeypot', e.target.value)}
              className="hidden"
              aria-hidden
            />

            <Field label="Jméno a příjmení" required error={errors.name} fieldName="name">
              <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className={inputCls(!!errors.name)}
                autoComplete="name"
              />
            </Field>

            <Field label="E-mail" required error={errors.email} fieldName="email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className={inputCls(!!errors.email)}
                autoComplete="email"
              />
            </Field>

            <Field label="Telefon" required error={errors.phone} fieldName="phone">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className={inputCls(!!errors.phone)}
                autoComplete="tel"
              />
            </Field>

            <Field label="Firma (volitelné)" fieldName="company">
              <input
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
                className={inputCls(false)}
                autoComplete="organization"
              />
            </Field>

            <Field label="Město / Lokalita" required error={errors.city} fieldName="city">
              <select
                value={form.city}
                onChange={(e) => update('city', e.target.value as City)}
                className={selectCls(!!errors.city)}
              >
                <option value="">Vyberte…</option>
                <option>Praha</option>
                <option>Středočeský kraj</option>
              </select>
            </Field>

            <Field label="Typ akce" required error={errors.eventType} fieldName="eventType">
              <select
                value={form.eventType}
                onChange={(e) => update('eventType', e.target.value as EventType)}
                className={selectCls(!!errors.eventType)}
              >
                <option value="">Vyberte…</option>
                <option>Rozlučky se svobodou</option>
                <option>Svatby a oslavy</option>
                <option>Soukromé večírky</option>
                <option>Teambuildingy</option>
                <option>Jiné</option>
              </select>
            </Field>

            <Field label="Přibližný počet hostů" required error={errors.guestCount} fieldName="guestCount">
              <input
                type="number"
                min="0"
                value={form.guestCount}
                onChange={(e) => update('guestCount', e.target.value)}
                className={inputCls(!!errors.guestCount)}
              />
            </Field>

            <Field label="Chci zajistit catering" required error={errors.catering} fieldName="catering">
              <select
                value={form.catering}
                onChange={(e) => update('catering', e.target.value as Catering)}
                className={selectCls(!!errors.catering)}
              >
                <option value="">Vyberte…</option>
                <option>Ano</option>
                <option>Ne</option>
              </select>
            </Field>

            <Field label="Datum od" required error={errors.eventDateFrom} fieldName="eventDateFrom">
              <DateInput
                value={form.eventDateFrom}
                onChange={(v) => update('eventDateFrom', v)}
                hasError={!!errors.eventDateFrom}
              />
            </Field>

            <Field label="Datum do" required error={errors.eventDateTo} fieldName="eventDateTo">
              <DateInput
                value={form.eventDateTo}
                onChange={(v) => update('eventDateTo', v)}
                hasError={!!errors.eventDateTo}
              />
            </Field>

            <Field label="Už mám prostor?" required error={errors.hasVenue} fieldName="hasVenue" className="sm:col-span-2">
              <select
                value={form.hasVenue}
                onChange={(e) => update('hasVenue', e.target.value as HasVenue)}
                className={selectCls(!!errors.hasVenue)}
              >
                <option value="">Vyberte…</option>
                <option>Ano</option>
                <option>Ne, chci nějaký najít</option>
              </select>
            </Field>

            <Field label="Rozpočet" required error={errors.budget} fieldName="budget" className="sm:col-span-2">
              <select
                value={form.budget}
                onChange={(e) => update('budget', e.target.value as Budget)}
                className={selectCls(!!errors.budget)}
              >
                <option value="">Vyberte…</option>
                <option>Do 50 000 Kč</option>
                <option>50 000 – 100 000 Kč</option>
                <option>Nad 100 000 Kč</option>
                <option>Zatím nevím</option>
              </select>
            </Field>

            <Field
              label="Vize / zpráva (volitelné)"
              fieldName="message"
              className="sm:col-span-2"
            >
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                className={[inputCls(false), 'resize-y'].join(' ')}
              />
            </Field>

            <div data-field className="opacity-0 sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="shimmer-btn group relative w-full overflow-hidden rounded-sm bg-[var(--color-accent)] px-8 py-5 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-bg)] transition-all duration-300 hover:bg-[var(--color-accent-soft)] disabled:cursor-not-allowed"
              >
                <span
                  className={[
                    'transition-opacity duration-200',
                    submitting ? 'opacity-0' : 'opacity-100',
                  ].join(' ')}
                >
                  Odeslat poptávku
                </span>
                {submitting && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-bg)] border-t-transparent" />
                  </span>
                )}
              </button>
              {submitError && (
                <p className="mt-3 text-center text-sm text-[var(--color-danger)]" role="alert">
                  Odeslání se nezdařilo. Zkuste to prosím znovu nebo nás kontaktujte přímo.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

function inputCls(hasError: boolean) {
  return [
    'w-full border-b bg-transparent px-1 py-3 text-base text-[var(--color-text)] outline-none transition-colors duration-200 placeholder:text-[var(--color-text-dim)]',
    hasError
      ? 'border-[var(--color-danger)]'
      : 'border-[var(--color-border)] focus:border-[var(--color-accent)]',
  ].join(' ')
}

function selectCls(hasError: boolean) {
  return [
    inputCls(hasError),
    'appearance-none cursor-pointer pr-8 [background-image:linear-gradient(45deg,transparent_50%,var(--color-accent)_50%),linear-gradient(135deg,var(--color-accent)_50%,transparent_50%)] [background-position:calc(100%-12px)_55%,calc(100%-7px)_55%] [background-size:5px_5px] [background-repeat:no-repeat]',
  ].join(' ')
}

interface FieldProps {
  label: string
  required?: boolean
  error?: string
  fieldName: string
  className?: string
  children: React.ReactNode
}

function Field({ label, required, error, fieldName, className = '', children }: FieldProps) {
  return (
    <div data-field data-field-name={fieldName} className={`opacity-0 ${className}`}>
      <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
        {label}
        {required && <span className="ml-1 text-[var(--color-accent)]">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-[var(--color-danger)]" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function DateInput({ value, onChange, hasError }: { value: string; onChange: (v: string) => void; hasError: boolean }) {
  const display = value ? value.split('-').reverse().join('.') : ''

  return (
    <div className="relative">
      <div className={inputCls(hasError)}>
        <span className={display ? '' : 'text-[var(--color-text-dim)]'}>
          {display || 'DD.MM.RRRR'}
        </span>
      </div>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => { try { (e.target as HTMLInputElement).showPicker() } catch {} }}
        className="absolute inset-0 w-full cursor-pointer opacity-0"
      />
    </div>
  )
}

function SuccessCheck() {
  const ref = useRef<SVGPathElement>(null)
  useEffect(() => {
    const path = ref.current
    if (!path) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      path.style.strokeDashoffset = '0'
      return
    }
    const length = path.getTotalLength()
    path.style.strokeDasharray = String(length)
    path.style.strokeDashoffset = String(length)
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 0.7,
      delay: 0.3,
      ease: 'power2.inOut',
    })
  }, [])
  return (
    <div
      className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--color-accent)]"
      style={{ animation: 'breathe 4s ease-in-out infinite' }}
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path ref={ref} d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </div>
  )
}
