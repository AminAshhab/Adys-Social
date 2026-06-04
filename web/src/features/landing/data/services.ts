export interface Service {
  title: string
  description: string
  icon: 'briefcase' | 'heart' | 'sparkles' | 'broadcast' | 'pin' | 'clipboard'
}

export const services: Service[] = [
  {
    title: 'Rozlučky se svobodou',
    description:
      'Mým cílem je vytvořit nezapomenutelné dny plných zážitků, zábavy a jedinečných momentů, na které budou všichni ještě dlouho rádi vzpomínat.',
    icon: 'sparkles',
  },
  {
    title: 'Svatby a oslavy',
    description:
      'Zajistím kompletní i částečné svatební plánování. Koordinuji dodavatele, řídím harmonogram a vedu akci na místě.',
    icon: 'heart',
  },
  {
    title: 'Soukromé večírky',
    description:
      'Připravím významná výročí, narozeniny i exkluzivní večeře s doprovodným programem a dekoracemi na míru.',
    icon: 'pin',
  },
  {
    title: 'Teambuildingy',
    description:
      'Kompletně koordinuji vše od hledání prostor až po samostatnou realizaci, dle vašich požadavků.',
    icon: 'briefcase',
  },
]
