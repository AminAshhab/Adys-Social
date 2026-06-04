export type GalleryCategory = 'events' | 'weddings'

export interface GalleryItem {
  src: string
  category: GalleryCategory
  alt: string
}

const eventFiles = [
  '1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', '5.jpeg', '6.jpeg', '7.jpeg',
  '8.jpeg', '9.jpeg', '10.jpeg', '11.jpeg', '12.jpeg', '13.jpeg', '14.jpeg',
  '15.jpeg', '16.jpeg', '17.jpeg', '18.jpeg', '19.jpeg', '20.jpeg', '21.jpeg',
  '22.jpeg', '23.jpeg',
]

const weddingFiles = [
  '1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', '5.jpeg',
  '6.jpeg', '7.jpeg', '8.jpeg', '9.jpeg', 'IMG_4779.jpeg',
]

export const events: GalleryItem[] = eventFiles.map((f, i) => ({
  src: `/gallery/events/${f}`,
  category: 'events',
  alt: `Akce — fotografie ${i + 1}`,
}))

export const weddings: GalleryItem[] = weddingFiles.map((f, i) => ({
  src: `/gallery/weddings/${f}`,
  category: 'weddings',
  alt: `Svatba — fotografie ${i + 1}`,
}))

export const allGalleryItems: GalleryItem[] = [...events, ...weddings]
