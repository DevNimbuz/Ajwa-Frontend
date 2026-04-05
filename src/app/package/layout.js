export const metadata = {
  title: 'Tour Packages — Affordable Holiday Packages from Kerala',
  description: 'Browse 50+ tour packages from FlyAjwa. Maldives from ₹24,499, Thailand from ₹22,999, Dubai from ₹25,999, Kashmir from ₹14,999 & more. Book your dream vacation today!',
  alternates: { canonical: 'https://www.flyajwa.com/package' },
  openGraph: {
    title: 'Tour Packages — FlyAjwa Travels & Holidays',
    description: 'Affordable international & domestic tour packages. Maldives, Thailand, Dubai, Bali, Kashmir, Goa & more.',
    url: 'https://www.flyajwa.com/package',
    images: [{ url: '/assets/img/Ajwa/trek.webp', width: 1200, height: 630, alt: 'FlyAjwa Tour Packages' }],
  },
};

export default function PackageLayout({ children }) {
  return children;
}
