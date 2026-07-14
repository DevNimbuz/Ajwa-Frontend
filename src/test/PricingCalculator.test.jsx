import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PricingCalculator from '../components/PricingCalculator';
import { leadsAPI, authAPI } from '@/lib/api';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/lib/api', () => ({
  leadsAPI: {
    submit: vi.fn(),
    trackWhatsAppClick: vi.fn(),
  },
  authAPI: {
    isAuthenticated: vi.fn(),
    getUser: vi.fn(),
  },
}));

describe('PricingCalculator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the pricing calculator with package details', () => {
    render(
      <PricingCalculator 
        packageSlug="maldives-paradise" 
        packageName="Maldives Paradise" 
        basePrice={50000} 
      />
    );

    expect(screen.getByText('Customize Your Package')).toBeInTheDocument();
    expect(screen.getByText('DURATION')).toBeInTheDocument();
    expect(screen.getByText('TRAVELERS')).toBeInTheDocument();
    expect(screen.getByText('FLIGHTS')).toBeInTheDocument();
    expect(screen.getByText('HOTEL')).toBeInTheDocument();
  });

  it('should toggle custom duration input when custom option is selected', async () => {
    render(
      <PricingCalculator 
        packageSlug="maldives-paradise" 
        packageName="Maldives Paradise" 
        basePrice={50000} 
      />
    );

    const customButton = screen.getByRole('button', { name: 'Custom' });
    fireEvent.click(customButton);

    const customInput = screen.getByPlaceholderText('Days');
    expect(customInput).toBeInTheDocument();

    fireEvent.change(customInput, { target: { value: '10' } });
    expect(customInput.value).toBe('10');
  });

  it('should call trackWhatsAppClick when WhatsApp button is clicked', () => {
    leadsAPI.trackWhatsAppClick.mockResolvedValue({ success: true });

    render(
      <PricingCalculator 
        packageSlug="maldives-paradise" 
        packageName="Maldives Paradise" 
        basePrice={50000} 
      />
    );

    const whatsappLink = screen.getByRole('link', { name: /whatsapp/i });
    fireEvent.click(whatsappLink);

    expect(leadsAPI.trackWhatsAppClick).toHaveBeenCalledWith({
      destination: 'Maldives Paradise',
      packageSlug: 'maldives-paradise',
      page: 'package-detail',
      selectedOptions: {
        days: 3,
        flight: false,
        hotelStar: 3,
        groupSize: 1,
      },
    });
  });

  it('should redirect unauthenticated users to login when Book Online is clicked', () => {
    authAPI.isAuthenticated.mockReturnValue(false);

    render(
      <PricingCalculator 
        packageSlug="maldives-paradise" 
        packageName="Maldives Paradise" 
        basePrice={50000} 
      />
    );

    const bookButton = screen.getByRole('button', { name: /book through website/i });
    fireEvent.click(bookButton);

    expect(mockPush).toHaveBeenCalledWith('/login?redirect=/package/maldives-paradise');
  });
});
