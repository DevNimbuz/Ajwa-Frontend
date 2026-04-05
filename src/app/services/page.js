import ServicesClient from './ServicesClient';

export const metadata = {
  title: 'Our Services — Tours, Visa, Umrah, Study Abroad & More',
  description: 'FlyAjwa services: Tour packages, visa processing (UAE, Saudi, Malaysia), Umrah & Hajj packages, study abroad consulting, overseas recruitment, flight ticketing & document attestation.',
  alternates: { canonical: 'https://www.flyajwa.com/services' },
  openGraph: {
    title: 'Services — FlyAjwa Travels & Holidays',
    description: 'Complete travel solutions — tours, visa processing, Umrah, study abroad, recruitment & more.',
    url: 'https://www.flyajwa.com/services',
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
