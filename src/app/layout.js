import './globals.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Script from 'next/script';
import { Suspense } from 'react';
import VisitorTracker from '@/components/VisitorTracker';
import BackToTop from '@/components/BackToTop';
import CookieBanner from '@/components/CookieBanner';


export const metadata = {
  title: {
    default: 'Flyajwa — Travels & Holidays | Best Travel Agency in Kerala',
    template: '%s | Flyajwa Travels & Holidays',
  },
  description:
    'Flyajwa (Ajwa Travels & Holidays) — Kerala\'s trusted travel agency. Book affordable tour packages to Maldives, Thailand, Dubai, Azerbaijan, Kashmir & more. Visa services, Umrah packages, study abroad & overseas recruitment. Call +91 98466 17000.',
  keywords: [
    'Flyajwa', 'Flyajwa', 'Ajwa Travels', 'Ajwa Holidays',
    'travel agency Kerala', 'tour packages Kerala', 'holiday packages India',
    'Maldives packages from Kerala', 'Thailand tour package',
    'Dubai trip package', 'Azerbaijan tour from India',
    'Kashmir honeymoon package', 'Malaysia travel package',
    'Bali tour package India', 'Vietnam tour', 'Goa package',
    'best travel agency Edappal', 'travel agency Malappuram',
    'visa services Kerala', 'Umrah packages Kerala', 'Hajj packages India',
    'study abroad consultants Kerala', 'overseas recruitment Kerala',
    'flight booking Kerala', 'international tour packages',
    'affordable holiday packages', 'group tour packages India',
    'honeymoon packages from Kerala', 'family vacation packages',
    'document attestation Kerala', 'e-visa processing India',
    'Saudi Arabia visa', 'UAE visa', 'Malaysia visa',
  ],
  authors: [{ name: 'Flyajwa Travels & Holidays' }],
  creator: 'Flyajwa',
  publisher: 'Flyajwa Travels & Holidays',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: 'https://www.flyajwa.com',
  },
  openGraph: {
    title: 'Flyajwa | Best Travel Agency in Kerala — Tours, Visa & Holidays',
    description: 'Book affordable tour packages to Maldives, Thailand, Dubai, Azerbaijan & more. Trusted by 5000+ happy travelers. Visa services, Umrah, study abroad & recruitment.',
    url: 'https://www.flyajwa.com',
    siteName: 'Flyajwa — Ajwa Travels & Holidays',
    images: [
      {
        url: '/assets/img/Ajwa/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Flyajwa — Explore the world with Ajwa Travels & Holidays',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flyajwa — Best Travel Agency in Kerala',
    description: 'Book affordable tour packages. Maldives, Thailand, Dubai, Azerbaijan & more. Call +91 98466 17000.',
    images: ['/assets/img/Ajwa/banner.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/assets/img/icon-flyajwa.png',
    apple: '/assets/img/icon-flyajwa.png',
  },
  metadataBase: new URL('https://www.flyajwa.com'),
  verification: {
    // Add your Google Search Console verification code here
    // google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
  category: 'travel',
};

// JSON-LD Structured Data for Local Business + Travel Agency
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['TravelAgency', 'LocalBusiness'],
  name: 'Flyajwa Travels & Holidays',
  alternateName: 'Flyajwa',
  url: 'https://www.flyajwa.com',
  logo: 'https://www.flyajwa.com/assets/img/Ajwa/logo-ajwa.png',
  image: 'https://www.flyajwa.com/assets/img/Ajwa/banner.jpg',
  description: 'Kerala\'s trusted travel agency offering affordable tour packages, visa services, Umrah packages, study abroad consulting, and overseas recruitment.',
  telephone: ['+919846617000', '+919526617000'],
  email: 'holidays2@ajwatravel.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1st floor, CK Tower, Pattambi Rd',
    addressLocality: 'Edappal',
    addressRegion: 'Kerala',
    postalCode: '679576',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 10.7826368,
    longitude: 76.0070403,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '18:00',
  },
  priceRange: '₹₹',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.7',
    bestRating: '5',
    ratingCount: '100',
    reviewCount: '85',
  },
  sameAs: [
    'https://www.facebook.com/AjwaTravelsandHolidays/',
    'https://www.instagram.com/ajwa_holidayss',
  ],
  areaServed: [
    { '@type': 'City', name: 'Edappal' },
    { '@type': 'City', name: 'Kochi' },
    { '@type': 'City', name: 'Ponnani' },
    { '@type': 'City', name: 'Alappuzha' },
    { '@type': 'State', name: 'Kerala' },
    { '@type': 'Country', name: 'India' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Travel Packages',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'TouristTrip', name: 'Maldives Tour Package', description: 'Explore paradise on earth with our Maldives package starting at ₹24,499 per person.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'TouristTrip', name: 'Thailand Tour Package', description: 'Visit the Land of Smiles with our Thailand package starting at ₹22,999 per person.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'TouristTrip', name: 'Dubai Tour Package', description: 'Experience the City of Gold with our Dubai package starting at ₹25,999 per person.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'TouristTrip', name: 'Azerbaijan Tour Package', description: 'Discover the Land of Fire with our Azerbaijan package starting at ₹29,999 per person.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'TouristTrip', name: 'Kashmir Tour Package', description: 'Visit Paradise of India with our Kashmir package starting at ₹14,999 per person.' } },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="geo.region" content="IN-KL" />
        <meta name="geo.placename" content="Edappal, Kerala" />
        <meta name="geo.position" content="10.7826368;76.0070403" />
        <meta name="ICBM" content="10.7826368, 76.0070403" />
        <Script
          id="json-ld-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                `
              }}
            />
          </>
        )}
      </head>
      <body suppressHydrationWarning>
        <Suspense fallback={null}><VisitorTracker /></Suspense>
        {children}
        <BackToTop />
        <CookieBanner />
      </body>
    </html>
  );
}
