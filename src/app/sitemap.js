import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.flyajwa.com';
const STABLE_LASTMOD = '2026-06-13T00:00:00.000Z';

const staticPages = [
  { url: BASE_URL, lastmod: STABLE_LASTMOD, priority: '1.0', changefreq: 'daily' },
  { url: `${BASE_URL}/about`, lastmod: STABLE_LASTMOD, priority: '0.8', changefreq: 'monthly' },
  { url: `${BASE_URL}/package`, lastmod: STABLE_LASTMOD, priority: '0.9', changefreq: 'weekly' },
  { url: `${BASE_URL}/services`, lastmod: STABLE_LASTMOD, priority: '0.8', changefreq: 'monthly' },
  { url: `${BASE_URL}/contact`, lastmod: STABLE_LASTMOD, priority: '0.7', changefreq: 'yearly' },
  { url: `${BASE_URL}/reviews`, lastmod: STABLE_LASTMOD, priority: '0.6', changefreq: 'weekly' },
];

const packageSlugs = [
  'maldives-package',
  'thailand-package',
  'azerbaijan-package',
  'dubai-package',
  'kashmir-package',
  'malaysia-package',
];

async function fetchPackagesFromAPI() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/packages`, {
      next: { revalidate: 3600 }
    });
    if (res.ok) {
      const data = await res.json();
      const slugs = data.data?.map(pkg => pkg.slug) || [];
      if (slugs.length === 0 && process.env.NODE_ENV === 'production') {
        throw new Error('Fetched packages list is empty in production sitemap generation');
      }
      return slugs;
    } else {
      throw new Error(`API returned status code ${res.status}`);
    }
  } catch (error) {
    console.error('Sitemap: Failed to fetch packages', error.message);
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Sitemap package fetch failed: ${error.message}`);
    }
  }
  return [];
}

export default async function sitemap() {
  const apiPackages = await fetchPackagesFromAPI();
  const allPackages = apiPackages.length > 0 ? apiPackages : packageSlugs;

  const packagePages = allPackages.map(slug => ({
    url: `${BASE_URL}/package/${slug}`,
    lastmod: STABLE_LASTMOD,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  return [
    ...staticPages,
    ...packagePages,
  ];
}

