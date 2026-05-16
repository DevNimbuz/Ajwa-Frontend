export const metadata = {
  title: 'About Us — Flyajwa Travels & Holidays',
  description: 'Learn about Flyajwa Travels & Holidays — Kerala\'s trusted travel agency with 9 offices across India, UAE, Maldives & KSA. 5000+ happy customers, 20+ destinations, 50+ tour packages.',
  alternates: { canonical: 'https://www.flyajwa.com/about' },
  openGraph: {
    title: 'About Flyajwa — Kerala\'s Trusted Travel Partner',
    description: 'Discover the story of Flyajwa Travels. From Edappal to the world — 9 offices, 5000+ happy travelers, 20+ destinations.',
    url: 'https://www.flyajwa.com/about',
    images: [{ url: '/assets/img/Ajwa/banner.jpg', width: 1200, height: 630, alt: 'About Flyajwa Travels' }],
  },
};

export default function AboutLayout({ children }) {
  return children;
}
