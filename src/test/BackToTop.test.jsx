import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BackToTop from '../components/BackToTop';

describe('BackToTop Component', () => {
  it('should not render initially when scroll position is 0', () => {
    render(<BackToTop />);
    const button = screen.queryByRole('button', { name: /back to top/i });
    expect(button).toBeNull();
  });

  it('should render when scroll position is greater than 300', () => {
    render(<BackToTop />);
    
    // Simulate scrolling down
    window.scrollY = 350;
    fireEvent.scroll(window);
    
    const button = screen.getByRole('button', { name: /back to top/i });
    expect(button).toBeInTheDocument();
  });

  it('should scroll window to top when clicked', () => {
    window.scrollTo = vi.fn();
    render(<BackToTop />);
    
    // Simulate scroll down to make it visible
    window.scrollY = 350;
    fireEvent.scroll(window);
    
    const button = screen.getByRole('button', { name: /back to top/i });
    fireEvent.click(button);
    
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    });
  });
});
