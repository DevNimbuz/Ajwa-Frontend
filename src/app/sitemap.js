import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.flyajwa.com';

const staticPages = [
  { url: BASE_URL, lastmod: new Date().toISOString(), priority: '1.0', changefreq: 'daily' },
  { url: `${BASE_URL}/about`, lastmod: new Date().toISOString(), priority: '0.8', changefreq: 'monthly' },
  { url: `${BASE_URL}/package`, lastmod: new Date().toISOString(), priority: '0.9', changefreq: 'weekly' },
  { url: `${BASE_URL}/services`, lastmod: new Date().toISOString(), priority: '0.8', changefreq: 'monthly' },
  { url: `${BASE_URL}/contact`, lastmod: new Date().toISOString(), priority: '0.7', changefreq: 'yearly' },
  { url: `${BASE_URL}/reviews`, lastmod: new Date().toISOString(), priority: '0.6', changefreq: 'weekly' },
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
      return data.data?.map(pkg => pkg.slug) || [];
    }
  } catch (error) {
    console.error('Sitemap: Failed to fetch packages', error.message);
  }
  return [];
}

export default async function sitemap() {
  const apiPackages = await fetchPackagesFromAPI();
  const allPackages = apiPackages.length > 0 ? apiPackages : packageSlugs;

  const packagePages = allPackages.map(slug => ({
    url: `${BASE_URL}/package/${slug}`,
    lastmod: new Date().toISOString(),
    priority: '0.8',
    changefreq: 'weekly',
  }));

  return [
    ...staticPages,
    ...packagePages,
  ];
}
