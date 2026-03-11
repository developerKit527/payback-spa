import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MerchantCard from './MerchantCard';

describe('MerchantCard', () => {
  const mockMerchant = {
    id: 1,
    name: 'Amazon',
    logoUrl: 'https://example.com/amazon-logo.png',
    cashbackPercentage: 10,
    manualTrackingUrl: 'https://example.com/track/amazon',
  };

  const mockOnActivate = vi.fn();

  beforeEach(() => {
    mockOnActivate.mockClear();
  });

  describe('Rendering', () => {
    it('should render the merchant card with all elements', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      
      expect(screen.getByTestId('merchant-card')).toBeInTheDocument();
      expect(screen.getByTestId('merchant-logo')).toBeInTheDocument();
      expect(screen.getByTestId('merchant-name')).toBeInTheDocument();
      expect(screen.getByTestId('cashback-badge-corner')).toBeInTheDocument();
      expect(screen.getByTestId('shop-earn-button')).toBeInTheDocument();
    });

    it('should display the merchant name', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      
      expect(screen.getByTestId('merchant-name')).toHaveTextContent('Amazon');
    });

    it('should display the merchant logo with correct src and alt', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      
      const logo = screen.getByTestId('merchant-logo');
      expect(logo).toHaveAttribute('src', 'https://example.com/amazon-logo.png');
      expect(logo).toHaveAttribute('alt', 'Amazon logo');
    });

    it('should display the cashback percentage in corner badge', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('10% Cashback');
    });

    it('should display Shop & Earn button', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      
      expect(screen.getByTestId('shop-earn-button')).toHaveTextContent('Shop & Earn');
    });
  });

  describe('Image Fallback', () => {
    it('should display fallback image when logo fails to load', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      
      const logo = screen.getByTestId('merchant-logo');
      fireEvent.error(logo);
      
      expect(logo).toHaveAttribute('src', expect.stringContaining('via.placeholder.com'));
      expect(logo).toHaveAttribute('src', expect.stringContaining('Amazon'));
    });

    it('should use original image URL initially', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      
      const logo = screen.getByTestId('merchant-logo');
      expect(logo).toHaveAttribute('src', 'https://example.com/amazon-logo.png');
    });
  });

  describe('Cashback Rate Display', () => {
    it('should display 5% cashback correctly', () => {
      const merchant = { ...mockMerchant, cashbackPercentage: 5 };
      render(<MerchantCard merchant={merchant} onActivate={mockOnActivate} />);
      
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('5% Cashback');
    });

    it('should display 15% cashback correctly', () => {
      const merchant = { ...mockMerchant, cashbackPercentage: 15 };
      render(<MerchantCard merchant={merchant} onActivate={mockOnActivate} />);
      
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('15% Cashback');
    });

    it('should display 20% cashback correctly', () => {
      const merchant = { ...mockMerchant, cashbackPercentage: 20 };
      render(<MerchantCard merchant={merchant} onActivate={mockOnActivate} />);
      
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('20% Cashback');
    });

    it('should display decimal cashback rates', () => {
      const merchant = { ...mockMerchant, cashbackPercentage: 7.5 };
      render(<MerchantCard merchant={merchant} onActivate={mockOnActivate} />);
      
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('7.5% Cashback');
    });
  });

  describe('Shop & Earn Button Interaction', () => {
    it('should call onActivate when Shop & Earn button is clicked', async () => {
      mockOnActivate.mockResolvedValue(undefined);
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      
      const button = screen.getByTestId('shop-earn-button');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(mockOnActivate).toHaveBeenCalledWith(1);
      });
    });

    it('should disable button during activation', async () => {
      mockOnActivate.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      
      const button = screen.getByTestId('shop-earn-button');
      fireEvent.click(button);
      
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Opening...');
    });

    it('should prevent multiple simultaneous clicks', async () => {
      mockOnActivate.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      
      const button = screen.getByTestId('shop-earn-button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(mockOnActivate).toHaveBeenCalledTimes(1);
      });
    });

    it('should re-enable button after activation completes', async () => {
      mockOnActivate.mockResolvedValue(undefined);
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      
      const button = screen.getByTestId('shop-earn-button');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(button).not.toBeDisabled();
        expect(button).toHaveTextContent('Shop & Earn');
      });
    });
  });

  describe('Styling', () => {
    it('should have correct base styling classes', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      
      const card = screen.getByTestId('merchant-card');
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('rounded-2xl');
      expect(card).toHaveClass('shadow-sm');
      expect(card).toHaveClass('relative');
    });

    it('should have success color with opacity for corner badge', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      
      const badge = screen.getByTestId('cashback-badge-corner');
      expect(badge).toHaveClass('bg-success/10');
      expect(badge).toHaveClass('text-success');
    });

    it('should position corner badge absolutely', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      
      const badge = screen.getByTestId('cashback-badge-corner');
      expect(badge).toHaveClass('absolute');
      expect(badge).toHaveClass('top-4');
      expect(badge).toHaveClass('right-4');
    });

    it('should have fuchsia-600 color for Shop & Earn button', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      
      const button = screen.getByTestId('shop-earn-button');
      expect(button).toHaveClass('bg-fuchsia-600');
      expect(button).toHaveClass('text-white');
    });
  });

  describe('Different Merchants', () => {
    it('should render Flipkart merchant correctly', () => {
      const flipkart = {
        id: 2,
        name: 'Flipkart',
        logoUrl: 'https://example.com/flipkart-logo.png',
        cashbackPercentage: 8,
        manualTrackingUrl: 'https://example.com/track/flipkart',
      };
      
      render(<MerchantCard merchant={flipkart} onActivate={mockOnActivate} />);
      
      expect(screen.getByTestId('merchant-name')).toHaveTextContent('Flipkart');
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('8% Cashback');
    });

    it('should render Myntra merchant correctly', () => {
      const myntra = {
        id: 3,
        name: 'Myntra',
        logoUrl: 'https://example.com/myntra-logo.png',
        cashbackPercentage: 12,
        manualTrackingUrl: 'https://example.com/track/myntra',
      };
      
      render(<MerchantCard merchant={myntra} onActivate={mockOnActivate} />);
      
      expect(screen.getByTestId('merchant-name')).toHaveTextContent('Myntra');
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('12% Cashback');
    });
  });
});
