import ReviewsClient from './ReviewsClient';

export const metadata = {
  title: 'Client Reviews & Travel Gallery — Flyajwa',
  description: 'Read real testimonials and reviews from Flyajwa travelers. Explore our curated interactive gallery of amazing moments captured across the globe.',
  alternates: { canonical: 'https://www.flyajwa.com/reviews' },
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}
