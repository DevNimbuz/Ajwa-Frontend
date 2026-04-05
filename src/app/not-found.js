import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="not-found-page">
        <div className="not-found-number">404</div>
        <h2 className="heading-2" style={{ marginBottom: '1rem' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: 480, marginBottom: '2rem' }}>
          Looks like this page has gone on vacation! Let us help you find your
          way back to an amazing travel experience.
        </p>
        <Link href="/" className="btn btn-primary btn-lg">
          Back to Home
        </Link>
      </div>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
