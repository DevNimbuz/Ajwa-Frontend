import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Users } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

async function getPackages() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/packages`, {
      next: { revalidate: 60 }
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
}

export default async function PackageGrid() {
  const packages = await getPackages();

  if (packages.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>No packages found. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-3">
      {packages.map((pkg, i) => (
        <AnimatedSection key={pkg.slug} delay={(i % 6) * 0.1}>
          <Link href={`/package/${pkg.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="package-card">
              <div className="package-card-img" style={{ position: 'relative' }}>
                <Image 
                  src={pkg.heroImg || '/assets/img/Ajwa/trek.webp'} 
                  alt={pkg.name}
                  fill
                  className="img-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="package-card-badge">{pkg.tagline}</div>
              </div>
              <div className="package-card-body">
                <h3 className="package-card-title">{pkg.name}</h3>
                <div className="package-card-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {pkg.duration || 'Plan TBD'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} /> {pkg.tourType || 'Private / Group'}
                  </span>
                </div>
                <div className="package-card-footer">
                  <div className="package-card-price">
                    ₹{(pkg.startingPrice || 0).toLocaleString('en-IN')}
                    <span> / person</span>
                  </div>
                  <span className="btn btn-primary btn-sm">
                    View Details
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </AnimatedSection>
      ))}
    </div>
  );
}
