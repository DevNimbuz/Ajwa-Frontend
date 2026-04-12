'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag !== 'function') return;

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}

export function trackEvent(action, category, label, value) {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

export function trackPageView(url) {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('event', 'page_view', {
    page_path: url,
  });
}

export function trackLead(source, destination) {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('event', 'lead', {
    event_category: 'conversion',
    source: source,
    destination: destination,
  });
}

export function trackBooking(packageName, price) {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('event', 'purchase', {
    currency: 'INR',
    value: price,
    items: [{
      item_name: packageName,
      item_category: 'Tour Package',
      price: price,
      quantity: 1,
    }],
  });
}

export function trackSearch(destination) {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('event', 'search', {
    search_term: destination,
  });
}

export function trackWishlist(action, packageName) {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('event', action === 'add' ? 'add_to_wishlist' : 'remove_from_wishlist', {
    item_name: packageName,
    item_category: 'Tour Package',
  });
}

export function trackContact(method) {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('event', 'contact', {
    method: method,
  });
}

export function trackCTAClick(ctaName, location) {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('event', 'cta_click', {
    cta_name: ctaName,
    location: location,
  });
}
