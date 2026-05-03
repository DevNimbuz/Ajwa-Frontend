'use client';
import { FileText, Download, ShieldCheck, FileSearch, Calendar, AlertCircle } from 'lucide-react';

export default function DocumentVaultView({ documents }) {
  if (!documents || documents.length === 0) {
    return (
      <div className="glass-card flex-center" style={{ padding: '80px 20px', flexDirection: 'column', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <FileText size={40} />
        </div>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Your Document Vault is empty</h3>
        <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 400, lineHeight: 1.6 }}>
          Your verified travel vouchers, flight tickets, and visas will appear here once uploaded by our travel experts.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <div className="glass-card" style={{ padding: '24px', background: 'rgba(99, 171, 69, 0.05)', borderColor: 'rgba(99, 171, 69, 0.2)', display: 'flex', alignItems: 'center', gap: 20, borderRadius: 20 }}>
         <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(99, 171, 69, 0.1)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
            <ShieldCheck size={28} />
         </div>
         <div>
            <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>Verified Travel Documents</h4>
            <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Securely access your travel essentials anywhere, anytime.</p>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {documents.map((doc, idx) => (
          <div key={idx} className="glass-card animate-slide-up" style={{ padding: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
               <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#63ab45' }}>
                  <FileSearch size={28} />
               </div>
               <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 100, background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Verified
               </span>
            </div>
            
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{doc.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, color: '#64748b', fontSize: 12, fontWeight: 600 }}>
               <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FileText size={14} /> {doc.type?.toUpperCase()}</span>
               <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} /> {new Date(doc.uploadedAt).toLocaleDateString()}</span>
            </div>
            
            <a 
              href={doc.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: 14, fontWeight: 700, textDecoration: 'none', textAlign: 'center', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
            >
               <Download size={18} /> Download Document
            </a>
          </div>
        ))}
      </div>

      <div style={{ padding: '20px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: 16, border: '1px solid rgba(245, 158, 11, 0.1)', display: 'flex', gap: 16 }}>
         <AlertCircle size={24} color="#f59e0b" style={{ flexShrink: 0 }} />
         <p style={{ margin: 0, fontSize: 14, color: '#94a3b8', lineHeight: 1.6, fontWeight: 500 }}>
            <strong style={{ color: '#f59e0b' }}>Traveler Tip:</strong> We recommend saving these documents to your phone's local storage for offline access during travel in case of poor internet connectivity.
          </p>
      </div>
    </div>
  );
}

