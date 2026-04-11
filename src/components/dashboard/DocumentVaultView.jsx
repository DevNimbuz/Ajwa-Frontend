'use client';
import { FileText, Download, ShieldCheck, FileSearch, Calendar, AlertCircle } from 'lucide-react';

export default function DocumentVaultView({ documents }) {
  if (!documents || documents.length === 0) {
    return (
      <div className="glass-card flex-center" style={{ padding: '80px 20px', flexDirection: 'column', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.05)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <FileText size={40} />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Your Document Vault is empty</h3>
        <p style={{ color: '#64748b', fontSize: 15, maxWidth: 400 }}>
          Your verified travel vouchers, flight tickets, and visas will appear here once uploaded by our travel experts.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div className="glass-card" style={{ padding: '24px', background: 'rgba(99, 171, 69, 0.02)', borderColor: 'rgba(99, 171, 69, 0.2)', display: 'flex', alignItems: 'center', gap: 16 }}>
         <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99, 171, 69, 0.1)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
         </div>
         <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: 0 }}>Verified Travel Documents</h4>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Securely access your travel essentials anywhere, anytime.</p>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {documents.map((doc, idx) => (
          <div key={idx} className="glass-card animate-slide-up" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
               <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#63ab45' }}>
                  <FileSearch size={24} />
               </div>
               <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 100, background: '#f0fdf4', color: '#16a34a', textTransform: 'uppercase' }}>
                  Verified
               </span>
            </div>
            
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{doc.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, color: '#94a3b8', fontSize: 12 }}>
               <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FileText size={14} /> {doc.type?.toUpperCase()}</span>
               <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {new Date(doc.uploadedAt).toLocaleDateString()}</span>
            </div>
            
            <a 
              href={doc.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: 13, textDecoration: 'none', textAlign: 'center' }}
            >
               <Download size={16} /> Download File
            </a>
          </div>
        ))}
      </div>

      <div style={{ padding: 16, background: '#fffbeb', borderRadius: 12, border: '1px solid #fde68a', display: 'flex', gap: 12 }}>
         <AlertCircle size={20} color="#d97706" style={{ flexShrink: 0 }} />
         <p style={{ margin: 0, fontSize: 13, color: '#92400e', lineHeight: 1.5 }}>
            <strong>Important Tip:</strong> We recommend saving these documents to your phone's local storage for offline access during travel in case of poor internet connectivity.
          </p>
      </div>
    </div>
  );
}
