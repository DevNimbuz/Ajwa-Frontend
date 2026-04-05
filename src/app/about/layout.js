export const metadata = {
  title: 'About Us — Fly Ajwa Travels & Holidays',
  description: 'Learn about Fly Ajwa Travels & Holidays — Kerala\'s trusted travel agency with 9 offices across India, UAE, Maldives & KSA. 100+ happy customers, 20+ destinations, 50+ tour packages.',
  alternates: { canonical: 'https://www.flyajwa.com/about' },
  openGraph: {
    title: 'About FlyAjwa — Kerala\'s Trusted Travel Partner',
    description: 'Discover the story of Fly Ajwa Travels. From Edappal to the world — 9 offices, 100+ happy travelers, 20+ destinations.',
    url: 'https://www.flyajwa.com/about',
    images: [{ url: '/assets/img/Ajwa/banner.jpg', width: 1200, height: 630, alt: 'About FlyAjwa Travels' }],
  },
};

export default function AboutLayout({ children }) {
  return children;
}
