'use client';
import { useState, useEffect } from 'react';
import { Download, CreditCard, CheckCircle, Clock, Upload, Loader2, AlertCircle } from 'lucide-react';
import { leadsAPI, settingsAPI } from '@/lib/api';

export default function InvoiceView({ trip, trips, onUpdate }) {
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [uploading, setUploading] = useState(false);

  const invoice = trip.invoice;
  const payment = trip.paymentProof;

  useEffect(() => {
    settingsAPI.getPublic().then(data => {
      if (data.success) {
        setQrCode(data.data.payment_qr_code);
      }
    });
  }, []);

  const handleRedeem = async () => {
    setLoading(true);
    try {
      await leadsAPI.redeemPoints(trip._id, pointsToRedeem);
      onUpdate(); // Trigger refresh
      alert('Points applied! Staff will regenerate your invoice shortly.');
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'flyajwa_leads'); // Placeholder preset

      // Use the existing system upload if possible or a dedicated one
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      await leadsAPI.submitPayment(trip._id, data.secure_url);
      onUpdate();
      alert('Payment proof uploaded! Our team will verify it shortly.');
    } catch (err) { alert('Upload failed. Please try again.'); }
    finally { setUploading(false); }
  };

  if (!invoice) return null;

  return (
    <div className="animate-fade-in" style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)' }}>
      {/* Invoice Header */}
      <div style={{ background: 'linear-gradient(135deg, #63ab45, #4d8a35)', padding: '24px 32px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <img src="/logo-white.png" alt="Flyajwa" style={{ height: 32, marginBottom: 8 }} onError={(e) => e.target.src = 'https://flyajwa.com/logo.png'} />
            <div style={{ fontSize: 12, opacity: 0.8 }}>Flyajwa Travels & Holidays</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>INVOICE</h3>
            <div style={{ fontSize: 12, opacity: 0.8 }}>#{invoice.invoiceId}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        {/* Bill To */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Bill To</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{trip.name}</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>{trip.email || trip.phone}</div>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              <th style={{ textAlign: 'left', padding: '12px 0', fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Description</th>
              <th style={{ textAlign: 'right', padding: '12px 0', fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '16px 0', fontSize: 14, color: '#1e293b', fontWeight: 500 }}>{item.description}</td>
                <td style={{ padding: '16px 0', fontSize: 14, color: '#1e293b', fontWeight: 700, textAlign: 'right' }}>₹{(item.amount || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 40 }}>
          <div style={{ width: '100%', maxWidth: 240 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
              <span style={{ color: '#64748b' }}>Subtotal</span>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>₹{(invoice.subtotal || 0).toLocaleString()}</span>
            </div>
            {invoice.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#ef4444' }}>
                <span>Discount</span>
                <span>-₹{(invoice.discount || 0).toLocaleString()}</span>
              </div>
            )}
            {invoice.pointsRedeemed > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#3b82f6' }}>
                <span>Points Used</span>
                <span>-₹{(invoice.pointsRedeemed || 0).toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '2px solid #f1f5f9' }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#1e293b' }}>Total Pay</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#63ab45' }}>₹{(invoice.total || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {/* Redeem Points */}
          {invoice.status !== 'PAID' && (
            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={16} color="#f59e0b" /> Redeem Ajwa Points
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                Available Balance: <span style={{ fontWeight: 700, color: '#f59e0b' }}>{trips?.pointsBalance || 0} Points</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input 
                  type="number" 
                  max={trips?.pointsBalance}
                  placeholder="Points"
                  value={pointsToRedeem}
                  onChange={(e) => setPointsToRedeem(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                />
                <button 
                  onClick={handleRedeem}
                  disabled={loading || pointsToRedeem <= 0}
                  className="btn btn-primary" 
                  style={{ padding: '0 16px', height: 40, fontSize: 12 }}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}
                </button>
              </div>
            </div>
          )}

          {/* Payment Section */}
          <div style={{ background: '#f0f9ff', padding: 20, borderRadius: 16, border: '1px solid #e0f2fe' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0369a1', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard size={16} /> Payment Options
            </div>
            {payment?.status === 'VERIFIED' ? (
              <div style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                <CheckCircle size={18} /> Payment Completed
              </div>
            ) : payment?.status === 'PENDING' ? (
              <div style={{ color: '#0369a1', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                <Clock size={18} /> Verification Pending
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  {qrCode ? (
                    <img src={qrCode} alt="Payment QR" style={{ width: 80, height: 80, borderRadius: 8, background: '#fff', padding: 4 }} />
                  ) : (
                    <div style={{ width: 80, height: 80, background: '#e2e8f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AlertCircle size={20} color="#94a3b8" />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>Scan QR and upload screenshot below</div>
                    <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, height: 32 }}>
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <><Upload size={14} /> Upload Proof</>}
                      <input type="file" hidden accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
