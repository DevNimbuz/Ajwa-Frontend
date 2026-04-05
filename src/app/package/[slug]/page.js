import { notFound } from 'next/navigation';
import packagesData from '@/data/packages';
import siteConfig from '@/data/siteConfig';
import clientSnapshots from '@/data/snapshots';
import PackageClient from './PackageClient';

/**
 * [SEO] Dynamic Metadata Generation
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/packages/${slug}`);
    if (!res.ok) return {};
    const { data: pkg } = await res.json();
    
    if (!pkg) return {};

    const title = `${pkg.name} | Premium ${pkg.duration || 'Tour'} Package | FlyAjwa`;
    const description = (pkg.description || '').slice(0, 160);
    const image = pkg.heroImg || (pkg.gallery?.[0]) || '/assets/img/Ajwa/trek.webp';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [image],
        url: `${siteConfig.url}/package/${slug}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    return { title: 'Package Details | FlyAjwa' };
  }
}

export default async function PackagePage({ params }) {
  const { slug } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/packages/${slug}`, {
      next: { revalidate: 60 }
    });

    let pkg;
    if (res.ok) {
      const body = await res.json();
      pkg = body.data;
    }

    if (!pkg) {
      pkg = packagesData[slug];
    }

    if (!pkg) return notFound();

    const snapshots = clientSnapshots[slug] || [];

    // JSON-LD Structured Data for Google Rich Snippets
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Tour',
      'name': pkg.name,
      'description': pkg.description,
      'image': pkg.heroImg || (pkg.gallery?.[0]),
      'offers': {
        '@type': 'Offer',
        'price': pkg.price || 0,
        'priceCurrency': 'INR',
        'availability': 'https://schema.org/InStock',
      },
      'itinerary': (pkg.itinerary || []).map((day, i) => ({
        '@type': 'City',
        'name': `Day ${i + 1}: ${day.title}`,
        'description': day.description
      }))
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PackageClient 
          pkg={{ ...pkg, slug }} 
          clientSnapshots={snapshots} 
          siteConfig={siteConfig} 
        />
      </>
    );
  } catch (error) {
    console.error('Error loading package page:', error);
    // Final fallback logic
    const staticPkg = packagesData?.[slug];
    if (staticPkg) {
      return (
        <PackageClient 
          pkg={{ ...staticPkg, slug }} 
          clientSnapshots={clientSnapshots[slug] || []} 
          siteConfig={siteConfig} 
        />
      );
    }
    return notFound();
  }
}
