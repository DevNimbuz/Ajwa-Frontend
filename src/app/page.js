import dynamic from 'next/dynamic';
import { 
  Shield, HeartHandshake, Clock, MapPin, Star
} from 'lucide-react';
import HomeClient from '@/components/home/HomeClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import JsonLd from '@/components/common/JsonLd';
import testimonials from '@/data/testimonials';

/* ── Static Data ── */
const heroSlides = [
  {
    bg: '/assets/img/Ajwa/maldives-ajwa.webp',
    tag: 'Maldives',
    title: "Let's Travel And Explore Destination.",
    desc: 'Life is unpredictable, and we understand that plans might change. Enjoy flexible booking options, so you can reschedule or modify your trip with ease.',
  },
  {
    bg: '/assets/img/Ajwa/Thailand-ajwa2.webp',
    tag: 'Thailand',
    title: "Let's Explore Your Holiday Trip.",
    desc: 'Life is unpredictable, and we understand that plans might change. Enjoy flexible booking options, so you can reschedule or modify your trip with ease.',
  },
  {
    bg: '/assets/img/Ajwa/Azerbaijan-ajwa2.webp',
    tag: 'Azerbaijan',
    title: "Let's journey and discover a place.",
    desc: 'Life is unpredictable, and we understand that plans might change. Enjoy flexible booking options, so you can reschedule or modify your trip with ease.',
  },
  {
    bg: '/assets/img/Ajwa/trek.webp',
    tag: 'Kashmir',
    title: "Let's trek and venture to a spot.",
    desc: 'Life is unpredictable, and we understand that plans might change. Enjoy flexible booking options, so you can reschedule or modify your trip with ease.',
  },
];

const destinations = [
  { name: 'Azerbaijan', img: '/assets/img/Ajwa/azerbaijan3-ajwa.webp', href: '/package/azerbaijan-package', tagline: 'Land of Fire' },
  { name: 'Maldives', img: '/assets/img/Ajwa/maldives-ajwa.webp', href: '/package/maldives-package', tagline: 'Paradise on Earth' },
  { name: 'Thailand', img: '/assets/img/Ajwa/Thailand/thailand-ajwa.webp', href: '/package/thailand-package', tagline: 'Land of Smiles' },
  { name: 'Malaysia', img: '/assets/img/Ajwa/Malaysia-ajwaCard.webp', href: '/package/malaysia-package', tagline: 'Truly Asia' },
  { name: 'Kashmir', img: '/assets/img/Ajwa/Kashmir/kashmir-ajwa.webp', href: '/package/kashmir-package', tagline: 'Heaven on Earth' },
  { name: 'Dubai', img: '/assets/img/Ajwa/Uae-ajwaVisa.jpg', href: '/package/dubai-package', tagline: 'City of Gold' },
];

const facilities = [
  { icon: <Shield size={28} />, title: 'Safe Travels', desc: 'Your safety is our top priority with certified travel protocols and 24/7 support.'},
  { icon: <HeartHandshake size={28} />, title: 'Personalized Service', desc: 'Every trip is tailored to your preferences, budget, and dream destinations.'},
  { icon: <Clock size={28} />, title: 'Flexible Booking', desc: 'Plans change — enjoy easy rescheduling and modification options on all packages.'},
];

const activities = [
  { title: 'Paragliding', img: '/assets/img/Ajwa/paragliding-02.jpg' },
  { title: 'Surfing', img: '/assets/img/Ajwa/surfing-02.jpg' },
  { title: 'Rafting', img: '/assets/img/Ajwa/rafting-02.jpg' },
  { title: 'Ski Touring', img: '/assets/img/Ajwa/ski-touring-02.jpg' },
  { title: 'Bungee Jump', img: '/assets/img/Ajwa/bungee-jump-02.jpg' },
  { title: 'Zip Lining', img: '/assets/img/Ajwa/zip-landing-02.jpg' },
];

const visaServices = [
  { country: 'SAUDI ARABIA', type: 'E-Visa - Only Processing', price: '₹5,978', img: '/assets/img/Ajwa/Saudi-ajwaVisa.jpg' },
  { country: 'UAE', type: 'E-Visa - Only Processing', price: '₹5,999', img: '/assets/img/Ajwa/Uae-ajwaVisa.jpg' },
  { country: 'MALAYSIA', type: 'E-Visa - Only Processing', price: '₹5,999', img: '/assets/img/Ajwa/Malaysia-ajwaVisa.jpg' },
];

export default async function HomePage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  // Parallel fetch for speed
  const [packagesRes, testimonialsRes] = await Promise.all([
    fetch(`${apiUrl}/packages?limit=12`, { next: { revalidate: 60 } }).catch(() => null),
    fetch(`${apiUrl}/testimonials/public?limit=10`, { next: { revalidate: 60 } }).catch(() => null)
  ]);

  const rawPackages = packagesRes ? await packagesRes.json().catch(() => null) : null;
  const rawTestimonials = testimonialsRes ? await testimonialsRes.json().catch(() => null) : null;

  // Map API data to UI format
  const initialPackages = rawPackages?.success ? rawPackages.data.map(pkg => ({
    name: pkg.name,
    img: pkg.heroImg || '/assets/img/Ajwa/trek.webp',
    href: `/package/${pkg.slug}`,
    tagline: pkg.tagline || 'Experience the best!',
    startingPrice: pkg.startingPrice
  })) : null;

  const initialTestimonials = rawTestimonials?.success ? rawTestimonials.data : testimonials;

  return (
    <>
      <JsonLd 
        type="TravelAgency" 
        data={{
          "description": "Premium travel agency in Kerala providing curated holiday packages to Maldives, Thailand, Azerbaijan and more.",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Flyajwa Hub",
            "addressLocality": "Calicut",
            "addressRegion": "KL",
            "addressCountry": "IN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-9846617000",
            "contactType": "Customer Service"
          }
        }} 
      />
      <Header />
      
      <HomeClient 
        initialPackages={initialPackages} 
        initialTestimonials={initialTestimonials}
        heroSlides={heroSlides}
        destinations={destinations}
        facilities={facilities}
        activities={activities}
        visaServices={visaServices}
      />

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
