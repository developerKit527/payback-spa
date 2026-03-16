import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MerchantCard from './MerchantCard';

describe('MerchantCard', () => {
  const mockMerchant = {
    id: 1,
    name: 'Amazon India',
    logoUrl: 'https://example.com/amazon-logo.png',
    cashbackRate: 10,
    manualTrackingUrl: null,
  };

  const mockOnActivate = vi.fn();

  beforeEach(() => {
    mockOnActivate.mockClear();
  });

  describe('Rendering', () => {
    it('renders the merchant card with all elements', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      expect(screen.getByTestId('merchant-card')).toBeInTheDocument();
      expect(screen.getByTestId('merchant-logo-container')).toBeInTheDocument();
      expect(screen.getByTestId('merchant-name')).toBeInTheDocument();
      expect(screen.getByTestId('cashback-badge-corner')).toBeInTheDocument();
      expect(screen.getByTestId('shop-earn-button')).toBeInTheDocument();
    });

    it('displays the merchant name', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      expect(screen.getByTestId('merchant-name')).toHaveTextContent('Amazon India');
    });

    it('displays the merchant logo when logoUrl is valid', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      const logo = screen.getByTestId('merchant-logo');
      expect(logo).toHaveAttribute('src', 'https://example.com/amazon-logo.png');
      expect(logo).toHaveAttribute('alt', 'Amazon India logo');
    });

    it('displays "Shop Now →" button text', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      expect(screen.getByTestId('shop-earn-button')).toHaveTextContent('Shop Now');
    });
  });

  describe('Cashback Rate Display', () => {
    it('displays cashback rate as "Upto X% Cashback"', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('Upto 10% Cashback');
    });

    it('displays 5% cashback correctly', () => {
      render(<MerchantCard merchant={{ ...mockMerchant, cashbackRate: 5 }} onActivate={mockOnActivate} />);
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('Upto 5% Cashback');
    });

    it('displays 15% cashback correctly', () => {
      render(<MerchantCard merchant={{ ...mockMerchant, cashbackRate: 15 }} onActivate={mockOnActivate} />);
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('Upto 15% Cashback');
    });

    it('displays decimal cashback rates', () => {
      render(<MerchantCard merchant={{ ...mockMerchant, cashbackRate: 7.5 }} onActivate={mockOnActivate} />);
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('Upto 7.5% Cashback');
    });
  });

  describe('Image Fallback', () => {
    it('shows fallback circle with first letter when logo fails to load', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      const logo = screen.getByTestId('merchant-logo');
      fireEvent.error(logo);
      expect(screen.getByTestId('merchant-logo-fallback')).toBeInTheDocument();
      expect(screen.getByTestId('merchant-logo-fallback')).toHaveTextContent('A');
    });

    it('shows fallback circle when logoUrl is missing', () => {
      render(<MerchantCard merchant={{ ...mockMerchant, logoUrl: null }} onActivate={mockOnActivate} />);
      expect(screen.getByTestId('merchant-logo-fallback')).toBeInTheDocument();
    });

    it('uses original image URL initially', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      const logo = screen.getByTestId('merchant-logo');
      expect(logo).toHaveAttribute('src', 'https://example.com/amazon-logo.png');
    });
  });

  describe('Button Interaction', () => {
    it('calls onActivate when Shop Now button is clicked', async () => {
      mockOnActivate.mockResolvedValue(undefined);
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      fireEvent.click(screen.getByTestId('shop-earn-button'));
      await waitFor(() => expect(mockOnActivate).toHaveBeenCalledWith(1));
    });

    it('disables button during activation', async () => {
      mockOnActivate.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      fireEvent.click(screen.getByTestId('shop-earn-button'));
      expect(screen.getByTestId('shop-earn-button')).toBeDisabled();
      expect(screen.getByTestId('shop-earn-button')).toHaveTextContent('Opening...');
    });

    it('prevents multiple simultaneous clicks', async () => {
      mockOnActivate.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      const button = screen.getByTestId('shop-earn-button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      await waitFor(() => expect(mockOnActivate).toHaveBeenCalledTimes(1));
    });

    it('re-enables button after activation completes', async () => {
      mockOnActivate.mockResolvedValue(undefined);
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      fireEvent.click(screen.getByTestId('shop-earn-button'));
      await waitFor(() => {
        expect(screen.getByTestId('shop-earn-button')).not.toBeDisabled();
        expect(screen.getByTestId('shop-earn-button')).toHaveTextContent('Shop Now');
      });
    });
  });

  describe('Styling', () => {
    it('has correct base card classes', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      const card = screen.getByTestId('merchant-card');
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('rounded-2xl');
      expect(card).toHaveClass('relative');
    });

    it('positions corner badge absolutely', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      const badge = screen.getByTestId('cashback-badge-corner');
      expect(badge).toHaveClass('absolute');
      expect(badge).toHaveClass('top-4');
      expect(badge).toHaveClass('right-4');
    });

    it('button has border-primary and hover:bg-primary classes', () => {
      render(<MerchantCard merchant={mockMerchant} onActivate={mockOnActivate} />);
      const btn = screen.getByTestId('shop-earn-button');
      expect(btn).toHaveClass('border-primary');
      expect(btn).toHaveClass('text-primary');
    });
  });

  describe('Different Merchants', () => {
    it('renders Flipkart merchant correctly', () => {
      const flipkart = { id: 2, name: 'Flipkart', logoUrl: 'https://example.com/flipkart.png', cashbackRate: 8, manualTrackingUrl: null };
      render(<MerchantCard merchant={flipkart} onActivate={mockOnActivate} />);
      expect(screen.getByTestId('merchant-name')).toHaveTextContent('Flipkart');
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('Upto 8% Cashback');
    });

    it('renders Myntra merchant correctly', () => {
      const myntra = { id: 3, name: 'Myntra', logoUrl: 'https://example.com/myntra.png', cashbackRate: 12, manualTrackingUrl: null };
      render(<MerchantCard merchant={myntra} onActivate={mockOnActivate} />);
      expect(screen.getByTestId('merchant-name')).toHaveTextContent('Myntra');
      expect(screen.getByTestId('cashback-badge-corner')).toHaveTextContent('Upto 12% Cashback');
    });
  });
});
