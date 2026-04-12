'use client';
import { useState, useRef, useEffect } from 'react';
import { MapPin, Plane, Search } from 'lucide-react';

const AIRPORTS = [
  { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi International Airport', country: 'India' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International Airport', country: 'India' },
  { code: 'BLR', city: 'Bangalore', name: 'Kempegowda International Airport', country: 'India' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai International Airport', country: 'India' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International Airport', country: 'India' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport', country: 'India' },
  { code: 'COK', city: 'Kochi', name: 'Cochin International Airport', country: 'India' },
  { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel International Airport', country: 'India' },
  { code: 'PNQ', city: 'Pune', name: 'Pune Airport', country: 'India' },
  { code: 'GOI', city: 'Goa', name: 'Goa International Airport', country: 'India' },
  { code: 'JAI', city: 'Jaipur', name: 'Jaipur International Airport', country: 'India' },
  { code: 'LKO', city: 'Lucknow', name: 'Amausi Airport', country: 'India' },
  { code: 'GAU', city: 'Guwahati', name: 'Lokpriya Gopinath Bordoloi International Airport', country: 'India' },
  { code: 'TRV', city: 'Thiruvananthapuram', name: 'Trivandrum International Airport', country: 'India' },
  { code: 'IXC', city: 'Chandigarh', name: 'Chandigarh International Airport', country: 'India' },
  { code: 'NAG', city: 'Nagpur', name: 'Dr. Babasaheb Ambedkar International Airport', country: 'India' },
  { code: 'PAT', city: 'Patna', name: 'Jay Prakash Narayan International Airport', country: 'India' },
  { code: 'IXB', city: 'Bagdogra', name: 'Bagdogra Airport', country: 'India' },
  { code: 'IXR', city: 'Ranchi', name: 'Birsa Munda Airport', country: 'India' },
  { code: 'BBI', city: 'Bhubaneswar', name: 'Biju Patnaik International Airport', country: 'India' },
  { code: 'VNS', city: 'Varanasi', name: 'Lal Bahadur Shastri Airport', country: 'India' },
  { code: 'SXR', city: 'Srinagar', name: 'Sheikh ul-Alam International Airport', country: 'India' },
  { code: 'DIB', city: 'Dibrugarh', name: 'Dibrugarh Airport', country: 'India' },
  { code: 'IMF', city: 'Imphal', name: 'Imphal International Airport', country: 'India' },
  { code: 'CCJ', city: 'Kozhikode', name: 'Calicut International Airport', country: 'India' },
  { code: 'MCT', city: 'Muscat', name: 'Muscat International Airport', country: 'Oman' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai International Airport', country: 'UAE' },
  { code: 'AUH', city: 'Abu Dhabi', name: 'Abu Dhabi International Airport', country: 'UAE' },
  { code: 'SHJ', city: 'Sharjah', name: 'Sharjah International Airport', country: 'UAE' },
  { code: 'JED', city: 'Jeddah', name: 'King Abdulaziz International Airport', country: 'Saudi Arabia' },
  { code: 'RUH', city: 'Riyadh', name: 'King Khalid International Airport', country: 'Saudi Arabia' },
  { code: 'MED', city: 'Madinah', name: 'Prince Mohammad Bin Abdulaziz Airport', country: 'Saudi Arabia' },
  { code: 'DMM', city: 'Dammam', name: 'King Fahd International Airport', country: 'Saudi Arabia' },
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy International Airport', country: 'USA' },
  { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International Airport', country: 'USA' },
  { code: 'ORD', city: 'Chicago', name: "O'Hare International Airport", country: 'USA' },
  { code: 'LHR', city: 'London', name: 'Heathrow Airport', country: 'UK' },
  { code: 'LGW', city: 'London', name: 'Gatwick Airport', country: 'UK' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai International Airport', country: 'UAE' },
  { code: 'SIN', city: 'Singapore', name: 'Changi Airport', country: 'Singapore' },
  { code: 'KUL', city: 'Kuala Lumpur', name: 'Kuala Lumpur International Airport', country: 'Malaysia' },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi Airport', country: 'Thailand' },
  { code: 'HKG', city: 'Hong Kong', name: 'Hong Kong International Airport', country: 'Hong Kong' },
  { code: 'NRT', city: 'Tokyo', name: 'Narita International Airport', country: 'Japan' },
  { code: 'HND', city: 'Tokyo', name: 'Haneda Airport', country: 'Japan' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle Airport', country: 'France' },
  { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt Airport', country: 'Germany' },
  { code: 'IST', city: 'Istanbul', name: 'Istanbul Airport', country: 'Turkey' },
  { code: 'DOH', city: 'Doha', name: 'Hamad International Airport', country: 'Qatar' },
  { code: 'CAI', city: 'Cairo', name: 'Cairo International Airport', country: 'Egypt' },
];

export default function AirportAutocomplete({ value, onChange, placeholder, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value.length >= 1) {
      const query = value.toLowerCase();
      const filtered = AIRPORTS.filter(airport => 
        airport.code.toLowerCase().includes(query) ||
        airport.city.toLowerCase().includes(query) ||
        airport.name.toLowerCase().includes(query) ||
        airport.country.toLowerCase().includes(query)
      ).slice(0, 6);
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (airport) => {
    onChange(`${airport.city} (${airport.code})`);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase' }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <MapPin size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => value.length >= 1 && suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          style={{ width: '100%', padding: '14px 16px 14px 44px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 15, outline: 'none' }}
          autoComplete="off"
        />
      </div>
      
      {isOpen && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          zIndex: 1000,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}>
          {suggestions.map((airport, idx) => (
            <button
              key={`${airport.code}-${idx}`}
              type="button"
              onClick={() => handleSelect(airport)}
              style={{
                width: '100%',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                border: 'none',
                background: idx === 0 ? '#f8fafc' : '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                borderBottom: idx < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.target.style.background = '#f8fafc'}
              onMouseLeave={e => e.target.style.background = idx === 0 ? '#f8fafc' : '#fff'}
            >
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 8, 
                background: 'rgba(99, 171, 69, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Plane size={18} style={{ color: '#63ab45', transform: 'rotate(-45deg)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{airport.city}</span>
                  <span style={{ 
                    background: '#e2e8f0', 
                    padding: '2px 6px', 
                    borderRadius: 4, 
                    fontSize: 11, 
                    fontWeight: 700,
                    color: '#475569',
                    flexShrink: 0
                  }}>
                    {airport.code}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {airport.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
