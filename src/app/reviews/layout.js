export const metadata = {
  title: 'Gallery — Travel Photos & Customer Moments',
  description: 'Browse 54+ photos from Flyajwa traveler journeys and adventures. Real moments from Maldives, Thailand, Dubai, Azerbaijan & more destinations.',
  alternates: { canonical: 'https://www.flyajwa.com/gallery' },
  openGraph: {
    title: 'Travel Gallery — Flyajwa Customer Moments',
    description: 'See real photos from our travelers. 54+ photos from destinations around the world.',
    url: 'https://www.flyajwa.com/gallery',
    images: [{ url: '/assets/img/Ajwa/maldives-ajwa.webp', width: 1200, height: 630, alt: 'Flyajwa Travel Gallery' }],
  },
};

export default function GalleryLayout({ children }) {
  return children;
}
