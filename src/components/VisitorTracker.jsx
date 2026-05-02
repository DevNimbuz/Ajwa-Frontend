'use client';
/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Flyajwa — Visitor Tracker Component
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Invisible component that logs page views to the backend
 * Privacy-preserving: IPs are hashed server-side
 * Extracts UTM params from URL for campaign tracking
 */

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { visitorsAPI } from '@/lib/api';

export default function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin')) return;

    // Generate or reuse anonymous session ID
    let sessionId = sessionStorage.getItem('flyajwa_session');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('flyajwa_session', sessionId);
    }

    // Extract UTM params
    const utmSource = searchParams.get('utm_source');
    const utmMedium = searchParams.get('utm_medium');
    const utmCampaign = searchParams.get('utm_campaign');

    // Track page view
    visitorsAPI.track({
      page: pathname,
      referrer: document.referrer || null,
      sessionId,
      utmSource,
      utmMedium,
      utmCampaign,
    });
  }, [pathname]); // Re-track on navigation

  // This component renders nothing
  return null;
}
